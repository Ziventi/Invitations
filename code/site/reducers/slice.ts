import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Draggable, DraggableOptions, PageState } from 'constants/types';

const initialState: PageState = {
  namesList: [],
  fileNameTemplate: '',
  selectedName: '',
  isColorPickerVisible: false,
  imageSrc: null,
  imageDimensions: {
    width: 0,
    height: 0,
  },
  canvasDimensions: {
    width: 0,
    height: 0,
  },
  textStyle: {
    color: '#000',
    fontFamily: 'Courgette',
    fontSize: 19,
    lineHeight: 24,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
  },
  draggable: {
    isDragging: false,
    isSelected: false,
    offset: null,
  },
  downloadInProgress: false,
};

export const stateSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateState: (state, action: PayloadAction<PageStatePayload>) => {
      const { draggable, textStyle, ...payload } = action.payload;
      return {
        ...state,
        ...payload,
        draggable: {
          ...state.draggable,
          ...draggable,
        },
        textStyle: {
          ...state.textStyle,
          ...textStyle,
        },
      };
    },
  },
});

export const { updateState } = stateSlice.actions;
export default stateSlice.reducer;

export type PageStatePayload = Omit<
  Partial<PageState>,
  'draggable' | 'textStyle'
> & {
  draggable?: Draggable | DraggableOptions | { isSelected: boolean };
  textStyle?: Partial<PageState['textStyle']>;
};
