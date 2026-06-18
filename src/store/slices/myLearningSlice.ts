import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { myCoursesApi, getCourseProgressApi } from "../../utils/service";

export interface MyLearningState {
    enrolledCourses: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    courseProgress: any | null;
    progressLoading: boolean;
}

const initialState: MyLearningState = {
    enrolledCourses: [],
    loading: false,
    error: null,
    success: false,
    message: null,
    courseProgress: null,
    progressLoading: false,
};

export const fetchMyCoursesAction = createAsyncThunk<any, void, { rejectValue: string }>(
    "myLearning/fetchMyCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await myCoursesApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong while fetching your courses");
        }
    }
);

export const fetchCourseProgressAction = createAsyncThunk<any, number, { rejectValue: string }>(
    "myLearning/fetchCourseProgress",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await getCourseProgressApi(courseId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch course progress");
        }
    }
);

const myLearningSlice = createSlice({
    name: "myLearning",
    initialState,
    reducers: {
        clearMyLearningStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyCoursesAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchMyCoursesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Fetched courses successfully";
                if (action.payload?.data) {
                    state.enrolledCourses = action.payload.data;
                }
            })
            .addCase(fetchMyCoursesAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to fetch courses";
            })
            // Progress
            .addCase(fetchCourseProgressAction.pending, (state) => {
                state.progressLoading = true;
            })
            .addCase(fetchCourseProgressAction.fulfilled, (state, action) => {
                state.progressLoading = false;
                state.courseProgress = action.payload?.data ?? action.payload ?? null;
            })
            .addCase(fetchCourseProgressAction.rejected, (state) => {
                state.progressLoading = false;
                state.courseProgress = null;
            });
    },
});

export const { clearMyLearningStatus } = myLearningSlice.actions;
export default myLearningSlice.reducer;
