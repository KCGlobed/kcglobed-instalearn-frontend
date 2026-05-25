import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addReviewRatingApi, deleteReviewRatingApi, getReviewRatingApi, updateReviewRatingApi } from "../../utils/service";


// ---------------- TYPES ----------------

export interface Review {
    id: number;
    review: string;
    rating: number;
}

export interface ReviewState {
    review: Review | null;
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    review: null,
    loading: false,
    error: null,
};

// ---------------- API THUNKS ----------------

// GET REVIEW
export const fetchReview = createAsyncThunk<
    Review,
    number,
    { rejectValue: string }
>(
    "review/fetchReview",
    async (courseId: number, { rejectWithValue }) => {
        try {
            const response = await getReviewRatingApi(courseId);

            return response?.data?.data || response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to fetch review"
            );
        }
    }
);

// CREATE REVIEW
export const createReview = createAsyncThunk(
    "review/createReview",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await addReviewRatingApi(payload);

            return response?.data?.data || response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to create review"
            );
        }
    }
);

// UPDATE REVIEW
export const updateReview = createAsyncThunk(
    "review/updateReview",
    async (
        payload: { id: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await updateReviewRatingApi(
                payload.id,
                payload.data
            );

            return response?.data?.data || response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to update review"
            );
        }
    }
);

// DELETE REVIEW
export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteReviewRatingApi(id);

            return id;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to delete review"
            );
        }
    }
);

// ---------------- SLICE ----------------

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        clearReviewStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH REVIEW
            .addCase(fetchReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchReview.fulfilled,
                (state, action: PayloadAction<Review>) => {
                    state.loading = false;
                    state.review = action.payload;
                }
            )

            .addCase(fetchReview.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch review";
            })

            // CREATE REVIEW
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                createReview.fulfilled,
                (state, action: PayloadAction<Review>) => {
                    state.loading = false;
                    state.review = action.payload;
                }
            )

            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to create review";
            })

            // UPDATE REVIEW
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                updateReview.fulfilled,
                (state, action: PayloadAction<Review>) => {
                    state.loading = false;
                    state.review = action.payload;
                }
            )

            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to update review";
            })

            // DELETE REVIEW
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteReview.fulfilled, (state) => {
                state.loading = false;
                state.review = null;
            })

            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to delete review";
            });
    },
});

export const { clearReviewStatus } = reviewSlice.actions;

export default reviewSlice.reducer;