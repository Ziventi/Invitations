import type { PayloadAction } from '@reduxjs/toolkit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import type { Draggable, DraggableOptions, PageState } from 'constants/types';

const initialState: PageState = {
  namesList: [],
  draggable: {
    isDragging: false,
    isSelected: false,
    offset: null,
  },
  downloadInProgress: false,
  fileFormat: 'png',
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
    color: '#831919',
    fontFamily: 'Courgette',
    fontStyle: 'regular',
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
};

const slice = createSlice({
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

const blacklist: (keyof PageState)[] = [
  'draggable',
  'downloadInProgress',
  'isColorPickerVisible',
];
const persistedReducer = persistReducer<PageState>(
  {
    key: 'root',
    version: 1,
    storage: sessionStorage,
    blacklist,
  },
  slice.reducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const { updateState } = slice.actions;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type PageStatePayload = Omit<
  Partial<PageState>,
  'draggable' | 'textStyle'
> & {
  draggable?: Draggable | DraggableOptions | { isSelected: boolean };
  textStyle?: Partial<PageState['textStyle']>;
};
