import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import FontIcon from 'components/icon';
import * as Crypto from 'constants/functions/crypto';
import * as Download from 'constants/functions/download';
import * as Utils from 'constants/functions/utils';
import type { RootState } from 'constants/reducers';
import type {
  FileFormat,
  GoogleFont,
  PaymentHash,
  RequestBody,
} from 'constants/types';
import * as C from 'styles/Components.styles';
import { COLOR } from 'styles/Constants.styles';
import { EditorHeader as EH } from 'styles/pages/design/DesignEditor.styles';

export default function EditorHeader({
  dummyTextRef,
  fonts,
}: EditorHeaderProps) {
  const [state, setState] = useState<EditorHeaderState>({
    isMenuVisible: false,
    downloadInProgress: false,
  });
  const appState = useSelector((state: RootState) => state);

  const menuRef = useRef<HTMLMenuElement>(null);

  const queryHash = useMemo(() => {
    return Crypto.encryptJSON<PaymentHash>({
      quantity: appState.namesList.length,
      format: appState.fileFormat,
    });
  }, [appState.namesList, appState.fileFormat]);

  // TODO: Create reusable hook since this and color picker share the same
  // logic.
  useEffect(() => {
    if (state.isMenuVisible) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'initial';
    }

    const hideTestToolsMenu = (e: MouseEvent) => {
      if (!state.isMenuVisible) return;

      const menu = menuRef.current!;
      if (menu && !menu.contains(e.target as Node)) {
        setState((current) => ({
          ...current,
          isMenuVisible: false,
        }));
      }
    };

    window.addEventListener('mousedown', hideTestToolsMenu);
    return () => {
      window.removeEventListener('mousedown', hideTestToolsMenu);
    };
  }, [setState, state.isMenuVisible]);

  function showMenu(): void {
    setState((current) => ({
      ...current,
      isMenuVisible: true,
    }));
  }

  /**
   * Performs a download.
   */
  async function download(format: FileFormat, asZip?: boolean) {
    if (!appState.imageSrc) {
      alert('No image');
      return;
    }

    setState((current) => ({
      ...current,
      downloadInProgress: true,
    }));

    // Determine wrap fragments for each name.
    const dummyText = dummyTextRef.current;
    if (!dummyText) return;
    const fragmentedNamesList = appState.namesList.map((name) =>
      Utils.splitTextIntoWrapFragments(dummyText, name, 0),
    );
    const selectedNameFragments = Utils.splitTextIntoWrapFragments(
      dummyText,
      appState.selectedName,
      appState.draggable.style.maxWidth,
    );

    const selectedFont = fonts.find((font) => {
      return font.family === appState.draggable.style.fontFamily;
    })!;

    // TODO: Validate request body.
    const requestBody: RequestBody = {
      backgroundImageSrc: appState.imageSrc,
      draggable: appState.draggable,
      fileNameTemplate: appState.fileNameTemplate,
      format: format as FileFormat,
      fontId: selectedFont.family,
      dimensions: appState.imageDimensions,
      fragmentedNamesList,
      selectedNameFragments,
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
          await Download.singlePNGImage(
            payload,
            appState.imageDimensions,
            appState.imageDimensions,
          );
        } else if (format === 'svg') {
          await Download.singleSVGImage(payload);
        }
      }
    } catch (e) {
      alert(e);
    } finally {
      setState((current) => ({
        ...current,
        downloadInProgress: false,
      }));
    }
  }

  return (
    <EH.Header>
      <Link href={'/design/#2'}>
        <C.Link id={'back-setup'}>
          <FontIcon icon={faChevronLeft} spaceRight={true} />
          Back to Setup
        </C.Link>
      </Link>
      <EH.SiteLogo />
      <EH.ActionSection>
        <Link href={`/payment/checkout?q=${queryHash}`}>
          <EH.HeaderButton id={'pay'} bgColor={COLOR.PRIMARY_3_LIGHT}>
            Checkout
          </EH.HeaderButton>
        </Link>
        <EH.MenuTrigger>
          <EH.HeaderButton bgColor={COLOR.PRIMARY_3_NEUTRAL} onClick={showMenu}>
            Test Tools
          </EH.HeaderButton>
          <EH.Menu visible={state.isMenuVisible} ref={menuRef}>
            <EH.MenuButton
              id={'download-png'}
              onClick={() => download('png')}
              bgColor={COLOR.PRIMARY_5_LIGHT}>
              Download PNG
            </EH.MenuButton>
            <EH.MenuButton
              id={'download-pdf'}
              onClick={() => download('pdf')}
              bgColor={COLOR.PRIMARY_3_DARK}>
              Download PDF
            </EH.MenuButton>
            <EH.MenuButton
              id={'download-svg'}
              onClick={() => download('svg')}
              bgColor={COLOR.PRIMARY_3_LIGHT}>
              Download SVG
            </EH.MenuButton>
            <EH.MenuButton
              id={'download-png-archive'}
              onClick={() => download('png', true)}
              bgColor={COLOR.PRIMARY_3_NEUTRAL}>
              Download PNG archive
            </EH.MenuButton>
            <EH.MenuButton
              id={'download-pdf-archive'}
              onClick={() => download('pdf', true)}
              bgColor={COLOR.PRIMARY_4_NEUTRAL}>
              Download PDF archive
            </EH.MenuButton>
            <EH.MenuButton
              id={'download-svg-archive'}
              onClick={() => download('svg', true)}
              bgColor={COLOR.SECONDARY_3}>
              Download SVG archive
            </EH.MenuButton>
          </EH.Menu>
        </EH.MenuTrigger>
      </EH.ActionSection>
    </EH.Header>
  );
}

interface EditorHeaderProps {
  dummyTextRef: React.RefObject<SVGTextElement>;
  fonts: GoogleFont[];
}

interface EditorHeaderState {
  isMenuVisible: boolean;
  downloadInProgress: boolean;
}
