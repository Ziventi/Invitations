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

import type {
  AppState,
  DraggablePosition,
  DraggableStyle,
} from 'constants/types';

const initialState: AppState = {
  namesList: [],
  downloadInProgress: false,
  fileFormat: 'png',
  fileNameTemplate: '',
  selectedName: '',
  imageSrc: null,
  imageDimensions: {
    width: 0,
    height: 0,
  },
  draggable: {
    style: {
      color: '#831919FF',
      fontFamily: 'Courgette',
      fontStyle: 'regular',
      fontSize: 19,
      letterSpacing: 0,
      lineHeight: 24,
      maxWidth: 100,
    },
    position: {
      left: 0,
      top: 0,
      height: 0,
      width: 0,
    },
  },
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateState: (state, action: PayloadAction<UpdateStatePayload>) => {
      return {
        ...state,
        ...action.payload,
        draggable: {
          style: {
            ...state.draggable.style,
            ...action.payload.draggable?.style,
          },
          position: {
            ...state.draggable.position,
            ...action.payload.draggable?.position,
          },
        },
      };
    },
    updateDraggable: (state, action: PayloadAction<UpdateDraggablePayload>) => {
      return {
        ...state,
        draggable: {
          style: {
            ...state.draggable.style,
            ...action.payload.style,
          },
          position: {
            ...state.draggable.position,
            ...action.payload.position,
          },
        },
      };
    },
  },
});

const blacklist: (keyof AppState)[] = ['downloadInProgress'];
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
export const { updateState, updateDraggable } = slice.actions;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type UpdateStatePayload = Omit<Partial<AppState>, 'draggable'> & {
  draggable?: {
    style?: Partial<DraggableStyle>;
    position?: Partial<DraggablePosition>;
  };
};
type UpdateDraggablePayload = {
  style?: Partial<DraggableStyle>;
  position?: Partial<DraggablePosition>;
};
