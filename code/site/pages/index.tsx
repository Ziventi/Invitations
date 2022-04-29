import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import DesignForm from 'components/designform';
import DragZone from 'components/dragzone';
import { drawOnCanvas } from 'constants/functions/canvas';
import * as Download from 'constants/functions/download';
import { imageSource } from 'constants/image';
import { GoogleFont, PageState, RequestBody } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';

const Home: NextPage<HomeProps> = ({ fonts }) => {
  const [state, setState] = useState<PageState>({
    namesList: ['Drag me right into the mud mate'],
    imageSrc: null,
    imageDimensions: {
      width: 0,
      height: 0,
    },
    canvasDimensions: {
      width: 0,
      height: 0,
    },
    textStyle: {
      color: '#000',
      fontFamily: 'Courgette',
      fontSize: 19,
      lineHeight: 24,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
    },
    draggable: {
      isDragging: false,
      isSelected: false,
      offset: null,
    },
    downloadInProgress: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const names = useMemo(() => {
    return state.namesList.join('\n');
  }, [state.namesList]);

  // TODO: Remove (dev purposes only)
  useEffect(() => {
    setState((currentState) => ({
      ...currentState,
      imageSrc: imageSource,
    }));
  }, []);

  // Load a new font on a new font family selection.
  useEffect(() => {
    import('webfontloader')
      .then((WebFont) => {
        WebFont.load({
          google: {
            families: [state.textStyle.fontFamily],
            text: state.namesList[0],
          },
        });
      })
      .catch(console.error);
  }, [state.namesList, state.textStyle.fontFamily]);

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

      setState((currentState) => ({
        ...currentState,
        canvasDimensions: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        },
        imageDimensions: {
          width: img.width,
          height: img.height,
        },
        textStyle: {
          ...currentState.textStyle,
          scale,
          scaleX,
          scaleY,
        },
      }));

      // TODO: Dev Only
      const draggable = canvas.nextElementSibling?.firstChild as HTMLDivElement;
      draggable.style.top = '0px';
      draggable.style.left = '0px';
    };
  }, [state.imageSrc]);

  /**
   * Called on selection of a file to edit.
   * @param e The change event.
   * // TODO: Ask before replacing existing image.
   */
  function onImageSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (!files || !files.length) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      setState((currentState) => ({
        ...currentState,
        imageSrc: fileReader.result as string,
      }));
    };
  }

  function preview(): void {
    const canvas = canvasRef.current!;
    drawOnCanvas(canvas, state.namesList[0], state.textStyle);
  }

  /**
   * Performs a download.
   */
  async function download(type: 'pdf' | 'png' | 'png-zip') {
    if (!state.imageSrc) return alert('No image');

    setState((currentState) => ({
      ...currentState,
      downloadInProgress: true,
    }));

    const selectedFont = fonts.find((font) => {
      return font.family === state.textStyle.fontFamily;
    })!;

    const payload: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        backgroundImageSrc: state.imageSrc,
        fontId: selectedFont.id,
        dimensions: state.imageDimensions,
        namesList: state.namesList,
        textStyle: state.textStyle,
      } as RequestBody),
    };

    try {
      if (type === 'pdf') {
        await Download.pdfFileTest(payload);
      } else if (type === 'png') {
        await Download.pngFileTest(payload, state.canvasDimensions);
      } else if (type === 'png-zip') {
        await Download.pngArchive(payload);
      }
    } catch (e) {
      alert(e);
    } finally {
      setState((currentState) => ({
        ...currentState,
        downloadInProgress: false,
      }));
    }
  }

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const names = e.target.value;
    setState((currentState) => ({
      ...currentState,
      namesList: names.split('\n'),
    }));
  }

  // function onTextColorChange(color: ColorResult): void {
  //   setState((currentState) => ({
  //     ...currentState,
  //     draggable: {
  //       ...currentState.draggable,
  //       color: color.hex,
  //     },
  //   }));
  // }

  return (
    <main>
      <section className={'controls'}>
        <textarea
          id={'names-list'}
          onChange={onTextChange}
          value={names}
          placeholder={'List your guest names'}
        />
        <input
          type={'file'}
          accept={'image/jpeg,image/png'}
          onChange={onImageSelect}
        />
        <button id={'draw'} onClick={preview}>
          Draw
        </button>
        <button onClick={() => download('pdf')}>Download PDF</button>
        <button onClick={() => download('png')}>Download PNG</button>
        <button onClick={() => download('png-zip')}>
          Download PNG archive
        </button>
        <Link href={'/payment'}>
          <button id={'pay'}>Pay</button>
        </Link>
        <DesignForm fonts={fonts} usePageState={[state, setState]} />
        {/* <PhotoshopPicker
          color={state.draggable.textColor}
          onChange={onTextColorChange}
        /> */}
      </section>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
        <DragZone usePageState={[state, setState]} />
      </section>
      <ProgressOverlay state={state} />
    </main>
  );
};

function ProgressOverlay({ state }: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return <dialog>Loading...</dialog>;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
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

export default Home;

interface HomeProps {
  fonts: GoogleFont[];
}

interface ProgressOverlayProps {
  state: PageState;
}
