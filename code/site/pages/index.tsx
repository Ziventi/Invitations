import type { NextPage } from 'next';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

import DragZone from './components/draggable';
import { imageSource } from './constants/image';
import { PageState, RequestBody } from './constants/types';
import { DRAGGABLE_PADDING } from './constants/variables';

const Home: NextPage = () => {
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
      fontFamily: 'Arial',
      fontSize: 14,
      maxWidth: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      scale: 1,
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

      // Calculate scale factor to apply to font size and position values.
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scale factor to apply to font size and position values.
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    const scale = (scaleX + scaleY) / 2;
    const fontSize = state.textStyle.fontSize * scale;

    const draggable = canvas.nextElementSibling?.firstChild as HTMLDivElement;
    const textX = (draggable.offsetLeft + draggable.offsetWidth / 2) * scale;
    const textY =
      (draggable.offsetTop + draggable.offsetHeight / 2) * scale +
      DRAGGABLE_PADDING;

    ctx.font = `${fontSize}px ${state.textStyle.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(state.names, textX, textY);
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

    const payload: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        backgroundImage: state.imageSrc,
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

export default Home;
