import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getUserStudyProgressApi } from "../../utils/service";

export interface UserStudyProgressState {
    data: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    period: string;
}

const initialState: UserStudyProgressState = {
    data: [],
    loading: false,
    error: null,
    success: false,
    message: null,
    period: 'daily',
};

export const fetchUserStudyProgress = createAsyncThunk<any, string, { rejectValue: string }>(
    "userStudyProgress/fetchUserStudyProgress",
    async (period, { rejectWithValue }) => {
        try {
            const response = await getUserStudyProgressApi(period);
            return { response, period };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch user study progress");
        }
    }
);

const userStudyProgressSlice = createSlice({
    name: "userStudyProgress",
    initialState,
    reducers: {
        setPeriod: (state, action: PayloadAction<string>) => {
            state.period = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserStudyProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchUserStudyProgress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload.response?.success ?? true;
                state.message = action.payload.response?.message || "Data fetched successfully";
                state.data = action.payload.response?.data || [];
                state.period = action.payload.period;
            })
            .addCase(fetchUserStudyProgress.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string || "An error occurred";
                state.data = [];
            });
    },
});

export const { setPeriod } = userStudyProgressSlice.actions;
export default userStudyProgressSlice.reducer;
