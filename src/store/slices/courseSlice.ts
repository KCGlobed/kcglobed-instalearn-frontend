import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseById } from "../../utils/service";

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
export const fetchCoursesById = createAsyncThunk<Course[], number, { rejectValue: string }>(
    "course/fetchCourses",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await courseById(id);

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

const tagSlice = createSlice({
    name: "tag",
    initialState,
    reducers: {
        clearTagStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoursesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesById.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCoursesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearTagStatus } = tagSlice.actions;
export default tagSlice.reducer;