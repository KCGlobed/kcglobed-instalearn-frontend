import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCorporateUsersListApi } from "../../utils/service";

export interface CourseDetail {
    id: number;
    name: string;
}

export interface UserCourse {
    id: number;
    course_detail: CourseDetail;
}

export interface CorporateUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone1: string | null;
    is_active: boolean;
    date_joined: string;
    last_login: string | null;
    image: string | null;
    courses: UserCourse[];
}

export interface Pagination {
    total_results: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    previous_page: number | null;
    page_size: number;
}

export interface CorporateUserState {
    corporateUsers: CorporateUser[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
}

const initialState: CorporateUserState = {
    corporateUsers: [],
    pagination: null,
    loading: false,
    error: null,
    success: false,
    message: null,
};

// Async thunk to fetch corporate users list
export const fetchCorporateUsers = createAsyncThunk<any, number | undefined, { rejectValue: string }>(
    "corporateUser/fetchCorporateUsers",
    async (page, { rejectWithValue }) => {
        try {
            const response = await getCorporateUsersListApi(page);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch corporate users");
        }
    }
);

const corporateUserSlice = createSlice({
    name: "corporateUser",
    initialState,
    reducers: {
        clearCorporateUserStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCorporateUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchCorporateUsers.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload?.success ?? true;
                state.message = action.payload?.message || "Corporate users fetched successfully";
                state.corporateUsers = action.payload?.data || [];
                state.pagination = action.payload?.pagination || null;
            })
            .addCase(fetchCorporateUsers.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string || "An error occurred while fetching corporate users";
            });
    },
});

export const { clearCorporateUserStatus } = corporateUserSlice.actions;
export default corporateUserSlice.reducer;
