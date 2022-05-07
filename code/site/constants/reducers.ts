import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { Draggable, DraggableOptions, PageState } from 'constants/types';

const initialState: PageState = {
  namesList: [],
  fileNameTemplate: '',
  selectedName: '',
  isColorPickerVisible: false,
  fileFormat: 'png',
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

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage,
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
