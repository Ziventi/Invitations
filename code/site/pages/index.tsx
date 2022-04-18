import type { NextPage } from 'next';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

import DragZone from './components/draggable';
import { imageSource } from './constants/image';
import { PageState } from './constants/types';

const Home: NextPage = () => {
  const [state, setState] = useState<PageState>({
    names: 'Drag me right into the mud mate',
    imageSrc: null,
    canvasDimensions: {
      width: 300,
      height: 150,
    },
    draggable: {
      color: '#000',
      fontFamily: 'Arial',
      fontSize: 14,
      maxWidth: 0,
      isDragging: false,
      isSelected: false,
      offset: null,
    },
    downloadInProgress: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // TODO: Remove (dev purposes only)
  useEffect(() => {
    setState((currentState) => ({
      ...currentState,
      imageSrc: imageSource,
    }));
  }, []);

  // Called each time the image source changes.
  useEffect(() => {
    if (!state.imageSrc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = state.imageSrc;
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      setState((currentState) => ({
        ...currentState,
        imageLoaded: true,
        canvasDimensions: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        },
      }));
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scale factor to apply to font size and position values.
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    const scale = (scaleX + scaleY) / 2;
    const fontSize = state.draggable.fontSize * scale;

    const draggable = canvas.nextElementSibling?.firstChild as HTMLDivElement;
    const textX = (draggable.offsetLeft + 12) * scale;
    const textY =
      (draggable.offsetTop + draggable.offsetHeight / 2) * scale + 24;

    ctx.font = `${fontSize}px ${state.draggable.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(state.names, textX, textY);
  }

  /**
   * Performs a download.
   */
  async function download() {
    const canvas = canvasWrapperRef.current;
    if (!canvas) return;

    setState((currentState) => ({
      ...currentState,
      downloadInProgress: true,
    }));

    let image;
    try {
      const res = await fetch('api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: document.documentElement.outerHTML }),
      });
      image = await res.blob();
    } catch (e) {
      throw new Error('Could not download image.');
    } finally {
      setState((currentState) => ({
        ...currentState,
        downloadInProgress: false,
      }));
    }

    const url = URL.createObjectURL(image);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ziventi.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <button onClick={download}>Download</button>
        {/* <PhotoshopPicker
          color={state.draggable.textColor}
          onChange={onTextColorChange}
        /> */}
      </section>
      <section className={'preview'}>
        <div id={'canvas'} ref={canvasWrapperRef}>
          <canvas ref={canvasRef} />
          <DragZone usePageState={[state, setState]} />
        </div>
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

export default Home;
