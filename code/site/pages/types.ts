export interface State {
  names: string;
  draggable:
    | {
        isDragging: true;
        offset: Coordinates;
      }
    | {
        isDragging: false;
        offset: null;
      };
}

export interface Coordinates {
  x: number;
  y: number;
}
