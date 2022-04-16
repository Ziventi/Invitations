import type { NextPage } from 'next';

import React, { useEffect, useRef, useState } from 'react';

import DraggableText from './draggable';
import { imageSource } from './image';
import { State } from './types';

const Home: NextPage = () => {
  const [state, setState] = useState<State>({
    names: 'Drag me',
    imageSrc: null,
    canvasDimensions: {
      width: 300,
      height: 150,
    },
    draggable: {
      isDragging: false,
      isSelected: false,
      offset: null,
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  function download(): void {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setState((currentState) => ({
      ...currentState,
      names: e.target.value,
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
        <button onClick={download}>Download</button>
      </section>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
        <DraggableText state={state} setState={setState} />
      </section>
    </main>
  );
};

export default Home;
