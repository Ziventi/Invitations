import classnames from 'classnames';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import {
  AppDispatch,
  PageStatePayload,
  RootState,
  updateState,
} from 'constants/reducers';
import { Coordinates, ResizeHandlePosition } from 'constants/types';
import { Preview as P } from 'styles/Design/Editor.styles';

const positions: ResizeHandlePosition[] = ['east', 'west'];

export default function DragZone({
  canvasRef,
  draggableRef,
}: DragZoneProps): ReactElement | null {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const [resizeHandleState, setResizeHandleState] = useState<ResizeHandleState>(
    {
      currentDraggableLeft: 0,
      currentDraggableWidth: 0,
      handleId: null,
      isDragging: false,
      initialPointX: 0,
    },
  );
  const dragZoneRef = useRef<HTMLDivElement>(null);

  // Memoises the draggable style based on selected text style properties.
  const draggableStyle: React.CSSProperties = useMemo(() => {
    const { color, fontFamily, fontStyle, fontSize, lineHeight } =
      state.textStyle;
    const fontWeight = Utils.getFontWeight(fontStyle);
    return {
      color,
      fontFamily,
      fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
      fontSize: `${fontSize}px`,
      fontWeight,
      lineHeight: `${lineHeight}px`,
    };
  }, [state.textStyle]);

  /**
   * The {@link onDrag} for draggable text.
   * @param e The mouse event.
   */
  const onTextDrag = useCallback(
    (e: MouseEvent): void => {
      const dragZone = dragZoneRef.current!;
      const draggable = draggableRef.current!;
      const dragZoneBounds = dragZone.getBoundingClientRect();

      const currentPoint: Coordinates = {
        x: e.pageX - state.draggable.offset!.x,
        y: e.pageY - state.draggable.offset!.y,
      };

      const maxX = dragZoneBounds.width - draggable.offsetWidth;
      const maxY = dragZoneBounds.height - draggable.offsetHeight;
      draggable.style.left = `${Utils.minmax(currentPoint.x, 0, maxX)}px`;
      draggable.style.top = `${Utils.minmax(currentPoint.y, 0, maxY)}px`;

      e.stopPropagation();
      e.preventDefault();
    },
    [draggableRef, state.draggable.offset],
  );

  /**
   * The {@link onDrag} for resize handle. Calculates the delta on dragging a resize
   * handle and adjusts the maxWidth and positioning of the draggable
   * accordingly.
   * @param e The mouse event.
   */
  const onResizeHandleDrag = useCallback(
    (e: MouseEvent): void => {
      const { currentDraggableLeft, currentDraggableWidth } = resizeHandleState;
      const delta =
        resizeHandleState.handleId === 'east'
          ? e.pageX - resizeHandleState.initialPointX
          : resizeHandleState.initialPointX - e.pageX;
      const draggableNewWidth = currentDraggableWidth + delta;
      if (draggableNewWidth < state.textStyle.fontSize * 4) return;

      const draggable = draggableRef.current!;
      const dragZone = dragZoneRef.current!;
      const dragZoneBounds = dragZone.getBoundingClientRect();

      let maxX;
      if (resizeHandleState.handleId === 'east') {
        maxX = dragZoneBounds.width - currentDraggableLeft;
      } else {
        // Compensate for movement when dragging west handle.
        draggable.style.left = `${Math.max(currentDraggableLeft - delta, 0)}px`;
        maxX = currentDraggableLeft + currentDraggableWidth;
      }
      draggable.style.maxWidth = `${Math.min(draggableNewWidth, maxX)}px`;

      e.stopPropagation();
    },
    [draggableRef, resizeHandleState, state.textStyle.fontSize],
  );

  /**
   * Called repeatedly while dragging an element within the drag zone.
   * @param e The mouse event.
   */
  const onDrag = useCallback(
    (e: MouseEvent): void => {
      if (state.draggable.isDragging) {
        onTextDrag(e);
      } else if (resizeHandleState.isDragging) {
        onResizeHandleDrag(e);
      }
    },
    [
      onTextDrag,
      onResizeHandleDrag,
      resizeHandleState.isDragging,
      state.draggable.isDragging,
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

      setState({
        draggable: {
          isDragging: false,
          offset: null,
        },
        textStyle: {
          left: draggable.offsetLeft,
          top: draggable.offsetTop,
        },
      });

      e.stopPropagation();
    },
    [setState, draggableRef, state.draggable.isDragging],
  );

  /**
   * Called when finished dragging resize handle.
   */
  const onResizeHandleDragEnd = useCallback(
    (e: MouseEvent): void => {
      setResizeHandleState((currentState) => ({
        ...currentState,
        isDragging: false,
        handleId: null,
      }));

      const draggable = draggableRef.current;
      if (!draggable) return;

      setState({
        textStyle: {
          width: draggable.offsetWidth,
          height: draggable.offsetHeight,
        },
      });
      e.stopPropagation();
    },
    [setState, draggableRef],
  );

  /**
   * Called when the window is resized.
   */
  const onWindowResize = useCallback(() => {
    const canvas = canvasRef.current;
    const dragZone = dragZoneRef.current;
    if (canvas && dragZone) {
      const { clientHeight, clientWidth } = canvas;
      dragZone.style.maxHeight = `${clientHeight}px`;
      dragZone.style.maxWidth = `${clientWidth}px`;
    }
    // TODO: Add prompt to refresh page
  }, [canvasRef, dragZoneRef]);

  // Window event listeners for the drag and resize operations.
  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onTextDragEnd);
    window.addEventListener('mouseup', onResizeHandleDragEnd);
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onTextDragEnd);
      window.removeEventListener('mouseup', onResizeHandleDragEnd);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onDrag, onTextDragEnd, onResizeHandleDragEnd, onWindowResize]);

  // Align the drag zone dimensions with the canvas when images change.
  useEffect(() => {
    const dragZone = dragZoneRef.current;
    if (dragZone) {
      const { height, width } = state.canvasDimensions;
      dragZone.style.maxHeight = `${height}px`;
      dragZone.style.maxWidth = `${width}px`;
    }
  }, [state.canvasDimensions]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onTextDragStart(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button !== 0 || e.currentTarget.id !== 'draggable') {
      return;
    }

    const draggable = draggableRef.current;
    if (!draggable) return;

    setState({
      draggable: {
        isDragging: true,
        isSelected: true,
        offset: {
          x: e.pageX - draggable.offsetLeft,
          y: e.pageY - draggable.offsetTop,
        },
      },
    });

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
    const draggableBounds = draggable.getBoundingClientRect();
    const withinDraggable =
      e.pageX >= draggableBounds.left &&
      e.pageX <= draggableBounds.right &&
      e.pageY >= draggableBounds.top &&
      e.pageY <= draggableBounds.bottom;

    if (!withinDraggable) {
      setState({
        draggable: {
          isSelected: false,
        },
      });
    }
  }

  return (
    <P.DragZone onMouseDown={onDragZoneClick} ref={dragZoneRef}>
      <P.Draggable
        id={'draggable'}
        selected={state.draggable.isSelected}
        onMouseDown={onTextDragStart}
        ref={draggableRef}>
        <span style={draggableStyle}>{state.selectedName}</span>
        <ResizeHandles
          draggableRef={draggableRef}
          isSelected={state.draggable.isSelected}
          useDragZoneState={[resizeHandleState, setResizeHandleState]}
        />
      </P.Draggable>
    </P.DragZone>
  );
}

