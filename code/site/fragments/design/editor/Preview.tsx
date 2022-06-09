import type { ReactElement } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type {
  Coordinates,
  Dimensions,
  ResizeHandlePosition,
} from 'constants/types';
import { COLOR } from 'styles/Constants.styles';
import P from 'styles/pages/design/editor/Preview.styles';

export default function Preview(): ReactElement {
  const [state, setState] = useState<PreviewState>({
    draggable: {
      isDragging: false,
      isSelected: false,
      dimensions: {
        height: 0,
        width: 0,
      },
      maxWidth: 100,
      offset: {
        x: 0,
        y: 0,
      },
    },
    resizeHandles: {
      isDragging: false,
      handleId: null,
      initialPointX: 0,
      snapshotDraggableLeft: 0,
      snapshotDraggableWidth: 0,
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

  const svgCanvasRef = useRef<SVGSVGElement>(null);
  const draggableRef = useRef<SVGTextElement>(null);

  const viewBox = useMemo(() => {
    const { height, width } = appState.imageDimensions;
    return `0 0 ${width} ${height}`;
  }, [appState.imageDimensions]);

  // Memoises the draggable style based on selected text style properties.
  const draggableStyle = useMemo<DraggableStyle>(() => {
    const { color, fontFamily, fontStyle, fontSize, letterSpacing } =
      appState.textStyle;
    const fontWeight = Utils.getFontWeight(fontStyle);
    return {
      props: {
        fill: color,
        fontSize: `${fontSize}px`,
        fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
        fontWeight,
        letterSpacing: `${letterSpacing}px`,
      },
      style: {
        fontFamily,
      },
    };
  }, [appState.textStyle]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onTextDragStart(e: React.MouseEvent<SVGTextElement>): void {
    if (e.button !== 0) return;

    const svgp = convertToSVGCoordinates(svgCanvasRef, {
      x: e.pageX,
      y: e.pageY,
    });

    const { x, y } = e.currentTarget;
    setState((current) => ({
      ...current,
      draggable: {
        ...current.draggable,
        isDragging: true,
        isSelected: true,
        offset: {
          x: svgp.x - x.baseVal[0].value,
          y: svgp.y - y.baseVal[0].value,
        },
      },
    }));

    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * The {@link onDrag} for draggable text.
   * @param e The mouse event.
   */
  const onTextDrag = useCallback(
    (e: MouseEvent): void => {
      const svgp = convertToSVGCoordinates(svgCanvasRef, {
        x: e.pageX,
        y: e.pageY,
      });

      const { height: maxHeight, width: maxWidth } = appState.imageDimensions;
      const { height } = state.draggable.dimensions;
      setAppState({
        textStyle: {
          left: Math.round(
            Utils.minmax(
              svgp.x - state.draggable.offset!.x,
              0,
              maxWidth - state.draggable.maxWidth,
            ),
          ),
          top: Math.round(
            Utils.minmax(
              svgp.y - state.draggable.offset!.y,
              0,
              maxHeight - height,
            ),
          ),
        },
      });

      e.stopPropagation();
      e.preventDefault();
    },
    [setAppState, appState.imageDimensions, state.draggable],
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

  /**
   * Records the initial X-point and handle ID of the resize handle.
   * @param e The mouse event.
   */
  function onResizeHandleDragStart(
    e: React.MouseEvent<SVGCircleElement>,
  ): void {
    const svgp = convertToSVGCoordinates(svgCanvasRef, {
      x: e.pageX,
      y: e.pageY,
    });
    const { id } = e.currentTarget;
    setState((current) => ({
      ...current,
      resizeHandles: {
        snapshotDraggableLeft: appState.textStyle.left,
        snapshotDraggableWidth: state.draggable.maxWidth,
        isDragging: true,
        handleId: id as ResizeHandlePosition,
        initialPointX: svgp.x,
      },
    }));

    e.stopPropagation();
  }

  /**
   * The {@link onDrag} for resize handle. Calculates the delta on dragging a resize
   * handle and adjusts the maxWidth and positioning of the draggable
   * accordingly.
   * @param e The mouse event.
   */
  const onResizeHandleDrag = useCallback(
    (e: MouseEvent): void => {
      const {
        snapshotDraggableLeft,
        snapshotDraggableWidth,
        handleId,
        initialPointX,
      } = state.resizeHandles;
      const delta =
        handleId === 'east' ? e.pageX - initialPointX : initialPointX - e.pageX;

      const draggableNewWidth = snapshotDraggableWidth + delta;

      let maxX = 0;
      if (handleId === 'east') {
        maxX = appState.imageDimensions.width - snapshotDraggableLeft;
      } else {
        // Compensate for movement when dragging west handle.
        setAppState({
          textStyle: {
            left: Math.max(snapshotDraggableLeft - delta, 0),
          },
        });
        maxX = snapshotDraggableLeft + snapshotDraggableWidth;
      }

      setState((current) => ({
        ...current,
        draggable: {
          ...current.draggable,
          maxWidth: Math.min(draggableNewWidth, maxX),
        },
      }));

      e.stopPropagation();
    },
    [setAppState, appState.imageDimensions.width, state.resizeHandles],
  );

  /**
   * Called when finished dragging resize handle.
   */
  const onResizeHandleDragEnd = useCallback((e: MouseEvent): void => {
    setState((current) => ({
      ...current,
      resizeHandles: {
        ...current.resizeHandles,
        isDragging: false,
        handleId: null,
      },
    }));
    e.stopPropagation();
  }, []);

  /**
   * Called repeatedly while dragging an element within the drag zone.
   * @param e The mouse event.
   */
  const onDrag = useCallback(
    (e: MouseEvent): void => {
      if (state.draggable.isDragging) {
        onTextDrag(e);
      } else if (state.resizeHandles.isDragging) {
        onResizeHandleDrag(e);
      }
    },
    [
      onTextDrag,
      state.draggable.isDragging,
      onResizeHandleDrag,
      state.resizeHandles.isDragging,
    ],
  );

  // Window event listeners for the drag and resize operations.
  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onTextDragEnd);
    window.addEventListener('mouseup', onResizeHandleDragEnd);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onTextDragEnd);
      window.removeEventListener('mouseup', onResizeHandleDragEnd);
    };
  }, [onDrag, onTextDragEnd, onResizeHandleDragEnd]);

  // Adjust draggable dimensions when the selected name or font style changes.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      const { height, width } = draggable.getBBox();
      setState((current) => ({
        ...current,
        draggable: {
          ...current.draggable,
          dimensions: {
            height,
            width,
          },
        },
      }));
    }
  }, [appState.selectedName, appState.textStyle]);

  // Get the initial max width.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      setState((current) => ({
        ...current,
        draggable: {
          ...current.draggable,
          maxWidth: draggable && draggable.getBBox().width,
        },
      }));
    }
  }, []);

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

  const { left, top } = appState.textStyle;
  const { height } = state.draggable.dimensions;
  return (
    <P.Container onMouseDown={onDragZoneClick}>
      <P.SVGCanvas
        xmlns={'http://www.w3.org/2000/svg'}
        viewBox={viewBox}
        ref={svgCanvasRef}>
        <rect x={0} y={0} width={'100%'} height={'100%'} fill={COLOR.WHITE} />
        <image
          href={appState.imageSrc!}
          x={0}
          y={0}
          width={'100%'}
          height={'100%'}
        />
        <P.Border
          x={left}
          y={top}
          width={state.draggable.maxWidth}
          height={height}
          rx={10}
          ry={10}
          fill={'transparent'}
          stroke={COLOR.DEFAULT}
          strokeDasharray={'10 6'}
          strokeWidth={4}
          visible={state.draggable.isSelected}
        />
        <P.Text
          x={left}
          y={top}
          dominantBaseline={'text-before-edge'}
          onMouseDown={onTextDragStart}
          ref={draggableRef}
          selected={state.draggable.isSelected}
          style={draggableStyle.style}
          {...draggableStyle.props}>
          {appState.selectedName}
        </P.Text>
        {[
          { id: 'west', start: left },
          { id: 'east', start: left + state.draggable.maxWidth },
        ].map(({ id, start }) => {
          return (
            <P.ResizeHandle
              id={id}
              key={id}
              cx={start}
              cy={top + height / 2}
              r={10}
              visible={state.draggable.isSelected}
              onMouseDown={onResizeHandleDragStart}
            />
          );
        })}
      </P.SVGCanvas>
    </P.Container>
  );
}

