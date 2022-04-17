export interface State {
  names: string;
  imageSrc: string | null;
  canvasDimensions: Dimensions;
  draggable: Draggable;
}

type Draggable = {
  isSelected: boolean;
  color: string;
  fontFamily: string;
  fontSize: number;
} & (
  | {
      isDragging: true;
      offset: Coordinates;
    }
  | { isDragging: false; offset: null }
);

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
