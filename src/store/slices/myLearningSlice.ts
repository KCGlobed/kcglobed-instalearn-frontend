import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { myCoursesApi } from "../../utils/service";

export interface MyLearningState {
    enrolledCourses: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
}

const initialState: MyLearningState = {
    enrolledCourses: [],
    loading: false,
    error: null,
    success: false,
    message: null,
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
            });
    },
});

export const { clearMyLearningStatus } = myLearningSlice.actions;
export default myLearningSlice.reducer;
