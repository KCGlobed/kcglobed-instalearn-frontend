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
import wishListReducer from "./slices/courseWishList";
import notificationReducer from "./slices/notificationSlice";
import myLearningReducer from "./slices/myLearningSlice";

import filterCategoryReducer from "./slices/filterCategorySlice";
import filterCoursesParamsReducer from "./slices/filterCoursesParamsSlice";
import courseDashboardChapterReducer from "./slices/courseDashboardChapterSlice";
import courseDashboardLectureReducer from "./slices/courseDashboardLectureSlice";
import notesReducer from "./slices/noteSlice";
import reviewReducer from "./slices/reviewSlice";



import { videoApi } from "./api/videoApi";

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
    homepageRecentlyAdded: homepageRecentlyAddedReducer,
    wishList: wishListReducer,
    notification: notificationReducer,
    myLearning: myLearningReducer,

    filterCategory: filterCategoryReducer,
    filterCourseParams: filterCoursesParamsReducer,
    courseDashboardChapter: courseDashboardChapterReducer,
    courseDashboardLecture: courseDashboardLectureReducer,
    notes: notesReducer,
    [videoApi.reducerPath]: videoApi.reducer,
    review: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoApi.middleware),
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;