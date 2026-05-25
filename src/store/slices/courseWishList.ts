import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toggleWishlistApi, wishlistApi } from "../../utils/service";
import { getToken } from "../../utils/tokenStorage";

export interface WishListState {
    itemCount: number;
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    wishListItems: any[];
}

const initialState: WishListState = {
    itemCount: 0,
    wishListItems: [],
    loading: false,
    error: null,
    success: false,
    message: null,
};

export const toggleWishlistAction = createAsyncThunk<any, { course_id: number | string }, { rejectValue: string }>(
    "wishList/toggleWishlist",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await toggleWishlistApi(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong while toggling wishlist");
        }
    }
);

export const viewWishlistAction = createAsyncThunk<any, void, { rejectValue: string }>(
    "wishList/viewWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong while fetching wishlist");
        }
    },
    {
        condition: () => {
            const token = getToken();
            if (!token) {
                return false;
            }
            return true;
        },
    }
);

const courseWishListSlice = createSlice({
    name: "wishList",
    initialState,
    reducers: {
        clearWishListStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
        updateWishListItemCount: (state, action: PayloadAction<number>) => {
            state.itemCount = action.payload;
        },
        removeFromWishList: (state, action: PayloadAction<number>) => {
            state.wishListItems = state.wishListItems.filter((item: any) =>
                item.id !== action.payload &&
                item.course_info?.id !== action.payload &&
                item.course_id !== action.payload
            );
            state.itemCount = state.wishListItems.length;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleWishlistAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(toggleWishlistAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Wishlist toggled successfully";

                const courseId = Number(action.meta.arg.course_id);
                const responseData = action.payload?.data;

                // Trust the server response:
                // 1. Remove the course from the local list first to avoid duplicates
                state.wishListItems = state.wishListItems.filter((item: any) =>
                    (item.course_info?.id || item.course_id) !== courseId
                );

                // 2. If the response contains the course object (ADD), push it back to the list
                // If it's empty {} (REMOVE), we leave it removed
                if (responseData && Object.keys(responseData).length > 0) {
                    state.wishListItems.push(responseData);
                }

                state.itemCount = state.wishListItems.length;
            })
            .addCase(toggleWishlistAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to toggle wishlist";
            })
            .addCase(viewWishlistAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(viewWishlistAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Viewed wishlist successfully";
                if (action.payload?.data) {
                    state.wishListItems = action.payload.data;
                    state.itemCount = action.payload.data.length;
                }
            })
            .addCase(viewWishlistAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to view wishlist";
            });
    },
});

export const { clearWishListStatus, updateWishListItemCount, removeFromWishList } = courseWishListSlice.actions;
export default courseWishListSlice.reducer;