/**
 * Convert DOM point to SVG coordinates.
 * @param svgRef The SVG reference.
 * @param domCoordinates The DOM point.
 * @returns The SVG coordinates.
 */
function convertToSVGCoordinates(
  svgRef: React.RefObject<SVGSVGElement>,
  domCoordinates: Coordinates,
) {
  const svg = svgRef.current!;
  const domPoint = DOMPoint.fromPoint({
    x: domCoordinates.x,
    y: domCoordinates.y,
  });

  const svgp = domPoint.matrixTransform(svg.getScreenCTM()!.inverse());
  return svgp;
}

interface PreviewState {
  draggable: {
    isDragging: boolean;
    isSelected: boolean;
    dimensions: Dimensions;
    maxWidth: number;
    offset: Coordinates | null;
  };
  resizeHandles: {
    isDragging: boolean;
    handleId: ResizeHandlePosition | null;
    initialPointX: number;
    snapshotDraggableLeft: number;
    snapshotDraggableWidth: number;
  };
}

interface DraggableStyle {
  props: Pick<
    React.CSSProperties,
    | 'fill'
    | 'fontFamily'
    | 'fontSize'
    | 'fontStyle'
    | 'fontWeight'
    | 'letterSpacing'
  >;
  style: Pick<React.CSSProperties, 'fontFamily'>;
}
