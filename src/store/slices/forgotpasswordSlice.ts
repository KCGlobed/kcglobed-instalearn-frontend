import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { forgotPassword } from "../../utils/service";
import type { ForgotPasswordState, ForgotPasswordPayload, ForgotPasswordResponse } from "../../utils/types";

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  message: null,
  success: false,
};

export const forgotPasswordAction = createAsyncThunk<ForgotPasswordResponse, ForgotPasswordPayload, { rejectValue: string }>(
  "forgotpassword/forgotPasswordAction",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotpassword",
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
      .addCase(forgotPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action: PayloadAction<ForgotPasswordResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Reset link sent successfully";
      })
      .addCase(forgotPasswordAction.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to send reset link";
      });
  },
});

export const { clearStatus } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;