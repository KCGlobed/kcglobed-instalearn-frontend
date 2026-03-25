import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseTag } from "../../utils/service";

export interface Tag {
    id: number;
    name: string;
    status: boolean;
}

export interface TagState {
    tags: Tag[];
    loading: boolean;
    error: string | null;
}

const initialState: TagState = {
    tags: [],
    loading: false,
    error: null,
};

// Async thunk to call the tags API
export const fetchTags = createAsyncThunk<Tag[], void, { rejectValue: string }>(
    "tag/fetchTags",
    async (_, { rejectWithValue }) => {
        try {
            const response = await courseTag();

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
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
                state.loading = false;
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearTagStatus } = tagSlice.actions;
export default tagSlice.reducer;