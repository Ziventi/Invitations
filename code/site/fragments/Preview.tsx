import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'constants/reducers';

import DragZone from './DragZone';
import MetadataBar from './MetadataBar';

export default function Preview({
  canvasRef,
  draggableRef,
}: PreviewProps): ReactElement {
  const state = useSelector((state: RootState) => state);

  // Adjust draggable position when top or left values are changed.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      draggable.style.top = `${state.textStyle.top}px`;
      draggable.style.left = `${state.textStyle.left}px`;
    }
  }, [draggableRef, state.textStyle.left, state.textStyle.top]);

  return (
    <section className={'preview'}>
      <div className={'preview-main'}>
        <canvas ref={canvasRef} />
        <DragZone canvasRef={canvasRef} draggableRef={draggableRef} />
      </div>
      <MetadataBar />
    </section>
  );
}

interface PreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  draggableRef: React.RefObject<HTMLDivElement>;
}
