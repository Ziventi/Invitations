import classnames from 'classnames';
import React, { ReactElement, useEffect, useRef } from 'react';

import { Coordinates, State } from './types';

export default function DraggableText({
  state,
  setState,
}: DraggableTextProps): ReactElement | null {
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const draggableClasses = classnames('draggable', {
    'draggable--selected': state.draggable.isSelected,
  });

  // Add an event listener for the drag-end operation anywhere on the page.
  useEffect(() => {
    const onDragEnd = (e: MouseEvent): void => {
      setState((currentState) => ({
        ...currentState,
        draggable: {
          ...currentState.draggable,
          isDragging: false,
          offset: null,
        },
      }));
      prohibitSideEffects(e);
    };
    window.addEventListener('mouseup', onDragEnd);
    return () => {
      window.removeEventListener('mouseup', onDragEnd);
    };
  }, [setState]);

  // Align the drag zone dimensions with the canvas when images change.
  useEffect(() => {
    const dragZone = dragZoneRef.current;
    if (dragZone) {
      const { height, width } = state.canvasDimensions;
      dragZone.style.height = `${height}px`;
      dragZone.style.width = `${width}px`;
    }
  }, [state.canvasDimensions]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onDragStart(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button !== 0 || e.currentTarget.id !== 'draggable') {
      return;
    }

    const draggable = getDivElement(draggableRef);
    setState((currentState) => ({
      ...currentState,
      draggable: {
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
   * Called repeatedly while the draggable element is dragged.
   * @param e The mouse event.
   */
  function onDrag(e: React.MouseEvent<HTMLDivElement>): void {
    if (!state.draggable.isDragging) return;

    const dragZone = getDivElement(dragZoneRef);
    const draggable = getDivElement(draggableRef);
    const dragZoneBounds = dragZone.getBoundingClientRect();

    const currentPoint: Coordinates = {
      x: e.pageX - state.draggable.offset.x,
      y: e.pageY - state.draggable.offset.y,
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
   * Deselect the draggable when clicked outside of it but within the drag zone.
   * @param e The mouse event.
   */
  function onDragZoneClick(e: React.MouseEvent<HTMLDivElement>): void {
    const draggable = getDivElement(draggableRef);
    const draggableBounds = draggable.getBoundingClientRect();
    const withinDraggable =
      e.pageX >= draggableBounds.left &&
      e.pageX <= draggableBounds.right &&
      e.pageY >= draggableBounds.top &&
      e.pageY <= draggableBounds.bottom;

    if (withinDraggable) return;
    setState((currentState) => ({
      ...currentState,
      draggable: {
        ...currentState.draggable,
        isSelected: false,
      },
    }));
  }

  if (!state.names || !state.imageSrc) return null;
  return (
    <div
      className={'drag-zone'}
      onMouseDown={onDragZoneClick}
      onMouseMove={onDrag}
      ref={dragZoneRef}
    >
      <div
        id={'draggable'}
        className={draggableClasses}
        onMouseDown={onDragStart}
        ref={draggableRef}
      >
        {state.names}
      </div>
    </div>
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
function getDivElement(ref: React.RefObject<HTMLDivElement>): HTMLDivElement {
  const element = ref.current;
  if (element) {
    return element;
  } else {
    throw new Error('Element does not exist.');
  }
}

interface DraggableTextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}
