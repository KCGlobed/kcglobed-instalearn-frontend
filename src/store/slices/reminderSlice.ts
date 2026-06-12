import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { 
    createReminderApi, 
    deleteReminderApi, 
    getReminderApi, 
    updateReminderApi 
} from "../../utils/service";

// ---------------- TYPES ----------------

export interface CourseReminder {
    id: number;
    name: string;
    short_description: string;
    image: string | null;
    price: number;
    discount: number;
    objectives_summary: string[];
    total_video_duration: number;
    avg_rating: number;
    total_reviews: number;
    updated_at: string;
}

export interface Reminder {
    id: number;
    course: CourseReminder;
    title: string;
    frequency: number | string;
    time: string; // "13:00:00"
    date: string; // "2026-11-25"
    days: string;
    created_at: string;
    updated_at: string;
    user: number;
}

export interface RemindersState {
    reminders: Reminder[];
    loading: boolean;
    error: string | null;
}

const initialState: RemindersState = {
    reminders: [],
    loading: false,
    error: null,
};

// ---------------- API THUNKS ----------------

export const fetchReminders = createAsyncThunk<
    Reminder[],
    void,
    { rejectValue: string }
>(
    "reminders/fetchReminders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getReminderApi();
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
                error?.message || "Failed to fetch reminders"
            );
        }
    }
);

export const createReminder = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>(
    "reminders/createReminder",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await createReminderApi(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to create reminder"
            );
        }
    }
);

export const updateReminder = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>(
    "reminders/updateReminder",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await updateReminderApi(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to update reminder"
            );
        }
    }
);

export const deleteReminder = createAsyncThunk<
    any,
    number,
    { rejectValue: string }
>(
    "reminders/deleteReminder",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await deleteReminderApi(id);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to delete reminder"
            );
        }
    }
);

// ---------------- SLICE ----------------

const reminderSlice = createSlice({
    name: "reminders",
    initialState,
    reducers: {
        clearRemindersStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reminders
            .addCase(fetchReminders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReminders.fulfilled, (state, action: PayloadAction<Reminder[]>) => {
                state.loading = false;
                state.reminders = action.payload;
            })
            .addCase(fetchReminders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load reminders";
            })

            // Create Reminder
            .addCase(createReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReminder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const newReminder = action.payload?.data || action.payload;
                if (newReminder && newReminder.id) {
                    if (!state.reminders.some(r => r.id === newReminder.id)) {
                        state.reminders = [newReminder, ...state.reminders];
                    }
                }
            })
            .addCase(createReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create reminder";
            })

            // Update Reminder
            .addCase(updateReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReminder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updated = action.payload?.data || action.payload;
                if (updated && updated.id) {
                    state.reminders = state.reminders.map(r => r.id === updated.id ? updated : r);
                }
            })
            .addCase(updateReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update reminder";
            })

            // Delete Reminder
            .addCase(deleteReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReminder.fulfilled, (state, action: any) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.reminders = state.reminders.filter(r => r.id !== deletedId);
            })
            .addCase(deleteReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete reminder";
            });
    },
});

export const { clearRemindersStatus } = reminderSlice.actions;

export default reminderSlice.reducer;
