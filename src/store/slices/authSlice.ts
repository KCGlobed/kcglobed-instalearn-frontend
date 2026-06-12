import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storeToken, storeRefreshToken, getToken, clearToken, storeUserID, storeUserRole, storeUserProfile } from "../../utils/tokenStorage";
import { apiRequest } from "../../utils/apiRequest";
import { socialLoginApi } from "../../utils/service";
import type { AuthState, LoginCred } from "../../utils/types";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";


const initialState: AuthState = {
  isAuthenticated: !!getToken(),
  token: getToken(),
  role: {
    data: []
  },
  loading: false,
  error: null,
};

// ─── Email/Password Login ────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: LoginCred,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest<{
        data: any; token: string
      }>(
        API_ENDPOINTS.LOGIN,
        "POST",
        credentials
      );
      const { access, refresh }: any = response.data.token;

      storeToken(access);
      storeRefreshToken(refresh);
      storeUserID(response.data.user_id);
      storeUserRole(response.data.user_role);
      storeUserProfile(JSON.stringify(response.data));
      return access;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// ─── Google Social Login ─────────────────────────────────────────────────────

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (
    payload: {
      name: string;
      email: string;
      social_id: string;
      social_type: string;
      token: string;
      role: string;
      device_id: string;
      device_type: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await socialLoginApi(payload);

      // Backend returns token as { access, refresh } or flat token
      const tokenData = response?.data?.token ?? response?.token;
      const access = tokenData?.access ?? tokenData;
      const refresh = tokenData?.refresh ?? null;

      if (!access) throw new Error("No access token received from server");

      storeToken(access);
      if (refresh) storeRefreshToken(refresh);
      storeUserID(response?.data?.user_id ?? response?.user_id ?? "");
      storeUserRole(response?.data?.user_role ?? response?.user_role ?? "Student");
      storeUserProfile(JSON.stringify(response?.data ?? response));

      return access;
    } catch (error: any) {
      return rejectWithValue(error.message || "Google login failed");
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      clearToken();
    },
    restoreAuth: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Email login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Google login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
