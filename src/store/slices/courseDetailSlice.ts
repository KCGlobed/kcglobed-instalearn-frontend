import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { courseById, courseDetailById } from "../../utils/service";

// ── Nested types ─────────────────────────────────────────────────────────────

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
    created_at: string;
}

export interface TagInfo {
    id: number;
    name: string;
}

export interface CourseTag {
    id: number;
    tags: TagInfo;
}

export interface InstructorInfo {
    id: number;
    text_1: string;
    text_2: string;
    text_3: string;
    image: string | null;
    experience: string;
    company_image_1: string | null;
    company_image_2: string | null;
}

export interface CourseInstructor {
    id: number;
    instructor_info: InstructorInfo;
}

export interface SampleVideo {
    id: number;
    name: string;
    thumbnail: string | null;
    videos: string;
    duration: string;
}

export interface CreatedBy {
    id: number;
    first_name: string;
    last_name: string;
    image: string | null;
}

// ── Main course detail type ───────────────────────────────────────────────────

export interface CourseDetail {
    id: number;
    name: string;
    description: string;
    short_description: string;
    duration: string;
    requirements: string;
    price: number | null;
    discount: number | null;
    feature_json: string[];
    image: string | null;
    banner_image: string | null;
    categories?: CourseCategory[];
    objectives_summary: string[];
    tags: CourseTag[];
    status: boolean;
    created_at: string;
    instrcutor_info: CourseInstructor[];
    sample_videos: SampleVideo[];
    avg_rating: number;
    total_reviews: number;
    created_by: CreatedBy;
    level: number;
    chapters?: any[];
    original_price?: number;
    language: string;
    subtitle_language: string;
    enrolled_students: number;
    course_includes?: any[];
    is_in_wishlist?: boolean;
    total_video_duration: string | number | null;
    related_course?: any[]
}

// ── Slice state ───────────────────────────────────────────────────────────────

export interface CourseDetailState {
    courseDetail: CourseDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: CourseDetailState = {
    courseDetail: null,
    loading: false,
    error: null,
};

// ── Async thunk ───────────────────────────────────────────────────────────────

export const fetchCourseById = createAsyncThunk<
    CourseDetail,
    number,
    { rejectValue: string }
>(
    "courseDetail/fetchCourseById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseDetailById(id);
            // API returns { success, status, message, data: { ... } }
            if (response?.data) {
                return response.data as CourseDetail;
            }
            return rejectWithValue("No course data returned");
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || error.message || "Failed to fetch course details"
            );
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const courseDetailSlice = createSlice({
    name: "courseDetail",
    initialState,
    reducers: {
        clearCourseDetail: (state) => {
            state.courseDetail = null;
            state.loading = false;
            state.error = null;
        },
        toggleCourseWishlistStatus: (state) => {
            if (state.courseDetail) {
                state.courseDetail.is_in_wishlist = !state.courseDetail.is_in_wishlist;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchCourseById.fulfilled,
                (state, action: PayloadAction<CourseDetail>) => {
                    state.loading = false;
                    state.courseDetail = action.payload;
                }
            )
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            });
    },
});

export const { clearCourseDetail, toggleCourseWishlistStatus } = courseDetailSlice.actions;
export default courseDetailSlice.reducer;