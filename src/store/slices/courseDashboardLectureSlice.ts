import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { getDashboardChapterLecturesApi } from "../../utils/service";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface VideoInfo {
    id: number;
    name: string;
    transcoded_video: string;
    video_caption: string;
    video_duration: number;
}

export interface EbookInfo {
    id?: number;
    name?: string;
}

export interface Lecture {
    id: number;
    video_info: VideoInfo;
    ebook_info: EbookInfo;
    lecture_type: number; // 1 = video, 2 = pdf
    order: number;
    created_at: string;
    chapter: number;
    video: number | null;
    ebook: number | null;
}

export interface CourseDashboardLectureState {
    // Cache: chapterId → lectures array
    lecturesByChapter: Record<number, Lecture[]>;
    // Track which chapters are loading
    loadingChapters: number[];
    // Track errors per chapter
    errorsByChapter: Record<number, string>;
}

const initialState: CourseDashboardLectureState = {
    lecturesByChapter: {},
    loadingChapters: [],
    errorsByChapter: {},
};

// ─────────────────────────────────────────────────────────────
// Async Thunk with caching guard
// ─────────────────────────────────────────────────────────────

export const fetchChapterLectures = createAsyncThunk<
    { chapterId: number; lectures: Lecture[] },
    number,
    { rejectValue: string; state: RootState }
>(
    "courseDashboardLecture/fetchChapterLectures",
    async (chapterId, { rejectWithValue, getState }) => {
        try {
            const response = await getDashboardChapterLecturesApi(chapterId);
            if (response?.success && response?.data) {
                return { chapterId, lectures: response.data as Lecture[] };
            }
            return rejectWithValue("No lecture data returned");
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || error.message || "Failed to fetch lectures"
            );
        }
    },
    {
        // Skip the API call if we already have data for this chapter (cache hit)
        condition: (chapterId, { getState }) => {
            const state = getState() as RootState;
            const existing = state.courseDashboardLecture?.lecturesByChapter?.[chapterId];
            const isLoading = state.courseDashboardLecture?.loadingChapters?.includes(chapterId);
            // Don't re-fetch if already cached or currently loading
            if (existing && existing.length > 0) return false;
            if (isLoading) return false;
            return true;
        },
    }
);

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────

const courseDashboardLectureSlice = createSlice({
    name: "courseDashboardLecture",
    initialState,
    reducers: {
        clearLectureCache: (state) => {
            state.lecturesByChapter = {};
            state.loadingChapters = [];
            state.errorsByChapter = {};
        },
        clearChapterLectures: (state, action: PayloadAction<number>) => {
            delete state.lecturesByChapter[action.payload];
            delete state.errorsByChapter[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChapterLectures.pending, (state, action) => {
                const chapterId = action.meta.arg;
                if (!state.loadingChapters.includes(chapterId)) {
                    state.loadingChapters.push(chapterId);
                }
                delete state.errorsByChapter[chapterId];
            })
            .addCase(fetchChapterLectures.fulfilled, (state, action) => {
                const { chapterId, lectures } = action.payload;
                state.lecturesByChapter[chapterId] = lectures;
                state.loadingChapters = state.loadingChapters.filter((id) => id !== chapterId);
            })
            .addCase(fetchChapterLectures.rejected, (state, action) => {
                const chapterId = action.meta.arg;
                state.loadingChapters = state.loadingChapters.filter((id) => id !== chapterId);
                state.errorsByChapter[chapterId] = action.payload ?? "Unknown error";
            });
    },
});

export const { clearLectureCache, clearChapterLectures } = courseDashboardLectureSlice.actions;
export default courseDashboardLectureSlice.reducer;
