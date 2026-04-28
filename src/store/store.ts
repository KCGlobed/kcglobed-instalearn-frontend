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
import filterCategoryReducer from "./slices/filterCategorySlice";
import filterCoursesParamsReducer from "./slices/filterCoursesParamsSlice";

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
    homepageRecentlyAdded: homepageRecentlyAddedReducer,
    filterCategory: filterCategoryReducer,
    filterCourseParams: filterCoursesParamsReducer,
    cart: cartReducer,

  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;