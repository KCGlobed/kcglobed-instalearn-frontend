import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { homepageRecentlyAddedApi } from "../../utils/service";

export interface Course {
    id: number;
    name: string;
    price: number;
    discount: number;
    objectives_summary: string[];
    image: string;
    categories: CourseCategory[];
    duration: string;
    level: number;
    created_by: CreatedBy;
    avg_rating: number;
}

export interface CategoryInfo {
    id: number;
    name: string;
    description: string;
    bg_code: string;
    text_code: string;
    icon: string | null;
}

export interface CourseCategory {
    id: number;
    category_info: CategoryInfo;
}

export interface CreatedBy {
    id: number;
    first_name: string;
    last_name: string;
    image: string | null;
}

interface HomepageRecentlyAdded {
    loading: boolean;
    error: string | null;
    data: Course[]
}

const initialState: HomepageRecentlyAdded = {
    loading: false,
    error: null,
    data: [],
}


export const fetchHomepageRecentlyAdded = createAsyncThunk<Course[], void, { rejectValue: string }>("homepageRecentlyAdded/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await homepageRecentlyAddedApi();
        if (res?.data?.recently_added && Array.isArray(res.data.recently_added)) {
            return res.data.recently_added;
        } else if (res?.recently_added && Array.isArray(res.recently_added)) {
            return res.recently_added;
        } else if (res?.data?.courses && Array.isArray(res.data.courses)) {
            return res.data.courses;
        } else if (res?.courses && Array.isArray(res.courses)) {
            return res.courses;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (Array.isArray(res)) {
            return res;
        }
        return [];
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch recently added courses");
    }
})

export const homepageRecentlyAddedSlice = createSlice({
    name: "homepageRecentlyAdded",
    initialState,
    reducers: {
        clearRecentlyAdded(state) {
            state.data = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepageRecentlyAdded.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHomepageRecentlyAdded.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                
            })
            .addCase(fetchHomepageRecentlyAdded.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            });
    },
});

export const { clearRecentlyAdded } = homepageRecentlyAddedSlice.actions;
export default homepageRecentlyAddedSlice.reducer;