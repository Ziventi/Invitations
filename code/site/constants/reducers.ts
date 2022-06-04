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

import type { Draggable, DraggableOptions, AppState } from 'constants/types';

const initialState: AppState = {
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
  textStyle: {
    color: '#831919FF',
    fontFamily: 'Courgette',
    fontStyle: 'regular',
    fontSize: 19,
    letterSpacing: 0,
    lineHeight: 24,
    left: 0,
    top: 0,
    height: 0,
    width: 0,
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

const blacklist: (keyof AppState)[] = [
  'draggable',
  'downloadInProgress',
  'isColorPickerVisible',
];
const persistedReducer = persistReducer<AppState>(
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
  Partial<AppState>,
  'draggable' | 'textStyle'
> & {
  draggable?: Draggable | DraggableOptions | { isSelected: boolean };
  textStyle?: Partial<AppState['textStyle']>;
};
