export interface State {
  names: string;
  imageSrc: string | null;
  canvasDimensions: Dimensions;
  draggable: Draggable;
}

type Draggable = {
  isSelected: boolean;
  textColor: string;
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
