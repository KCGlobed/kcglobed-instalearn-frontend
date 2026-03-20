import { configureStore } from "@reduxjs/toolkit";
import homepageCategoryReducer from "./slices/homepageCategorySlice";

export const store = configureStore({
  reducer: {
    homepageCategory: homepageCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;