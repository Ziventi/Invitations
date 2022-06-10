import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProgressOverlay from 'components/progress';
import type { AppDispatch, RootState } from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type { GoogleFont } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';
import EditorHeader from 'fragments/design/editor/EditorHeader';
import LeftSidebar from 'fragments/design/editor/LeftSidebar';
import Preview from 'fragments/design/editor/Preview';
import RightSidebar from 'fragments/design/editor/RightSidebar';
import { Default as DE } from 'styles/pages/design/DesignEditor.styles';

const DesignEditorPage: NextPage<DesignEditorProps> = ({ fonts }) => {
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  // Toggle cursor type when color picker is visible.
  // Hide color picker if clicked outside of color picker.
  useEffect(() => {
    if (isColorPickerVisible) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'initial';
    }

    const hideColorPicker = (e: MouseEvent) => {
      if (!isColorPickerVisible) return;

      const colorPicker = colorPickerRef.current!;
      if (colorPicker && !colorPicker.contains(e.target as Node)) {
        setColorPickerVisible(false);
      }
    };

    window.addEventListener('mousedown', hideColorPicker);
    return () => {
      window.removeEventListener('mousedown', hideColorPicker);
    };
  }, [dispatch, isColorPickerVisible]);

  // Load a new font on a new font family selection.
  useEffect(() => {
    import('webfontloader')
      .then((WebFont) => {
        const family = `${appState.draggable.style.fontFamily}:${appState.draggable.style.fontStyle}`;
        WebFont.load({
          google: {
            families: [family],
            text: appState.selectedName,
          },
        });
      })
      .catch(console.error);
  }, [
    appState.selectedName,
    appState.draggable.style.fontFamily,
    appState.draggable.style.fontStyle,
  ]);

  // Change selected name if the names list changes.
  useEffect(() => {
    updateState({
      selectedName: appState.namesList[0] || '',
    });
  }, [dispatch, appState.namesList]);

  return (
    <DE.Page>
      <EditorHeader fonts={fonts} />
      <DE.Main>
        <LeftSidebar
          colorPickerRef={colorPickerRef}
          fonts={fonts}
          useColorPicker={[isColorPickerVisible, setColorPickerVisible]}
        />
        <Preview />
        <RightSidebar />
        <ProgressOverlay state={appState} />
      </DE.Main>
    </DE.Page>
  );
};

export const getStaticProps: GetStaticProps<DesignEditorProps> = async () => {
  const res = await fetch(GOOGLE_FONT_HOST);
  const fonts: GoogleFont[] = await res.json();

  return {
    props: {
      fonts: fonts
        .sort((a, b) => a.family.localeCompare(b.family))
        .map((font) => ({
          id: font.id,
          family: font.family,
          variants: font.variants,
        })),
    },
  };
};

export default DesignEditorPage;

interface DesignEditorProps {
  fonts: GoogleFont[];
}
