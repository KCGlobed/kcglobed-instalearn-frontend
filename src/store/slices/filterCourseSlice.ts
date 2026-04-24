import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseById, courseList } from "../../utils/service";

export interface Course {
    id: number;
    name: string;
    status: boolean;
}

export interface CourseState {
    courses: any;
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
};

// Async thunk to call the tags API
export const fetchCoursesList = createAsyncThunk<Course[], void, { rejectValue: string }>(
    "course/fetchCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await courseList();

            // Extracts the array regardless of Axios `{ data: [...] }` wrapper or direct return
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (Array.isArray(response)) {
                return response;
            }
            return [];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch tags");
        }
    }
);


const filterCourseSlice = createSlice({
    name: "filterCourse",
    initialState,
    reducers: {
        clearFilterCourseStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoursesList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesList.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCoursesList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearFilterCourseStatus } = filterCourseSlice.actions;
export default filterCourseSlice.reducer;