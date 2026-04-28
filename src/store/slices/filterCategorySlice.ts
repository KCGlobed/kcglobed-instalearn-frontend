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
}

const initialState: CategoryFilterState = {
    loading: false,
    error: null,
    category: [],
};

// Async thunk to call the category filter API
export const fetchCategoryFilter = createAsyncThunk<CategoryFilter[], string | undefined, { rejectValue: string }>(
    "category/fetchCategoryFilter",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCategoryFilterApi();
            
            // Extracts the array regardless of Axios wrapper or direct return, checking for category_filter specifically
            if (response?.data?.category_filter && Array.isArray(response.data.category_filter)) {
                return response.data.category_filter;
            } else if (response?.category_filter && Array.isArray(response.category_filter)) {
                return response.category_filter;
            } else if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (Array.isArray(response)) {
                return response;
            }
            
            return [];
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
            .addCase(fetchCategoryFilter.fulfilled, (state, action: PayloadAction<CategoryFilter[]>) => {
                state.loading = false;
                state.category = action.payload;
            })
            .addCase(fetchCategoryFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearCategoryFilterStatus } = filterCategorySlice.actions;
export default filterCategorySlice.reducer;
