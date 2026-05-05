import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';

import { fetchAllNotifications, markNotificationAsRead } from '../../store/slices/notificationSlice';
import { Bell, CheckCircle, Trash2, Clock, Inbox } from 'lucide-react';
import MainHeader from '../../layouts/MainHeader';
import type { RootState } from '../../store/store';

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationPage = () => {
    const dispatch = useAppDispatch();
    const { allNotifications, loading, unreadCount } = useAppSelector((state: RootState) => state.notification);

    useEffect(() => {
        dispatch(fetchAllNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (id: number) => {
        dispatch(markNotificationAsRead({ notification_id: [id] }));
    };

    const handleMarkAllAsRead = () => {
        const unreadIds = allNotifications.filter(n => !n.status).map(n => n.id);
        if (unreadIds.length > 0) {
            dispatch(markNotificationAsRead({ notification_id: unreadIds }));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            <MainHeader />

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1D2026] tracking-tight">Notifications</h1>
                        <p className="text-[#6E7485] mt-1.5 font-medium">
                            You have <span className="text-[#5624D0] font-bold">{unreadCount}</span> unread notifications
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9EAF0] text-[#1D2026] font-bold text-[14px] rounded-lg hover:bg-[#F5F4FF] hover:text-[#5624D0] hover:border-[#5624D0] transition-all shadow-sm"
                        >
                            <CheckCircle className="w-4.5 h-4.5" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-[#E9EAF0] overflow-hidden">
                    {loading && allNotifications.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5624D0] mx-auto mb-4"></div>
                            <p className="text-[#6E7485] font-medium">Loading your notifications...</p>
                        </div>
                    ) : allNotifications.length > 0 ? (
                        <div className="divide-y divide-[#F3F4F6]">
                            {allNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-5 md:p-6 transition-all hover:bg-[#F5F4FF]/30 group ${!notification.status ? 'bg-[#F5F4FF]/10' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${!notification.status ? 'bg-[#5624D0]/10 text-[#5624D0]' : 'bg-[#F3F4F6] text-[#8C94A3]'}`}>
                                            <Bell className={`w-5.5 h-5.5 ${!notification.status ? 'fill-[#5624D0]/10' : ''}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`text-[16px] font-bold leading-tight ${!notification.status ? 'text-[#1D2026]' : 'text-[#4E5566]'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-[14.5px] text-[#4E5566] mt-1.5 leading-relaxed">
                                                        {notification.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <span className="text-[12px] font-medium text-[#8C94A3] flex items-center gap-1.5 whitespace-nowrap">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatTimeAgo(notification.created_at)}
                                                    </span>

                                                    {!notification.status && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[12px] font-bold text-[#5624D0] hover:underline whitespace-nowrap"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 px-6 text-center">
                            <div className="w-20 h-20 bg-[#F5F4FF] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox className="w-10 h-10 text-[#8C94A3]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#1D2026]">All caught up!</h2>
                            <p className="text-[#6E7485] mt-2 max-w-xs mx-auto font-medium">
                                You don't have any notifications at the moment. We'll let you know when something important happens.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationPage;