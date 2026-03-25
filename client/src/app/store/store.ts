import { configureStore } from '@reduxjs/toolkit';
import { adsUiReducer } from '@/app/store/slices/adsUiSlice';
import { themeReducer } from '@/app/store/slices/themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    adsUi: adsUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
