import { configureStore } from "@reduxjs/toolkit";
import homepageCategoryReducer from "./slices/homepageCategorySlice";
import authReducer from "./slices/authSlice";
import forgotPasswordReducer from "./slices/forgotpasswordSlice";
import resetPasswordReducer from "./slices/resetpasswordSlice";
import tagReducer from "./slices/tagSlice";
import courseReducer from "./slices/courseSlice";
import filterCourseReducer from "./slices/filterCourseSlice";
import courseDetailReducer from "./slices/courseDetailSlice";
import cartReducer from "./slices/courseCartSlice";

import homepageRecentlyAddedReducer from "./slices/homepageRecentlyAdded";

export const store = configureStore({
  reducer: {
    homepageCategory: homepageCategoryReducer,
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    tag: tagReducer,
    course: courseReducer,
    filterCourse: filterCourseReducer,
    courseDetail: courseDetailReducer,
    cart: cartReducer,
    homepageRecentlyAdded: homepageRecentlyAddedReducer

  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;