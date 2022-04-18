import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import DragZone from './draggable';
import { imageSource } from './image';
import { PageState } from './types';

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
        {/* <PhotoshopPicker
          color={state.draggable.textColor}
          onChange={onTextColorChange}
        /> */}
      </section>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
        <DragZone usePageState={[state, setState]} />
      </section>
    </main>
  );
};

export default Home;
