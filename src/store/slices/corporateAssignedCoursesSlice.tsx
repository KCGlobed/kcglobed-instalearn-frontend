import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCorporateAssignedCoursesApi } from "../../utils/service";

export interface CategoryInfo {
    id: number;
    name: string;
    description: string;
    bg_code: string;
    text_code: string;
    icon: string | null;
}

export interface Category {
    id: number;
    category_info: CategoryInfo;
    created_at: string;
}

export interface AssignedCourse {
    id: number;
    name: string;
    short_description: string;
    image: string;
    avg_rating: number;
    total_reviews: number;
    updated_at: string;
    avg_progress: number;
    enrolled_students: number;
    categories: Category[];
    certificates: number;
}

export interface CorporateAssignedCoursesState {
    data: AssignedCourse[];
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
}

const initialState: CorporateAssignedCoursesState = {
    data: [],
    loading: false,
    error: null,
    success: false,
    message: null,
};

// Async thunk to fetch corporate assigned courses progress
export const fetchCorporateAssignedCourses = createAsyncThunk<any, void, { rejectValue: string }>(
    "corporateAssignedCourses/fetchCorporateAssignedCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCorporateAssignedCoursesApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch corporate assigned courses");
        }
    }
);

const corporateAssignedCoursesSlice = createSlice({
    name: "corporateAssignedCourses",
    initialState,
    reducers: {
        clearCorporateAssignedCoursesStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCorporateAssignedCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchCorporateAssignedCourses.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload?.success ?? true;
                state.message = action.payload?.message || "Corporate assigned courses fetched successfully";
                state.data = action.payload?.data || [];
            })
            .addCase(fetchCorporateAssignedCourses.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string || "An error occurred while fetching corporate assigned courses";
            });
    },
});

export const { clearCorporateAssignedCoursesStatus } = corporateAssignedCoursesSlice.actions;
export default corporateAssignedCoursesSlice.reducer;
