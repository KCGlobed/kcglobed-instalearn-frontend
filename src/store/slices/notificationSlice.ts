import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { unreadNotificationApi, markAsReadApi, allNotificationApi } from "../../utils/service";

export interface Notification {
    id: number;
    title: string;
    description: string;
    status: boolean;
    created_at: string;
    user: number;
    course: number | null;
}

export interface NotificationState {
    unreadCount: number;
    notifications: Notification[];
    allNotifications: Notification[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: NotificationState = {
    unreadCount: 0,
    notifications: [],
    allNotifications: [],
    loading: false,
    error: null,
    success: false,
};

export const fetchUnreadNotifications = createAsyncThunk<any, void, { rejectValue: string }>(
    "notification/fetchUnread",
    async (_, { rejectWithValue }) => {
        try {
            const response = await unreadNotificationApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch unread notifications");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk<any, { notification_id: number[] }, { rejectValue: string }>(
    "notification/markAsRead",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await markAsReadApi(payload);
            return { response, notification_ids: payload.notification_id };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to mark notification as read");
        }
    }
);

export const fetchAllNotifications = createAsyncThunk<any, void, { rejectValue: string }>(
    "notification/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await allNotificationApi();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch all notifications");
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotificationStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Unread
            .addCase(fetchUnreadNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (action.payload?.data) {
                    state.notifications = action.payload.data.notifications;
                    state.unreadCount = action.payload.data.count;
                }
            })
            .addCase(fetchUnreadNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An error occurred";
            })
            // Mark as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const readIds = action.payload.notification_ids;
                // Update status in local arrays
                state.notifications = state.notifications.filter(n => !readIds.includes(n.id));
                state.unreadCount = Math.max(0, state.unreadCount - readIds.length);
                
                state.allNotifications = state.allNotifications.map(n => 
                    readIds.includes(n.id) ? { ...n, status: true } : n
                );
            })
            // Fetch All
            .addCase(fetchAllNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (action.payload?.data) {
                    state.allNotifications = action.payload.data.notifications;
                    // Also update unread count based on status if we have all notifications
                    const unread = action.payload.data.notifications.filter((n: any) => !n.status);
                    state.unreadCount = unread.length;
                    state.notifications = unread.slice(0, 10); // Keep top 10 as recent unread
                }
            })
            .addCase(fetchAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An error occurred";
            });
    },
});

export const { clearNotificationStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
