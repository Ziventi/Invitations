import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DesignForm from 'components/designform';
import DragZone from 'components/dragzone';
import ZiventiLogo from 'components/logo';
import MetadataBar from 'components/metadatabar';
import NameList from 'components/namelist';
import { drawOnCanvas } from 'constants/functions/canvas';
import * as Download from 'constants/functions/download';
import { GoogleFont, PageState, RequestBody } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';
import { PageStatePayload, updateState } from 'reducers/slice';
import { RootState } from 'reducers/store';
import TestData from 'test/test.json';

const DesignPage: NextPage<DesignPageProps> = ({ fonts }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const useDraggableRef = useState(draggableRef);

  const state = useSelector(({ state }: RootState) => state);
  const dispatch = useDispatch();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  // TODO: Remove (dev purposes only)
  useEffect(() => {
    setState({
      namesList: TestData.names,
      imageSrc: TestData.imageSource,
    });
  }, [setState]);

  // Toggle cursor type when color picker is visible.
  // Hide color picker if clicked outside of color picker.
  useEffect(() => {
    if (state.isColorPickerVisible) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'initial';
    }

    const hideColorPicker = (e: MouseEvent) => {
      if (!state.isColorPickerVisible) return;

      const isColorPicker = document
        .elementsFromPoint(e.pageX, e.pageY)
        .some((element) => {
          return element.classList.contains('color-picker');
        });

      if (!isColorPicker) {
        setState({
          isColorPickerVisible: false,
        });
      }
    };

    window.addEventListener('mousedown', hideColorPicker);
    return () => {
      window.removeEventListener('mousedown', hideColorPicker);
    };
  }, [setState, state.isColorPickerVisible]);

  // Load a new font on a new font family selection.
  useEffect(() => {
    import('webfontloader')
      .then((WebFont) => {
        WebFont.load({
          google: {
            families: [state.textStyle.fontFamily],
            text: state.selectedName,
          },
        });
      })
      .catch(console.error);
  }, [state.selectedName, state.textStyle.fontFamily]);

  // Change selected name if the names list changes.
  useEffect(() => {
    setState({
      selectedName: state.namesList[0] || '',
    });
  }, [setState, state.namesList]);

  // Called each time the image source changes.
  useEffect(() => {
    if (!state.imageSrc) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.src = state.imageSrc;
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      const scale = (scaleX + scaleY) / 2;

      setState({
        canvasDimensions: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        },
        imageDimensions: {
          width: img.width,
          height: img.height,
        },
        textStyle: {
          scale,
          scaleX,
          scaleY,
        },
      });

      // TODO: Dev Only
      const draggable = draggableRef.current!;
      if (draggable) {
        draggable.style.top = '0px';
        draggable.style.left = '0px';
      }
    };
  }, [setState, state.imageSrc]);

  // Adjust draggable position when top or left values are changed.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      draggable.style.top = `${state.textStyle.top}px`;
      draggable.style.left = `${state.textStyle.left}px`;
    }
  }, [state.textStyle.left, state.textStyle.top]);

  function preview(): void {
    const canvas = canvasRef.current!;
    drawOnCanvas(canvas, state.selectedName, state.textStyle);
  }

  /**
   * Performs a download.
   */
  async function download(format: 'pdf' | 'png', asZip?: boolean) {
    if (!state.imageSrc) return alert('No image');

    setState({
      downloadInProgress: true,
    });

    const selectedFont = fonts.find((font) => {
      return font.family === state.textStyle.fontFamily;
    })!;

    const requestBody: RequestBody = {
      backgroundImageSrc: state.imageSrc,
      fileNameTemplate: state.fileNameTemplate,
      format,
      fontId: selectedFont.id,
      dimensions: state.imageDimensions,
      namesList: state.namesList,
      selectedName: state.selectedName,
      textStyle: state.textStyle,
    };

    const payload: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    try {
      if (asZip) {
        await Download.archive(payload);
      } else {
        if (format === 'pdf') {
          await Download.singlePDFFile(payload);
        } else if (format === 'png') {
          await Download.singlePNGImage(payload, state.canvasDimensions);
        }
      }
    } catch (e) {
      alert(e);
    } finally {
      setState({
        downloadInProgress: false,
      });
    }
  }

  return (
    <main className={'design'}>
      <aside className={'controls'}>
        <header>
          {/* <Link href={'/'}> */}
          <ZiventiLogo
            layout={'fill'}
            objectFit={'contain'}
            objectPosition={'left'}
            className={'site-logo'}
          />
          {/* </Link> */}
        </header>

        <DesignForm fonts={fonts} />
        <button id={'preview'} onClick={preview}>
          Draw
        </button>
        <Link href={'/payment'}>
          <button id={'pay'}>Pay</button>
        </Link>
        <button id={'download-png'} onClick={() => download('png')}>
          Download PNG
        </button>
        <button id={'download-pdf'} onClick={() => download('pdf')}>
          Download PDF
        </button>
        <button
          id={'download-png-archive'}
          onClick={() => download('png', true)}>
          Download PNG archive
        </button>
        <button
          id={'download-pdf-archive'}
          onClick={() => download('pdf', true)}>
          Download PDF archive
        </button>
        <Link href={'/'}>Back to Home</Link>
      </aside>
      <section className={'preview'}>
        <div className={'preview-main'}>
          <canvas ref={canvasRef} />
          <DragZone useDraggableRef={useDraggableRef} ref={draggableRef} />
        </div>
        <MetadataBar />
      </section>
      <NameList />
      <ProgressOverlay state={state} />
    </main>
  );
};

function ProgressOverlay({ state }: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return <dialog className={'loading'}>Loading...</dialog>;
}

export const getStaticProps: GetStaticProps<DesignPageProps> = async () => {
  const res = await fetch(GOOGLE_FONT_HOST);
  const fonts: GoogleFont[] = await res.json();
  return {
    props: {
      fonts: fonts
        .sort((a, b) => a.family.localeCompare(b.family))
        .map((font) => ({ id: font.id, family: font.family })),
    },
  };
};

export default DesignPage;

interface DesignPageProps {
  fonts: GoogleFont[];
}

interface ProgressOverlayProps {
  state: PageState;
}
