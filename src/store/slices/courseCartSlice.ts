import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addToCart, checkCourseCart, viewCart } from "../../utils/service";

export interface CartState {
    itemCount: number;
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    isInCart: boolean;
    cartItems: any[];
}

const initialState: CartState = {
    itemCount: 0,
    cartItems: [],
    loading: false,
    error: null,
    success: false,
    message: null,
    isInCart: false,
};

export const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
};

export const addToCartAction = createAsyncThunk<any, { course_id: number }, { rejectValue: string }>(
    "cart/addToCart",
    async (payload, { rejectWithValue }) => {
        try {
            const device_id = getDeviceId();
            console.log("device_id", device_id);
            console.log("payload", payload);
            const response = await addToCart({ ...payload, device_id });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong while adding to cart");
        }
    }
);


export const viewCartDetails = createAsyncThunk<any, void, { rejectValue: string }>(
    "cart/viewCart",
    async (_, { rejectWithValue }) => {
        try {
            const device_id = getDeviceId();
            const response = await viewCart({ device_id });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong while adding to cart");
        }
    }
);


export const checkCourseCartAction = createAsyncThunk<any, { course_id: number | string }, { rejectValue: string }>(
    "cart/checkCourseCart",
    async (payload, { rejectWithValue }) => {
        try {
            const device_id = getDeviceId();
            const response = await checkCourseCart({ ...payload, device_id });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to check cart status");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
        updateItemCount: (state, action: PayloadAction<number>) => {
            state.itemCount = action.payload;
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            console.log("id", action.payload);
            state.cartItems = state.cartItems.filter((item: any) => item.id !== action.payload);
            state.itemCount = state.cartItems.length;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addToCartAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Added to cart successfully";
                state.cartItems.push(action.payload?.data);
            })
            .addCase(addToCartAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to add to cart";

            })
            .addCase(viewCartDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(viewCartDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Viewed cart successfully";
                if (action.payload?.data) {
                    state.cartItems = action.payload.data;
                }
            })
            .addCase(viewCartDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to view cart";
            })
    },
});

export const { clearCartStatus, updateItemCount, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;