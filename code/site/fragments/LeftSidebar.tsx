import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { drawOnCanvas } from 'constants/functions/canvas';
import * as Crypto from 'constants/functions/crypto';
import * as Download from 'constants/functions/download';
import {
  AppDispatch,
  PageStatePayload,
  RootState,
  updateState,
} from 'constants/reducers';
import { GoogleFont, PaymentHash, RequestBody } from 'constants/types';
import DesignForm from 'fragments/DesignForm';
import { LeftSidebar as LSidebar } from 'styles/Design/Editor.styles';
import { COLOR } from 'styles/Library';

export default function LeftSidebar({ canvasRef, fonts }: LeftSidebarProps) {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const queryHash = useMemo(() => {
    return Crypto.encryptJSON<PaymentHash>({
      quantity: state.namesList.length,
      format: state.fileFormat,
    });
  }, [state.namesList, state.fileFormat]);

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

    // TODO: Validate request body.
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
          await Download.singlePNGImage(
            payload,
            state.canvasDimensions,
            state.imageDimensions,
          );
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
    <LSidebar.Aside>
      <DesignForm fonts={fonts} />
      <LSidebar.Button
        id={'preview'}
        onClick={preview}
        bgColor={COLOR.PRIMARY_2_DARK}>
        Draw
      </LSidebar.Button>
      <Link href={`/checkout?q=${queryHash}`}>
        <LSidebar.Button id={'pay'} bgColor={COLOR.PRIMARY_2}>
          Checkout
        </LSidebar.Button>
      </Link>
      <LSidebar.Button
        id={'download-png'}
        onClick={() => download('png')}
        bgColor={COLOR.PRIMARY_5_LIGHT}>
        Download PNG
      </LSidebar.Button>
      <LSidebar.Button
        id={'download-pdf'}
        onClick={() => download('pdf')}
        bgColor={COLOR.PRIMARY_5}>
        Download PDF
      </LSidebar.Button>
      <LSidebar.Button
        id={'download-png-archive'}
        onClick={() => download('png', true)}
        bgColor={COLOR.PRIMARY_3}>
        Download PNG archive
      </LSidebar.Button>
      <LSidebar.Button
        id={'download-pdf-archive'}
        onClick={() => download('pdf', true)}
        bgColor={COLOR.PRIMARY_4}>
        Download PDF archive
      </LSidebar.Button>
      <Link href={'/design'}>Back to Design</Link>
    </LSidebar.Aside>
  );
}

interface LeftSidebarProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fonts: GoogleFont[];
}
