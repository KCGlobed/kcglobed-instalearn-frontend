import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCorporateDashboardCountersApi } from "../../utils/service";

export interface CorporateDashboardData {
    no_of_licences: number;
    license_used: number;
    remaning_licence: number;
    registered_users: number;
    assigned_courses: number;
    total_video_watched: number;
    total_duration_video_watched: number;
}

export interface CorporateDashboardState {
    counters: CorporateDashboardData | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
}

const initialState: CorporateDashboardState = {
    counters: null,
    loading: false,
    error: null,
    success: false,
    message: null,
};

// Async thunk to fetch corporate dashboard counter metrics
export const fetchCorporateDashboardCounters = createAsyncThunk<any, void, { rejectValue: string }>(
    "corporateDashboard/fetchCorporateDashboardCounters",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCorporateDashboardCountersApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch corporate dashboard counters");
        }
    }
);

const corporateDashboardSlice = createSlice({
    name: "corporateDashboard",
    initialState,
    reducers: {
        clearCorporateDashboardStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCorporateDashboardCounters.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchCorporateDashboardCounters.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload?.success ?? true;
                state.message = action.payload?.message || "Corporate dashboard metrics fetched successfully";
                state.counters = action.payload?.data || null;
            })
            .addCase(fetchCorporateDashboardCounters.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string || "An error occurred while fetching corporate dashboard metrics";
            });
    },
});

export const { clearCorporateDashboardStatus } = corporateDashboardSlice.actions;
export default corporateDashboardSlice.reducer;
