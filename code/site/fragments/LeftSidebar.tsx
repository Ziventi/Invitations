import Link from 'next/link';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ZiventiLogo from 'components/logo';
import { drawOnCanvas } from 'constants/functions/canvas';
import * as Download from 'constants/functions/download';
import { GoogleFont, RequestBody } from 'constants/types';
import DesignForm from 'fragments/DesignForm';
import { PageStatePayload, updateState } from 'reducers/slice';
import { RootState } from 'reducers/store';

export default function LeftSidebar({ canvasRef, fonts }: LeftSidebarProps) {
  const state = useSelector(({ state }: RootState) => state);
  const dispatch = useDispatch();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

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
      <button id={'download-png-archive'} onClick={() => download('png', true)}>
        Download PNG archive
      </button>
      <button id={'download-pdf-archive'} onClick={() => download('pdf', true)}>
        Download PDF archive
      </button>
      <Link href={'/'}>Back to Home</Link>
    </aside>
  );
}

interface LeftSidebarProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fonts: GoogleFont[];
}
