import React, { ReactElement } from 'react';

import DragZone from './DragZone';
import MetadataBar from './MetadataBar';

export default function Preview({
  canvasRef,
  draggableRef,
}: PreviewProps): ReactElement {
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
