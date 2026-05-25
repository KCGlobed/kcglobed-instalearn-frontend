import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createNoteApi, deleteNoteApi, getAllNotesApi, updateNoteApi } from "../../utils/service";

// ---------------- TYPES ----------------

export interface VideoInfo {
    id: number;
    name: string;
    transcoded_video: string;
    video_caption: string;
    video_duration: number;
}

export interface LectureInfo {
    id: number;
    video_info: VideoInfo;
    ebook_info: Record<string, any>;
    lecture_type: number;
    order: number;
    created_at: string;
    chapter: number;
    video: number;
    ebook: number | null;
}

export interface Note {
    id: number;
    lecture_info: LectureInfo;
    note_type: string;
    note_content: string;
    duration: string;
    created_at: string;
    user: number;
    course: number;
    chapter_lecture: number;
}

export interface NotesState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}

const initialState: NotesState = {
    notes: [],
    loading: false,
    error: null,
};

// ---------------- API THUNK ----------------

export const fetchNotes = createAsyncThunk<
    Note[],
    number,
    { rejectValue: string }
>(
    "notes/fetchNotes",
    async (courseId: number, { rejectWithValue }) => {
        try {
            const response = await getAllNotesApi(courseId);
            // Handle API response
            if (response?.data?.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            }
            if (Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to fetch notes"
            );
        }
    }
);

export const createNote = createAsyncThunk(
    "notes/createNote",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await createNoteApi(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to create note"
            );
        }
    }
);

export const updateNote = createAsyncThunk(
    "notes/updateNote",
    async (payload: { courseId: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await updateNoteApi(payload.courseId, payload.data);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to update note"
            );
        }
    }
);

export const deleteNote = createAsyncThunk(
    "notes/deleteNote",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await deleteNoteApi(id);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to delete note"
            );
        }
    }
);

// ---------------- SLICE ----------------

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        clearNotesStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchNotes.fulfilled,
                (state, action: PayloadAction<Note[]>) => {
                    state.loading = false;
                    state.notes = action.payload;
                }
            )

            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || "Something went wrong";
            })

            .addCase(createNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                createNote.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    if (Array.isArray(action.payload)) {
                        state.notes = action.payload;
                    } else if (action.payload && typeof action.payload === "object") {
                        const note = action.payload.data || action.payload;
                        if (note && note.id) {
                            if (!state.notes.some(n => n.id === note.id)) {
                                state.notes = [note, ...state.notes];
                            }
                        }
                    }
                }
            )
            .addCase(createNote.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || "Something went wrong";
            })
            .addCase(updateNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNote.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedNote = action.payload?.data || action.payload;
                if (updatedNote && updatedNote.id) {
                    state.notes = state.notes.map(n => n.id === updatedNote.id ? updatedNote : n);
                }
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update note";
            })
            .addCase(deleteNote.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteNote.fulfilled, (state, action: any) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.notes = state.notes.filter(n => n.id !== deletedId);
            })
            .addCase(deleteNote.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete note";
            });
    },
});

export const { clearNotesStatus } = notesSlice.actions;

export default notesSlice.reducer;