import type { GetStaticProps, NextPage } from 'next';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

import DragZone from './components/draggable';
import { drawOnCanvas } from './constants/functions';
import { imageSource } from './constants/image';
import { GoogleFont, PageState, RequestBody } from './constants/types';
import { GOOGLE_FONT_HOST } from './constants/variables';

const Home: NextPage<{ fonts: GoogleFont[] }> = ({ fonts }) => {
  const [state, setState] = useState<PageState>({
    names: 'Drag me right into the mud mate',
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

  // TODO: Remove (dev purposes only)
  useEffect(() => {
    setState((currentState) => ({
      ...currentState,
      imageSrc: imageSource,
    }));
  }, []);

  // Load a new font on a new font family selection.
  useEffect(() => {
    import('webfontloader').then((WebFont) => {
      WebFont.load({
        google: {
          families: [state.textStyle.fontFamily],
          text: state.names,
        },
      });
    });
  }, [state.names, state.textStyle]);

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
    drawOnCanvas(canvas, state.names, state.textStyle);
  }

  /**
   * Performs a download.
   */
  async function download(type: 'pdf' | 'png') {
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
        backgroundImage: state.imageSrc,
        fontId: selectedFont.id,
        dimensions: state.imageDimensions,
        names: state.names,
        textStyle: state.textStyle,
      } as RequestBody),
    };

    try {
      if (type === 'pdf') {
        const res = await fetch('api/pdf', payload);
        if (!res.ok) throw new Error('Could not download PDF.');
        const image = await res.blob();

        const url = URL.createObjectURL(image);
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        // a.download = 'ziventi.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await fetch('api/png', payload);
        if (!res.ok) throw new Error('Could not download image.');
        const data = await res.text();

        const img = new Image();
        img.src = data;
        img.height = state.canvasDimensions.height;
        img.width = state.canvasDimensions.width;
        const w = window.open(data);
        w?.document.write(img.outerHTML);

        // const a = document.createElement('a');
        // a.href = data;
        // a.target = '_blank';
        // a.download = 'ziventi.png';
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
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
    setState((currentState) => ({
      ...currentState,
      names: e.target.value,
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

  function onFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const fontFamily = e.target.value!;
    setState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        fontFamily,
      },
    }));
  }

  function onFontSizeChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 2;
    setState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        fontSize: Math.max(2, Math.min(value, 144)),
      },
    }));
  }

  function onLineHeightChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 1;
    setState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        lineHeight: Math.max(1, Math.min(value, 150)),
      },
    }));
  }

  return (
    <main>
      <section className={'controls'}>
        <textarea
          onChange={onTextChange}
          value={state.names}
          placeholder={'List your guest names'}
        />
        {/* TODO: Control valid image types */}
        <input type={'file'} accept={'image/*'} onChange={onImageSelect} />
        <button onClick={preview}>Draw</button>
        <button onClick={() => download('pdf')}>Download PDF</button>
        <button onClick={() => download('png')}>Download PNG</button>
        <div>
          <label>Font Family:</label>
          <select
            onChange={onFontFamilyChange}
            value={state.textStyle.fontFamily}>
            {fonts.map((font, key) => {
              return (
                <option value={font.family} key={key}>
                  {font.family}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Font Size:</label>
          <input
            type={'number'}
            min={2}
            max={144}
            step={1}
            onChange={onFontSizeChange}
            value={state.textStyle.fontSize}
          />
        </div>
        <div>
          <label>Line Height:</label>
          <input
            type={'number'}
            min={2}
            max={150}
            step={2}
            onChange={onLineHeightChange}
            value={state.textStyle.lineHeight}
          />
        </div>
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

interface ProgressOverlayProps {
  state: PageState;
}

export const getStaticProps: GetStaticProps<{
  fonts: GoogleFont[];
}> = async () => {
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