function ResizeHandles({
  draggableRef,
  useDragZoneState,
  isSelected,
}: ResizeHandlesProps): ReactElement | null {
  const [, setDragZoneState] = useDragZoneState;

  function onResizeHandleDragStart(e: React.MouseEvent<SVGSVGElement>): void {
    const draggable = draggableRef.current;
    if (!draggable) return;

    const { id } = e.currentTarget;
    setDragZoneState((currentState) => ({
      ...currentState,
      currentDraggableLeft: draggable.offsetLeft,
      currentDraggableWidth: draggable.offsetWidth,
      isDragging: true,
      handleId: id as ResizeHandlePosition,
      initialPointX: e.pageX,
    }));
    e.stopPropagation();
  }

  return (
    <React.Fragment>
      {positions.map((position) => {
        return (
          <P.ResizeHandle
            xmlns={'http://www.w3.org/2000/svg'}
            id={position}
            width={'10'}
            height={'10'}
            key={position}
            position={position}
            selected={isSelected}
            onMouseDown={onResizeHandleDragStart}>
            <P.ResizeHandleCircle cx={'50%'} cy={'50%'} r={'5'} />
          </P.ResizeHandle>
        );
      })}
    </React.Fragment>
  );
}

interface DragZoneProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  draggableRef: React.RefObject<HTMLDivElement>;
}

interface ResizeHandlesProps {
  draggableRef: React.RefObject<HTMLDivElement>;
  useDragZoneState: [
    ResizeHandleState,
    React.Dispatch<React.SetStateAction<ResizeHandleState>>,
  ];
  isSelected: boolean;
}

interface ResizeHandleState {
  currentDraggableLeft: number;
  currentDraggableWidth: number;
  handleId: ResizeHandlePosition | null;
  isDragging: boolean;
  initialPointX: number;
}
