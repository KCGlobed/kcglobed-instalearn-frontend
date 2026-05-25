import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCategoryFilterApi } from "../../utils/service";

export interface CategoryFilter {
    id: number | string;
    name: string;
    subcategory: CategoryFilter[];
}

export interface CategoryFilterState {
    loading: boolean;
    error: string | null;
    category: CategoryFilter[];
    tags: any[];
    levels: any[];
    ratings: any[];
}

const initialState: CategoryFilterState = {
    loading: false,
    error: null,
    category: [],
    tags: [],
    levels: [],
    ratings: [],
};

// Async thunk to call the category filter API
export const fetchCategoryFilter = createAsyncThunk<any, string | undefined, { rejectValue: string }>(
    "category/fetchCategoryFilter",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCategoryFilterApi();

            const data = response?.data || response;
            return {
                category: data.category_filter || [],
                tags: data.tags_filter || [],
                levels: data.level_filter || [],
                ratings: data.rating || [],
            };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch category filter");
        }
    }
);

const filterCategorySlice = createSlice({
    name: "categoryFilter",
    initialState,
    reducers: {
        clearCategoryFilterStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryFilter.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.category = action.payload.category;
                state.tags = action.payload.tags;
                state.levels = action.payload.levels;
                state.ratings = action.payload.ratings;
            })
            .addCase(fetchCategoryFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearCategoryFilterStatus } = filterCategorySlice.actions;
export default filterCategorySlice.reducer;
