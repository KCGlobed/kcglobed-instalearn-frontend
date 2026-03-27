import { configureStore } from "@reduxjs/toolkit";
import homepageCategoryReducer from "./slices/homepageCategorySlice";
import authReducer from "./slices/authSlice";
import forgotPasswordReducer from "./slices/forgotpasswordSlice";
import resetPasswordReducer from "./slices/resetpasswordSlice";
import tagReducer from "./slices/tagSlice";
import courseReducer from "./slices/courseSlice";

export const store = configureStore({
  reducer: {
    homepageCategory: homepageCategoryReducer,
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    tag: tagReducer,
    course: courseReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;