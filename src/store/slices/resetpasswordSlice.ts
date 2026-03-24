import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetPassword } from "../../utils/service";
import type { ResetPasswordState, ResetPasswordPayload, ForgotPasswordResponse } from "../../utils/types";

const initialState: ResetPasswordState = {
    loading: false,
    error: null,
    message: null,
    success: false,
};

export const resetPasswordAction = createAsyncThunk<ForgotPasswordResponse, ResetPasswordPayload, { rejectValue: string }>(
    "resetpassword/resetPasswordAction",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await resetPassword(payload);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

const resetpasswordSlice = createSlice({
    name: "resetpassword",
    initialState,
    reducers: {
        clearStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetPasswordAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPasswordAction.fulfilled, (state, action: PayloadAction<ForgotPasswordResponse>) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || "Password reset successfully";
            })
            .addCase(resetPasswordAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to reset password";
            });
    },
});

export const { clearStatus } = resetpasswordSlice.actions;
export default resetpasswordSlice.reducer;
