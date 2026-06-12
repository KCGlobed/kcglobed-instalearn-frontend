import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addCommentOnAnnouncementsApi, getAnnouncementsApi } from "../../utils/service";

// ---------------- TYPES ----------------

export interface Course {
    id: number;
    name: string;
}

export interface Instructor {
    id: number;
    text_1: string;
    text_2: string;
    text_3: string;
    image: string | null;
    experience: string;
    company_image_1: string | null;
    company_image_2: string | null;
}

export interface CommentUser {
    id: number;
    first_name: string;
    last_name: string;
    image: string | null;
    email: string;
}

export interface AnnouncementComment {
    id: number;
    user: CommentUser;
    content: string;
    created_at: string;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    status: boolean;
    created_at: string;
    course: Course;
    instructor: Instructor;
    announcement_comments: AnnouncementComment[];
    likedByMe?: boolean;
    likesCount?: number;
}

export interface AnnouncementState {
    announcements: Announcement[];
    loading: boolean;
    error: string | null;
}

const initialState: AnnouncementState = {
    announcements: [],
    loading: false,
    error: null,
};

// ---------------- API THUNK ----------------

export const fetchAnnouncements = createAsyncThunk<
    Announcement[],
    number,
    { rejectValue: string }
>(
    "announcement/fetchAnnouncements",
    async (courseId: number, { rejectWithValue }) => {
        try {
            const response = await getAnnouncementsApi(courseId);

            // Handles both axios response and direct array
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (
                response?.data?.data &&
                Array.isArray(response.data.data)
            ) {
                return response.data.data;
            } else if (Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to fetch announcements"
            );
        }
    }
);

export const addCommentOnAnnouncements = createAsyncThunk(
    "announcement/addCommentOnAnnouncements",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await addCommentOnAnnouncementsApi(payload);
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (
                response?.data?.data &&
                Array.isArray(response.data.data)
            ) {
                return response.data.data;
            } else if (Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to fetch announcements"
            );
        }
    }
);

// ---------------- SLICE ----------------

const announcementSlice = createSlice({
    name: "announcement",
    initialState,
    reducers: {
        clearAnnouncementStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
        addLocalComment: (
            state,
            action: PayloadAction<{
                announcementId: number;
                comment: AnnouncementComment;
            }>
        ) => {
            const { announcementId, comment } = action.payload;
            const announcement = state.announcements.find(
                (a) => a.id === announcementId
            );
            if (announcement) {
                announcement.announcement_comments = [
                    ...announcement.announcement_comments,
                    comment,
                ];
            }
        },
        toggleLocalLike: (state, action: PayloadAction<number>) => {
            const announcementId = action.payload;
            const announcement = state.announcements.find(
                (a) => a.id === announcementId
            );
            if (announcement) {
                const liked = !!announcement.likedByMe;
                announcement.likedByMe = !liked;
                announcement.likesCount = (announcement.likesCount || 0) + (liked ? -1 : 1);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchAnnouncements.fulfilled,
                (state, action: PayloadAction<Announcement[]>) => {
                    state.loading = false;
                    state.announcements = action.payload;
                }
            )

            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "An error occurred while fetching announcements";
            });
    },
});

export const { clearAnnouncementStatus, addLocalComment, toggleLocalLike } =
    announcementSlice.actions;

export default announcementSlice.reducer;