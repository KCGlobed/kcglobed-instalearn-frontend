import React, { useEffect, useState } from "react";
import { Activity, AlertCircle, Clock, Shield, Monitor, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { useModal } from "./ModalContext";
import { getStudentLoginActivityApi } from "../../utils/service";

interface ViewStudentLoginActivityProps {
    userId: number | string;
    userName: string;
    member?: any;
}

const ViewStudentLoginActivity = ({ userId, userName, member }: ViewStudentLoginActivityProps) => {
    const { hideModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityList, setActivityList] = useState<any[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getStudentLoginActivityApi(userId);
                let logsArray: any[] = [];
                if (Array.isArray(res)) {
                    logsArray = res;
                } else if (res && typeof res === 'object') {
                    if (Array.isArray(res.data)) logsArray = res.data;
                    else if (Array.isArray(res.activity)) logsArray = res.activity;
                    else if (Array.isArray(res.logs)) logsArray = res.logs;
                    else if (Array.isArray(res.login_activity)) logsArray = res.login_activity;
                    else if (Array.isArray(res.list)) logsArray = res.list;
                    else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                        const possibleArray = Object.values(res.data).find(val => Array.isArray(val));
                        if (possibleArray) logsArray = possibleArray as any[];
                        else logsArray = [res.data];
                    } else if (res.success === false) {
                        setError(res.message || "Failed to fetch login activity");
                        setLoading(false);
                        return;
                    } else if (res.success && !res.data) {
                        logsArray = [];
                    }
                }
                setActivityList(logsArray);
            } catch (err: any) {
                console.error("Error fetching login activity:", err);
                setError(err?.message || "An error occurred while fetching login activity");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchActivity();
        }
    }, [userId]);

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
            <div className="absolute -top-6 -left-6 -right-6 h-1.5 bg-gradient-to-r from-indigo-500 via-[#A8A1F8] to-[#8F85F3] rounded-t-xl" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-150 pb-4">
                <div className="flex items-center gap-3">
                    <span className="p-2 bg-perple/10 rounded-xl text-perple">
                        <Activity className="w-5 h-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-[#2F2B3D] tracking-tight">Student Login Activity</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Showing session history and login logs for <span className="font-semibold text-[#2F2B3D]">{userName || member?.name || 'Student'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="min-h-[250px] max-h-[500px] overflow-y-auto mb-6">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-perple animate-spin mb-3" />
                        <p className="text-xs font-semibold text-gray-500">Loading activity logs...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 flex flex-col items-center justify-center text-rose-500 bg-rose-50/50 rounded-xl border border-rose-100 p-6">
                        <AlertCircle className="w-8 h-8 mb-3 text-rose-500" />
                        <p className="text-sm font-bold text-rose-700 mb-1">Failed to load login activity</p>
                        <p className="text-xs text-rose-600 text-center">{error}</p>
                    </div>
                ) : activityList.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-gray-150 p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-[#2F2B3D] mb-1">No Login Activity Found</h4>
                        <p className="text-xs text-gray-500 max-w-sm">
                            There are no recorded login sessions or history available for this student yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F8F7FA]">
                                <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Date & Time</th>
                                    <th className="py-3 px-4">Login IP</th>
                                    <th className="py-3 px-4">Country</th>
                                    <th className="py-3 px-4">Device Info</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-150">
                                {activityList.map((item, index) => {
                                    const loginTime = item.created_at || item.login_time || item.timestamp || item.date || item.login_at || item.time || item.login_date || item.date_time || item.datetime;
                                    const ipAddress = item.login_IP || item.ip_address || item.ip || item.client_ip || item.ipAddress || '-';
                                    const country = item.country || item.location || item.city || (item.city && item.country ? `${item.city}, ${item.country}` : null) || '-';
                                    const deviceType = item.device_type || item.device || item.browser || item.os || item.user_agent || item.platform || item.deviceInfo || 'Desktop';
                                    const deviceId = item.device_id || item.deviceId || null;

                                    return (
                                        <tr key={item.id || index} className="hover:bg-gray-50/70 transition-colors text-xs">
                                            <td className="py-3.5 px-4 font-medium text-[#2F2B3D] whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span className="font-semibold text-gray-800">{formatDate(loginTime)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600">
                                                <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-800 font-semibold">
                                                    <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                    <span className="break-all" title={String(ipAddress)}>{String(ipAddress)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${country === '-' ? 'text-gray-400' : 'text-rose-500'}`} />
                                                    <span>{String(country)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 text-gray-800 font-semibold capitalize">
                                                        <Monitor className="w-3.5 h-3.5 text-perple shrink-0" />
                                                        <span>{String(deviceType)}</span>
                                                    </div>
                                                    {deviceId && (
                                                        <div className="font-mono text-[10px] text-gray-400 truncate max-w-[160px]" title={`Device ID: ${deviceId}`}>
                                                            ID: {String(deviceId)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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

export default ViewStudentLoginActivity;
