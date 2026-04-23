import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, API_ENDPOINTS } from "../../utils/apiEndpoints";
import { homepageCategoryListApi } from "../../utils/service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomepageCategory {
  id: number;
  name: string;
  total_courses: number;
  status: boolean;
  created_at: string;
  icon: string;
  bg_code: string,
  textCode: string,

}

interface HomepageCategoryState {
  categories: HomepageCategory[];
  loading: boolean;
  error: string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: HomepageCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

export const fetchHomepageCategories = createAsyncThunk<
  HomepageCategory[],
  void,
  { rejectValue: string }
>("homepageCategory/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const json = await homepageCategoryListApi();

    if (!json.success) {
      return rejectWithValue(json.message ?? "Unknown error from server");
    }

    return json.data as HomepageCategory[];
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const homepageCategorySlice = createSlice({
  name: "homepageCategory",
  initialState,
  reducers: {
    clearCategories(state) {
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomepageCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { clearCategories } = homepageCategorySlice.actions;
export default homepageCategorySlice.reducer;
