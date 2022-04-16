import type { NextPage } from 'next';

import React, { useRef, useState } from 'react';

import DraggableText from './draggable';
import { State } from './types';

const Home: NextPage = () => {
  const [state, setState] = useState<State>({
    names: 'Drag me',
    draggable: {
      isDragging: false,
      offset: null,
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function updateState(
    newStateValues: Partial<Record<keyof State, any>>
  ): void {
    setState((currentState) => ({
      ...currentState,
      ...newStateValues,
    }));
  }

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
      const img = new Image();
      img.src = fileReader.result as string;
      img.onload = () => {
        const ctx = getCanvasContext();
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    };
  }

  /**
   * Retrieves the canvas context.
   * @returns The canvas context.
   */
  function getCanvasContext(): CanvasRenderingContext2D {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found.');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found.');
    return ctx;
  }

  return (
    <main>
      <section className={'controls'}>
        <textarea
          onChange={(e) => updateState({ names: e.target.value })}
          value={state.names}
          placeholder={'List your guest names'}
        />
        {/* TODO: Control valid image types */}
        <input type={'file'} accept={'image/*'} onChange={onImageSelect} />
      </section>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
        <DraggableText state={state} updateState={updateState} />
      </section>
    </main>
  );
};

export default Home;
