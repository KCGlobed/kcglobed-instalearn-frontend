import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseDetailById, getDashboardChaptersApi } from "../../utils/service";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ChapterInfo {
    id: number;
    name: string;
    no_of_videos: number;
    no_of_videos_duration: number;
}

export interface Chapter {
    id: number;
    chapter_info: ChapterInfo;
    progress: number;
    video_watched: number;
    total_video_watched: number;
}

export interface CourseDetailState {
    chapters: Chapter[];
    loading: boolean;
    error: string | null;
}

const initialState: CourseDetailState = {
    chapters: [],
    loading: false,
    error: null,
};

// ─────────────────────────────────────────────────────────────
// Async Thunk
// ─────────────────────────────────────────────────────────────

export const fetchDashboardChapterBySlug = createAsyncThunk<Chapter[], number, { rejectValue: string }>(
    "courseDashboardChapter/fetchDashboardChapterBySlug",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getDashboardChaptersApi(id);
            console.log(response?.data, "check api response")
            if (response?.data) {
                return response.data as Chapter[];
            }
            return rejectWithValue("No chapter data returned");
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error.message ||
                "Failed to fetch chapters"
            );
        }
    }
);

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────

const courseDetailSlice = createSlice({
    name: "courseDetail",
    initialState,
    reducers: {
        clearCourseDetail: (state) => {
            state.chapters = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardChapterBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchDashboardChapterBySlug.fulfilled,
                (state, action: PayloadAction<Chapter[]>) => {
                    state.loading = false;
                    state.chapters = action.payload;
                }
            )

            .addCase(fetchDashboardChapterBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            });
    },
});

export const { clearCourseDetail } = courseDetailSlice.actions;

export default courseDetailSlice.reducer;