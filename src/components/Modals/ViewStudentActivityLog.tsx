import React, { useEffect, useState } from "react";
import { ClipboardList, AlertCircle, FileText, Loader2, Calendar } from "lucide-react";
import { useModal } from "./ModalContext";
import { getCorporateStudentsActivityLogApi } from "../../utils/service";

interface ViewStudentActivityLogProps {
    userId: number | string;
    userName: string;
    member?: any;
}

const ViewStudentActivityLog = ({ userId, userName, member }: ViewStudentActivityLogProps) => {
    const { hideModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityList, setActivityList] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getCorporateStudentsActivityLogApi(userId, page);
                if (res?.pagination) {
                    setPagination(res.pagination);
                }
                
                let logsArray: any[] = [];
                if (Array.isArray(res)) {
                    logsArray = res;
                } else if (res && typeof res === 'object') {
                    if (Array.isArray(res.data)) logsArray = res.data;
                    else if (Array.isArray(res.activity)) logsArray = res.activity;
                    else if (Array.isArray(res.logs)) logsArray = res.logs;
                    else if (Array.isArray(res.activity_log)) logsArray = res.activity_log;
                    else if (Array.isArray(res.list)) logsArray = res.list;
                    else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                        const possibleArray = Object.values(res.data).find(val => Array.isArray(val));
                        if (possibleArray) logsArray = possibleArray as any[];
                        else logsArray = [res.data];
                    } else if (res.success === false) {
                        setError(res.message || "Failed to fetch activity log");
                        setLoading(false);
                        return;
                    } else if (res.success && !res.data) {
                        logsArray = [];
                    }
                }
                setActivityList(logsArray);
            } catch (err: any) {
                console.error("Error fetching activity log:", err);
                setError(err?.message || "An error occurred while fetching activity log");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchActivity();
        }
    }, [userId, page]);

    const formatDate = (val: any) => {
        if (!val || val === '-' || val === 'N/A') return '-';
        try {
            let d = new Date(val);
            if (isNaN(d.getTime()) && typeof val === 'string') {
                d = new Date(val.replace(' ', 'T'));
            }
            if (isNaN(d.getTime())) return String(val);
            return d.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return String(val);
        }
    };

    return (
        <div className="relative pt-4 w-full max-w-4xl mx-auto bg-white rounded-xl">
            {/* Top glowing line */}
            <div className="absolute -top-6 -left-6 -right-6 h-1.5 bg-gradient-to-r from-emerald-500 via-[#50C878] to-[#2E8B57] rounded-t-xl" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-150 pb-4">
                <div className="flex items-center gap-3">
                    <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                        <ClipboardList className="w-5 h-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-[#2F2B3D] tracking-tight">Student Activity Log</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Showing detailed activity history for <span className="font-semibold text-[#2F2B3D]">{userName || member?.name || 'Student'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="min-h-[250px] max-h-[500px] overflow-y-auto mb-6">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                        <p className="text-xs font-semibold text-gray-500">Loading activity logs...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 flex flex-col items-center justify-center text-rose-500 bg-rose-50/50 rounded-xl border border-rose-100 p-6">
                        <AlertCircle className="w-8 h-8 mb-3 text-rose-500" />
                        <p className="text-sm font-bold text-rose-700 mb-1">Failed to load activity log</p>
                        <p className="text-xs text-rose-600 text-center">{error}</p>
                    </div>
                ) : activityList.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-gray-150 p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-[#2F2B3D] mb-1">No Activity Found</h4>
                        <p className="text-xs text-gray-500 max-w-sm">
                            There are no recorded activities available for this student yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F8F7FA]">
                                <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Date & Time</th>
                                    <th className="py-3 px-4">Activity Title</th>
                                    <th className="py-3 px-4">Description / Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-150">
                                {activityList.map((item, index) => {
                                    const activityTime = item.created_at || item.timestamp || item.date || item.activity_time || item.activity_date || item.date_time || item.datetime;
                                    const title = item.action || item.title || item.activity || item.name || item.event || 'Activity';
                                    const description = item.metadata || item.description || item.detail || item.details || item.message || item.summary || '-';
                                    const timeAgo = item.time_ago || null;

                                    return (
                                        <tr key={item.id || index} className="hover:bg-gray-50/70 transition-colors text-xs">
                                            <td className="py-3.5 px-4 font-medium text-[#2F2B3D] whitespace-nowrap align-top">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span className="font-semibold text-gray-800">{formatDate(activityTime)}</span>
                                                    </div>
                                                    {timeAgo && (
                                                        <span className="text-[10px] text-gray-500 ml-5">{timeAgo}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-800 font-semibold align-top capitalize">
                                                {String(title).replace(/_/g, ' ')}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600 align-top">
                                                {String(description)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination Controls */}
                {pagination && pagination.total_pages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-4 mt-2">
                        <div className="flex flex-1 justify-between w-full sm:hidden">
                            <button
                                onClick={() => setPage(pagination.previous_page)}
                                disabled={!pagination.previous_page}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(pagination.next_page)}
                                disabled={!pagination.next_page}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Showing page <span className="font-semibold text-gray-700">{pagination.current_page}</span> of{' '}
                                    <span className="font-semibold text-gray-700">{pagination.total_pages}</span> ({pagination.total_results} total results)
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(pagination.previous_page)}
                                        disabled={!pagination.previous_page}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>
                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            aria-current={p === pagination.current_page ? 'page' : undefined}
                                            className={`relative inline-flex items-center px-3 py-2 text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${p === pagination.current_page
                                                ? 'z-10 bg-emerald-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'
                                                : 'text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(pagination.next_page)}
                                        disabled={!pagination.next_page}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="sr-only">Next</span>
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-150">
                <button
                    type="button"
                    onClick={hideModal}
                    className="h-9 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewStudentActivityLog;
