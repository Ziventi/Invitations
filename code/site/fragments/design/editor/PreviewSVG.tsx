import type { ReactElement } from 'react';
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type { Coordinates } from 'constants/types';
import { COLOR } from 'styles/Constants.styles';
import P from 'styles/pages/design/Preview.styles';

export default function Preview(): ReactElement {
  const [state, setState] = useState({
    draggable: {
      isDragging: false,
      isSelected: false,
      offset: {
        x: 0,
        y: 0,
      },
    },
  });

  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setAppState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const draggableRef = useRef<SVGTextElement>(null);

  const viewBox = useMemo(() => {
    const { height, width } = appState.imageDimensions;
    return `0 0 ${width} ${height}`;
  }, [appState.imageDimensions]);

  // Memoises the draggable style based on selected text style properties.
  const draggableStyle: React.CSSProperties = useMemo(() => {
    const {
      color,
      fontFamily,
      fontStyle,
      fontSize,
      letterSpacing,
      lineHeight,
    } = appState.textStyle;
    const fontWeight = Utils.getFontWeight(fontStyle);
    return {
      fill: color,
      fontFamily,
      fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`,
      lineHeight: `${lineHeight}px`,
    };
  }, [appState.textStyle]);

  /**
   * The {@link onDrag} for draggable text.
   * @param e The mouse event.
   */
  const onTextDrag = useCallback(
    (e: MouseEvent): void => {
      const currentPoint: Coordinates = {
        x: e.pageX - state.draggable.offset!.x,
        y: e.pageY - state.draggable.offset!.y,
      };

      const { height, width } = appState.imageDimensions;
      setAppState({
        textStyle: {
          left: Utils.minmax(currentPoint.x, 0, width),
          top: Utils.minmax(currentPoint.y, 0, height),
        },
      });

      e.stopPropagation();
      e.preventDefault();
    },
    [setAppState, appState.imageDimensions, state.draggable.offset],
  );

  /**
   * Called repeatedly while dragging an element within the drag zone.
   * @param e The mouse event.
   */
  const onDrag = useCallback(
    (e: MouseEvent): void => {
      if (state.draggable.isDragging) {
        onTextDrag(e);
      }
      // else if (resizeHandleState.isDragging) {
      //   onResizeHandleDrag(e);
      // }
    },
    [
      onTextDrag,
      state.draggable.isDragging,
      // onResizeHandleDrag,
      // resizeHandleState.isDragging,
    ],
  );

  /**
   * Called on when finished dragging draggable text.
   * @param e The mouse event.
   */
  const onTextDragEnd = useCallback(
    (e: MouseEvent): void => {
      if (!state.draggable.isDragging) return;

      const draggable = draggableRef.current;
      if (!draggable) return;

      setState((current) => ({
        ...current,
        draggable: {
          ...current.draggable,
          isDragging: false,
        },
      }));

      e.stopPropagation();
    },
    [setState, draggableRef, state.draggable.isDragging],
  );

  // Window event listeners for the drag and resize operations.
  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onTextDragEnd);
    // window.addEventListener('mouseup', onResizeHandleDragEnd);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onTextDragEnd);
      // window.removeEventListener('mouseup', onResizeHandleDragEnd);
    };
  }, [
    onDrag,
    onTextDragEnd,
    // onResizeHandleDragEnd, onWindowResize
  ]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onTextDragStart(e: React.MouseEvent<SVGTextElement>): void {
    if (e.button !== 0) return;

    const { x, y } = e.currentTarget;
    setState((current) => ({
      ...current,
      draggable: {
        isDragging: true,
        isSelected: true,
        offset: {
          x: e.pageX - x.baseVal[0].value,
          y: e.pageY - y.baseVal[0].value,
        },
      },
    }));

    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * Deselect the draggable text when clicked outside of it but within the drag
   * zone.
   * @param e The mouse event.
   */
  function onDragZoneClick(e: React.MouseEvent<HTMLDivElement>): void {
    const draggable = draggableRef.current!;

    if (!draggable.contains(e.target as Node)) {
      setState((current) => ({
        ...current,
        draggable: {
          ...current.draggable,
          isSelected: false,
        },
      }));
    }
  }

  const { height, left, top, width } = appState.textStyle;
  return (
    <P.Container onMouseDown={onDragZoneClick}>
      <P.SVGCanvas xmlns={'http://www.w3.org/2000/svg'} viewBox={viewBox}>
        <rect x={0} y={0} width={'100%'} height={'100%'} fill={COLOR.WHITE} />
        <image
          href={appState.imageSrc!}
          x={0}
          y={0}
          width={'100%'}
          height={'100%'}
        />
        <P.Text
          x={left}
          y={top}
          style={{
            dominantBaseline: 'hanging',
            ...draggableStyle,
          }}
          selected={state.draggable.isSelected}
          onMouseDown={onTextDragStart}
          ref={draggableRef}>
          {appState.selectedName}
        </P.Text>
        <P.ResizeHandle
          id={'west'}
          cx={left}
          cy={top + height}
          r={10}
          position={'west'}
          selected={state.draggable.isSelected}
        />
        <P.ResizeHandle
          id={'east'}
          cx={left + width}
          cy={top + height}
          r={10}
          position={'east'}
          selected={state.draggable.isSelected}
        />
      </P.SVGCanvas>
    </P.Container>
  );
}
