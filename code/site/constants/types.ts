import type { NextApiRequest } from 'next';
import type { Dispatch, SetStateAction } from 'react';

import type { FONT_VARIANTS } from './variables';

export interface AppState {
  namesList: string[];
  canvasDimensions: Dimensions;
  downloadInProgress: boolean;
  draggable: Draggable;
  fileFormat: FileFormat;
  imageDimensions: Dimensions;
  imageSrc: string | null;
  isColorPickerVisible: boolean;
  selectedName: string;
  textStyle: TextStyle;
  fileNameTemplate: string;
}

export interface ZiventiNextApiRequest extends NextApiRequest {
  body: RequestBody;
}

export interface RequestBody {
  backgroundImageSrc: string;
  dimensions: Dimensions;
  fileNameTemplate: string;
  format: FileFormat;
  fontId: string;
  namesList: string[];
  selectedName: string;
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
  fontStyle: FontVariantKey;
  fontSize: number;
  letterSpacing: number;
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
  variants: FontVariantKey[];
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
export type ResizeHandlePosition = 'east' | 'west';

export interface PaymentHash {
  quantity: number;
  format: FileFormat;
}

export type FontVariantKey = keyof typeof FONT_VARIANTS;
export type FontVariantAlias = typeof FONT_VARIANTS[FontVariantKey];

export type FileFormat = 'pdf' | 'png';

export interface DesignSetupStepProps {
  visible: boolean;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}
