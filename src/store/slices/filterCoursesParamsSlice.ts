import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseById, courseList, getCourseSearchFilteApi } from "../../utils/service";

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

export interface FilterCourseParams {
    subcategory?: number[];
    name?: string;
}

export const filterCoursesListParams = createAsyncThunk<Course[], FilterCourseParams, { rejectValue: string }>(
    "course/fetchCourses",
    async (filter: FilterCourseParams, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            if (filter?.subcategory?.length) {
                params.append("subcategories", filter.subcategory.join(","));
            }

            if (filter?.name?.length) {
                params.append("name", filter.name)
            }

            const response = await getCourseSearchFilteApi(params.toString());

            // Extracts the array regardless of Axios `{ data: [...] }` wrapper or direct return
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (Array.isArray(response)) {
                return response;
            }
            return [];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch courses");
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
            .addCase(filterCoursesListParams.pending, (state) => {
                state.loading = true;
            })
            .addCase(filterCoursesListParams.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(filterCoursesListParams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearFilterCourseStatus } = filterCourseSlice.actions;
export default filterCourseSlice.reducer;