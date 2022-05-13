import React, { ReactElement, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import { RootState } from 'constants/reducers';
import { Preview as P } from 'styles/Design/Editor.styles';

import DragZone from './DragZone';

export default function Preview({
  canvasRef,
  draggableRef,
}: PreviewProps): ReactElement {
  const state = useSelector((state: RootState) => state);

  const filename = useMemo(() => {
    return Utils.substituteName(state.fileNameTemplate, state.selectedName);
  }, [state.fileNameTemplate, state.selectedName]);

  const dimensions = useMemo(() => {
    const { height, width } = state.imageDimensions;
    return `Dimensions: ${width} x ${height}`;
  }, [state.imageDimensions]);

  // Adjust draggable position when top or left values are changed.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      draggable.style.top = `${state.textStyle.top}px`;
      draggable.style.left = `${state.textStyle.left}px`;
    }
  }, [draggableRef, state.textStyle.left, state.textStyle.top]);

  return (
    <P.Container>
      <P.Main>
        <P.Canvas ref={canvasRef} />
        <DragZone canvasRef={canvasRef} draggableRef={draggableRef} />
      </P.Main>
      <P.Footer>
        <P.FooterText>{dimensions}</P.FooterText>
        <P.FooterText>
          {filename}.{state.fileFormat}
        </P.FooterText>
      </P.Footer>
    </P.Container>
  );
}

interface PreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  draggableRef: React.RefObject<HTMLDivElement>;
}
