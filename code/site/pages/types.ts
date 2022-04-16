export interface State {
  names: string;
  imageSrc: string | null;
  canvasDimensions: Dimensions;
  draggable:
    | {
        isDragging: true;
        isSelected: boolean;
        offset: Coordinates;
      }
    | {
        isDragging: false;
        isSelected: boolean;
        offset: null;
      };
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
