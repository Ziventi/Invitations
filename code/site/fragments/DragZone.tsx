import classnames from 'classnames';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageStatePayload, updateState, RootState, AppDispatch } from 'constants/reducers';
import { Coordinates } from 'constants/types';

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
      pointX: 0,
    },
  );
  const dragZoneRef = useRef<HTMLDivElement>(null);

  /**
   * Called on when finished dragging draggable text.
   */
  const onTextDragEnd = useCallback(
    (e: MouseEvent): void => {
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
    [setState, draggableRef],
  );

  /**
   * Called on when finished dragging resize handle.
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

  const onWindowResize = useCallback(() => {
    const canvas = canvasRef.current;
    const dragZone = dragZoneRef.current;
    if (canvas && dragZone) {
      const { clientHeight, clientWidth } = canvas;
      dragZone.style.maxHeight = `${clientHeight}px`;
      dragZone.style.maxWidth = `${clientWidth}px`;
    }
  }, [canvasRef, dragZoneRef]);

  // Add an event listener for the drag-end operation anywhere on the page.
  useEffect(() => {
    window.addEventListener('mouseup', onTextDragEnd);
    window.addEventListener('mouseup', onResizeHandleDragEnd);
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('mouseup', onTextDragEnd);
      window.removeEventListener('mouseup', onResizeHandleDragEnd);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onTextDragEnd, onResizeHandleDragEnd, onWindowResize]);

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

    prohibitSideEffects(e);
  }

  /**
   * Called repeatedly while dragging an element within the drag zone.
   * @param e The mouse event.
   */
  function onDrag(e: React.MouseEvent<HTMLDivElement>): void {
    if (state.draggable.isDragging) {
      onTextDrag(e);
    } else if (resizeHandleState.isDragging) {
      onResizeHandleDrag(e);
    }
  }

  /**
   * {@link onDrag} for draggable text.
   * @param e The mouse event.
   */
  function onTextDrag(e: React.MouseEvent<HTMLDivElement>): void {
    const dragZone = dragZoneRef.current!;
    const draggable = draggableRef.current!;
    const dragZoneBounds = dragZone.getBoundingClientRect();

    const currentPoint: Coordinates = {
      x: e.pageX - state.draggable.offset!.x,
      y: e.pageY - state.draggable.offset!.y,
    };

    const withinDragZone =
      currentPoint.x >= 0 &&
      currentPoint.x + draggable.offsetWidth <= dragZoneBounds.width &&
      currentPoint.y >= 0 &&
      currentPoint.y + draggable.offsetHeight <= dragZoneBounds.height;

    if (withinDragZone) {
      draggable.style.left = `${currentPoint.x}px`;
      draggable.style.top = `${currentPoint.y}px`;
    }

    prohibitSideEffects(e);
  }

  /**
   * {@link onDrag} for resize handle. Calculates the delta on dragging a resize
   * handle and adjusts the maxWidth and positioning of the draggable
   * accordingly.
   * @param e The mouse event.
   */
  function onResizeHandleDrag(e: React.MouseEvent<HTMLDivElement>): void {
    const { currentDraggableLeft, currentDraggableWidth } = resizeHandleState;
    const delta =
      resizeHandleState.handleId === 'east'
        ? e.pageX - resizeHandleState.pointX
        : resizeHandleState.pointX - e.pageX;
    const draggableNewWidth = currentDraggableWidth + delta;

    const draggable = draggableRef.current!;

    if (draggableNewWidth <= state.canvasDimensions.width) {
      draggable.style.maxWidth = `${draggableNewWidth}px`;
    }

    // If dragging west handle, compensate for movement.
    // TODO: Prevent panning the draggable on small widths.
    if (resizeHandleState.handleId === 'west') {
      draggable.style.left = `${currentDraggableLeft - delta}px`;
    }

    e.stopPropagation();
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

    if (withinDraggable) return;

    setState({
      draggable: {
        isSelected: false,
      },
    });
  }

  const draggableClasses = classnames('draggable', {
    'draggable--selected': state.draggable.isSelected,
  });
  return (
    <div
      className={'drag-zone'}
      onMouseDown={onDragZoneClick}
      onMouseMove={onDrag}
      ref={dragZoneRef}>
      <div
        id={'draggable'}
        className={draggableClasses}
        onMouseDown={onTextDragStart}
        ref={draggableRef}>
        <span
          style={{
            color: state.textStyle.color,
            fontFamily: state.textStyle.fontFamily,
            fontSize: `${state.textStyle.fontSize}px`,
            lineHeight: `${state.textStyle.lineHeight}px`,
          }}>
          {state.selectedName}
        </span>
        <ResizeHandles
          draggableRef={draggableRef}
          isSelected={state.draggable.isSelected}
          useDragZoneState={[resizeHandleState, setResizeHandleState]}
        />
      </div>
    </div>
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
      pointX: e.pageX,
    }));
    e.stopPropagation();
  }

  return (
    <>
      {positions.map((position) => {
        const classes = classnames(
          'resize-handle',
          `resize-handle-${position}`,
          { 'resize-handle--selected': isSelected },
        );
        return (
          <svg
            id={position}
            width={'10'}
            height={'10'}
            xmlns={'http://www.w3.org/2000/svg'}
            className={classes}
            key={position}
            onMouseDown={onResizeHandleDragStart}>
            <circle cx={'50%'} cy={'50%'} r={'5'} />
          </svg>
        );
      })}
    </>
  );
}

/**
 * Stops propagation of events during the drag process.
 * @param e The mouse event.
 */
function prohibitSideEffects(e: MouseEvent | React.MouseEvent): void {
  e.stopPropagation();
  e.preventDefault();
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
  pointX: number;
}

type ResizeHandlePosition = 'east' | 'west';
