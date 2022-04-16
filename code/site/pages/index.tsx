import type { NextPage } from 'next';

import React, { useRef, useState } from 'react';

import DraggableText from './draggable';
import { State } from './types';

const Home: NextPage = () => {
  const [state, setState] = useState<State>({
    names: 'Drag me',
    imageLoaded: false,
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

  /**
   * Called on selection of a file to edit.
   * @param e The change event.
   * // TODO: Ask before replacing existing image.
   */
  function onImageSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (!files || !files.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      const img = new Image();
      img.src = fileReader.result as string;
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
