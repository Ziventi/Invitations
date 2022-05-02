import { NextApiRequest } from 'next';

export interface PageState {
  namesList: string[];
  canvasDimensions: Dimensions;
  downloadInProgress: boolean;
  draggable: Draggable;
  imageDimensions: Dimensions;
  imageSrc: string | null;
  isColorPickerVisible: boolean;
  selectedName: string;
  textStyle: TextStyle;
}

export type PageStateHook = [
  PageState,
  React.Dispatch<React.SetStateAction<PageState>>,
];

export interface ZiventiNextApiRequest extends NextApiRequest {
  body: RequestBody;
}

export interface RequestBody {
  backgroundImageSrc: string;
  dimensions: Dimensions;
  format: 'png' | 'pdf';
  fontId: string;
  namesList: string[];
  textStyle: TextStyle;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface TextStyle {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
  scaleX: number;
  scaleY: number;
}

export interface GoogleFont {
  id: string;
  family: string;
  variants?: string[];
  subsets?: string[];
  category?: string;
  version?: string;
  lastModified?: string;
  popularity?: number;
  defSubset?: string;
  defVariant?: string;
}

export type Draggable = { isSelected: boolean } & DraggableOptions;
export type DraggableOptions =
  | {
      isDragging: true;
      offset: Coordinates;
    }
  | { isDragging: false; offset: null };
