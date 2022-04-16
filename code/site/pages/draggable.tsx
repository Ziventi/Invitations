import React, { ReactElement, useEffect, useRef } from 'react';

import { State } from './types';

export default function DraggableText({
  state,
  updateState,
}: DraggableTextProps): ReactElement | null {
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDragEnd = (e: MouseEvent): void => {
      updateState({ draggable: { isDragging: false, offset: null } });
      prohibitSideEffects(e);
    };
    window.addEventListener('mouseup', onDragEnd);
    return () => {
      window.removeEventListener('mouseup', onDragEnd);
    };
  }, [updateState]);

  /**
   * Called on mouse-down to start dragging the draggable. Triggers only on
   * left-clicks on the draggable element.
   * @param e The mouse event.
   */
  function onDragStart(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button !== 0 || e.currentTarget.className !== 'draggable') {
      return;
    }

    const draggable = getDivElement(draggableRef);
    updateState({
      draggable: {
        isDragging: true,
        offset: {
          x: e.pageX - draggable.offsetLeft,
          y: e.pageY - draggable.offsetTop,
        },
      },
    });

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

    // TODO: Fix behaviour when dragging out of bounds.
    const dragZoneBounds = dragZone.getBoundingClientRect();
    const draggableBounds = draggable.getBoundingClientRect();
    const withinDragZone =
      draggableBounds.left >= dragZoneBounds.left &&
      draggableBounds.right <= dragZoneBounds.right &&
      draggableBounds.top >= dragZoneBounds.top &&
      draggableBounds.bottom <= dragZoneBounds.bottom;

    if (withinDragZone) {
      draggable.style.left = `${e.pageX - state.draggable.offset.x}px`;
      draggable.style.top = `${e.pageY - state.draggable.offset.y}px`;
    } else {
      if (draggableBounds.left < dragZoneBounds.left) {
        draggable.style.left = `${dragZoneBounds.left}px`;
      } else if (draggableBounds.right > dragZoneBounds.right)
        draggable.style.left = `${
          dragZoneBounds.right - draggable.clientWidth
        }px`;
    }

    prohibitSideEffects(e);
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

  if (!state.names) return null;
  return (
    <div className={'drag-zone'} onMouseMove={onDrag} ref={dragZoneRef}>
      <div className={'draggable'} onMouseDown={onDragStart} ref={draggableRef}>
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

interface DraggableTextProps {
  state: State;
  updateState: (newStateValues: Partial<Record<keyof State, any>>) => void;
}
