import type { NextApiRequest } from 'next';
import type { Dispatch, SetStateAction } from 'react';

import type { FONT_VARIANTS } from './variables';

export interface AppState {
  namesList: string[];
  downloadInProgress: boolean;
  fileFormat: FileFormat;
  imageDimensions: Dimensions;
  imageSrc: string | null;
  selectedName: string;
  fileNameTemplate: string;
  draggable: Draggable;
}

export interface ZiventiNextApiRequest extends NextApiRequest {
  body: RequestBody;
}

export interface RequestBody {
  backgroundImageSrc: string;
  draggable: Draggable;
  dimensions: Dimensions;
  fileNameTemplate: string;
  format: FileFormat;
  fontId: string;
  fragmentedNamesList: string[][];
  selectedNameFragments: string[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Draggable {
  style: DraggableStyle;
  position: DraggablePosition;
}

export interface DraggableStyle {
  color: string;
  fontFamily: string;
  fontStyle: FontVariantKey;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  maxWidth: number;
}

export interface DraggablePosition {
  left: number;
  top: number;
  width: number;
  height: number;
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

export type ResizeHandlePosition = 'east' | 'west';

export interface PaymentHash {
  quantity: number;
  format: FileFormat;
}

export type FontVariantKey = keyof typeof FONT_VARIANTS;

export type FileFormat = 'pdf' | 'png' | 'svg';

export interface DesignSetupStepProps {
  visible: boolean;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

export interface DesignSetupHash {
  namesList: string[];
  imageSource: string;
}
