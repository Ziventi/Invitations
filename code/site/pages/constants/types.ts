import { NextApiRequest } from 'next';

export interface PageState {
  names: string;
  imageSrc: string | null;
  canvasDimensions: Dimensions;
  draggable: Draggable;
  textStyle: TextStyle;
  downloadInProgress: boolean;
}

export interface ZiventiNextApiRequest extends NextApiRequest {
  body: {
    backgroundImage: string;
    dimensions: Dimensions;
    names: string;
    textStyle: TextStyle;
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

interface TextStyle {
  color: string;
  fontFamily: string;
  fontSize: number;
  left: number;
  top: number;
  maxWidth: number;
}

type Draggable = {
  isSelected: boolean;
} & (
  | {
      isDragging: true;
      offset: Coordinates;
    }
  | { isDragging: false; offset: null }
);
