import classnames from 'classnames';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DRAGGABLE_PADDING } from 'pages/constants/variables';

import { Coordinates, PageState } from '../constants/types';

export default function DragZone({
  usePageState,
}: DraggableTextProps): ReactElement | null {
  const [pageState, setPageState] = usePageState;
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
  const draggableRef = useRef<HTMLDivElement>(null);

  /**
   * Called on when finished dragging draggable text.
   */
  const onTextDragEnd = useCallback(
    (e: MouseEvent): void => {
      setPageState((currentState) => {
        const draggable = getDivFromReference(draggableRef);
        return {
          ...currentState,
          draggable: {
            ...currentState.draggable,
            isDragging: false,
            offset: null,
          },
          textStyle: {
            ...currentState.textStyle,
            left: draggable.offsetLeft,
            top: draggable.offsetTop,
          },
        };
      });
      prohibitSideEffects(e);
    },
    [setPageState],
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

      setPageState((currentState) => {
        const draggable = getDivFromReference(draggableRef);
        return {
          ...currentState,
          textStyle: {
            ...currentState.textStyle,
            width: draggable.offsetWidth,
            height: draggable.offsetHeight,
            maxWidth: draggable.offsetWidth - DRAGGABLE_PADDING * 2,
          },
        };
      });
      prohibitSideEffects(e);
    },
    [setPageState],
  );

  // Add an event listener for the drag-end operation anywhere on the page.
  useEffect(() => {
    window.addEventListener('mouseup', onTextDragEnd);
    window.addEventListener('mouseup', onResizeHandleDragEnd);
    return () => {
      window.removeEventListener('mouseup', onTextDragEnd);
      window.removeEventListener('mouseup', onResizeHandleDragEnd);
    };
  }, [setPageState, onTextDragEnd, onResizeHandleDragEnd]);

  // Align the drag zone dimensions with the canvas when images change.
  useEffect(() => {
    const dragZone = dragZoneRef.current;
    if (dragZone) {
      const { height, width } = pageState.canvasDimensions;
      dragZone.style.height = `${height}px`;
      dragZone.style.width = `${width}px`;
    }
  }, [pageState.canvasDimensions]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onTextDragStart(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button !== 0 || e.currentTarget.id !== 'draggable') {
      return;
    }

    const draggable = getDivFromReference(draggableRef);
    setPageState((currentState) => ({
      ...currentState,
      draggable: {
        ...currentState.draggable,
        isDragging: true,
        isSelected: true,
        offset: {
          x: e.pageX - draggable.offsetLeft,
          y: e.pageY - draggable.offsetTop,
        },
      },
    }));

    prohibitSideEffects(e);
  }

  /**
   * Called repeatedly while dragging an element within the drag zone.
   * @param e The mouse event.
   */
  function onDrag(e: React.MouseEvent<HTMLDivElement>): void {
    if (pageState.draggable.isDragging) {
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
    const dragZone = getDivFromReference(dragZoneRef);
    const draggable = getDivFromReference(draggableRef);
    const dragZoneBounds = dragZone.getBoundingClientRect();

    const currentPoint: Coordinates = {
      x: e.pageX - pageState.draggable.offset!.x,
      y: e.pageY - pageState.draggable.offset!.y,
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

    const draggable = getDivFromReference(draggableRef);

    if (draggableNewWidth <= pageState.canvasDimensions.width) {
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
    const draggable = getDivFromReference(draggableRef);
    const draggableBounds = draggable.getBoundingClientRect();
    const withinDraggable =
      e.pageX >= draggableBounds.left &&
      e.pageX <= draggableBounds.right &&
      e.pageY >= draggableBounds.top &&
      e.pageY <= draggableBounds.bottom;

    if (withinDraggable) return;
    setPageState((currentState) => ({
      ...currentState,
      draggable: {
        ...currentState.draggable,
        isSelected: false,
      },
    }));
  }

  if (!pageState.names || !pageState.imageSrc) return null;

  const draggableClasses = classnames('draggable', {
    'draggable--selected': pageState.draggable.isSelected,
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
            color: pageState.textStyle.color,
            fontFamily: 'Arial',
            fontSize: '14px',
          }}>
          {pageState.names}
        </span>
        <ResizeHandles
          draggableRef={draggableRef}
          isSelected={pageState.draggable.isSelected}
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
    const { id } = e.currentTarget;
    const draggable = getDivFromReference(draggableRef);
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

  const positions: ResizeHandlePosition[] = ['east', 'west'];
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

/**
 * Retrieves a DIV element using its reference.
 * @param ref The element reference.
 * @returns The DIV element.
 */
function getDivFromReference(
  ref: React.RefObject<HTMLDivElement>,
): HTMLDivElement {
  const element = ref.current;
  if (element) {
    return element;
  } else {
    throw new Error('Element does not exist.');
  }
}

interface DraggableTextProps {
  usePageState: [PageState, React.Dispatch<React.SetStateAction<PageState>>];
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
