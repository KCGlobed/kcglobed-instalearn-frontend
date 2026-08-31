import { useEffect, useState } from "react";
import { viewCorporateUserDetailApi, viewStudentVideoReportApi, getStudentNotesListingApi, getAttemptedQuizListApi, downloadStudentVideoReportApi, downloadStudentVideoReportExcelApi, downloadStudentNotesReportPdfApi, downloadStudentNotesReportExcelApi, getStudentReminderListingApi, downloadStudentReminderReportPdfApi, downloadStudentReminderReportExcelApi } from "../../utils/service";
import { Mail, Phone, Calendar, Clock, BookOpen, Award, AlertCircle, BarChart2, ArrowLeft, FileText, HelpCircle, Download, Bell } from "lucide-react";
import toast from "react-hot-toast";

interface CourseDetail {
    id: number;
    name: string;
}

interface UserCourse {
    id: number;
    course_detail: CourseDetail;
    courses_progress: number;
    is_started: boolean;
    certificate: string | null;
}

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone1: string | null;
    is_active: boolean;
    date_joined: string;
    last_login: string;
    image: string | null;
    courses: UserCourse[];
}

const VeiwTeamMemberDetail = ({ member }: { member: any }) => {
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCourseReport, setSelectedCourseReport] = useState<number | null>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadingCourseId, setDownloadingCourseId] = useState<number | null>(null);
    const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'excel' | null>(null);
    const [downloadReportType, setDownloadReportType] = useState<'video' | 'notes' | 'reminder' | null>(null);

    const [selectedCourseReminder, setSelectedCourseReminder] = useState<number | null>(null);
    const [reminderData, setReminderData] = useState<any[]>([]);
    const [reminderLoading, setReminderLoading] = useState(false);
    const [reminderError, setReminderError] = useState<string | null>(null);

    const handleViewReminder = async (courseId: number) => {
        setSelectedCourseReminder(courseId);
        setReminderLoading(true);
        setReminderError(null);
        try {
            const res = await getStudentReminderListingApi(member.id, courseId);
            if (res?.success) {
                setReminderData(res.data || []);
            } else {
                setReminderError(res?.message || 'Failed to fetch reminders');
            }
        } catch (err) {
            setReminderError('An error occurred while fetching reminders');
        } finally {
            setReminderLoading(false);
        }
    };

    const [selectedCourseNotes, setSelectedCourseNotes] = useState<number | null>(null);
    const [notesData, setNotesData] = useState<any[]>([]);
    const [notesLoading, setNotesLoading] = useState(false);
    const [notesError, setNotesError] = useState<string | null>(null);

    const handleViewNotes = async (courseId: number) => {
        setSelectedCourseNotes(courseId);
        setNotesLoading(true);
        setNotesError(null);
        try {
            const res = await getStudentNotesListingApi(member.id, courseId);
            if (res?.success) {
                setNotesData(res.data);
            } else {
                setNotesError(res?.message || 'Failed to fetch notes');
            }
        } catch (err) {
            setNotesError('An error occurred while fetching notes');
        } finally {
            setNotesLoading(false);
        }
    };

    const [selectedCourseQuiz, setSelectedCourseQuiz] = useState<number | null>(null);
    const [quizData, setQuizData] = useState<any[]>([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState<string | null>(null);

    const handleViewQuiz = async (courseId: number) => {
        setSelectedCourseQuiz(courseId);
        setQuizLoading(true);
        setQuizError(null);
        try {
            const res = await getAttemptedQuizListApi(member.id, courseId);
            if (res?.success) {
                setQuizData(res.data);
            } else {
                setQuizError(res?.message || 'Failed to fetch quiz report');
            }
        } catch (err) {
            setQuizError('An error occurred while fetching quiz report');
        } finally {
            setQuizLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const handleViewReport = async (courseId: number) => {
        setSelectedCourseReport(courseId);
        setReportLoading(true);
        setReportError(null);
        try {
            const res = await viewStudentVideoReportApi(member.id, courseId);
            if (res?.success) {
                setReportData(res.data);
            } else {
                setReportError(res?.message || 'Failed to fetch video report');
            }
        } catch (err) {
            setReportError('An error occurred while fetching video report');
        } finally {
            setReportLoading(false);
        }
    };

    const getGcsDownloadUrl = (url: string) => {
        if (url && typeof url === 'string' && url.includes("storage.googleapis.com")) {
            try {
                const parts = url.split("storage.googleapis.com/");
                if (parts.length > 1) {
                    const subParts = parts[1].split("/");
                    const bucket = subParts[0];
                    const objectPath = subParts.slice(1).join("/");
                    return `https://storage.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`;
                }
            } catch (e) {
                console.error("Error formatting GCS download URL", e);
            }
        }
        return url;
    };

    const handleDownloadReport = async (courseId: number, format: 'pdf' | 'excel' = 'pdf', reportType: 'video' | 'notes' | 'reminder' = 'video') => {
        setDownloadLoading(true);
        setDownloadingCourseId(courseId);
        setDownloadFormat(format);
        setDownloadReportType(reportType);
        const loadToast = toast.loading(`Downloading ${reportType === 'notes' ? 'Notes' : reportType === 'reminder' ? 'Reminder' : 'Video'} ${format === 'excel' ? 'Excel' : 'PDF'} report...`);
        let fallbackUrl: string | null = null;
        try {
            let res: any;
            if (reportType === 'notes') {
                res = format === 'excel'
                    ? await downloadStudentNotesReportExcelApi(member.id, courseId)
                    : await downloadStudentNotesReportPdfApi(member.id, courseId);
            } else if (reportType === 'reminder') {
                res = format === 'excel'
                    ? await downloadStudentReminderReportExcelApi(member.id, courseId)
                    : await downloadStudentReminderReportPdfApi(member.id, courseId);
            } else {
                res = format === 'excel'
                    ? await downloadStudentVideoReportExcelApi(member.id, courseId)
                    : await downloadStudentVideoReportApi(member.id, courseId);
            }

            let blob: Blob;
            if (res instanceof Response) {
                if (!res.ok) {
                    throw new Error("Failed to download report");
                }
                blob = await res.blob();
            } else if (res instanceof Blob) {
                blob = res;
            } else if (res && typeof res === 'object') {
                if (res.success === false) {
                    throw new Error(res.message || "Failed to download report");
                }
                const fileUrl = res.report_url || res.data?.report_url || res.data?.url || res.data?.file ||
                    (typeof res.data === 'string' ? res.data : null) ||
                    (typeof res.url === 'string' ? res.url : null) ||
                    (typeof res.file === 'string' ? res.file : null);

                if (typeof fileUrl === 'string') {
                    fallbackUrl = fileUrl;
                    const apiDownloadUrl = getGcsDownloadUrl(fileUrl);
                    try {
                        const fileResponse = await fetch(apiDownloadUrl);
                        if (!fileResponse.ok) {
                            throw new Error("Failed to fetch file from server");
                        }
                        blob = await fileResponse.blob();
                    } catch (fetchErr) {
                        console.warn("Direct blob fetch failed, falling back to new tab:", fetchErr);
                        window.open(fallbackUrl, "_blank");
                        toast.success("Opening report in new tab...", { id: loadToast });
                        setDownloadLoading(false);
                        setDownloadingCourseId(null);
                        setDownloadFormat(null);
                        setDownloadReportType(null);
                        return;
                    }
                } else if (res.data instanceof Blob) {
                    blob = res.data;
                } else if (res.file instanceof Blob) {
                    blob = res.file;
                } else {
                    throw new Error("Invalid file format received from API");
                }
            } else if (res && typeof res.blob === 'function') {
                blob = await res.blob();
            } else {
                throw new Error(res?.message || `Could not download report ${format === 'excel' ? 'Excel' : 'PDF'}`);
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            const courseName = data?.courses?.find(c => c.course_detail.id === courseId)?.course_detail?.name || `course_${courseId}`;
            let ext = format === 'excel' ? 'csv' : 'pdf';
            if (fallbackUrl && typeof fallbackUrl === 'string') {
                const cleanUrl = fallbackUrl.split("?")[0];
                if (cleanUrl.endsWith(".xlsx")) ext = "xlsx";
                else if (cleanUrl.endsWith(".xls")) ext = "xls";
                else if (cleanUrl.endsWith(".csv")) ext = "csv";
                else if (cleanUrl.endsWith(".pdf")) ext = "pdf";
            }
            const prefix = reportType === 'notes' ? 'Student_Notes_Report' : reportType === 'reminder' ? 'Student_Reminder_Report' : 'Student_Video_Report';
            link.download = `${prefix}_${member.first_name || 'User'}_${courseName.replace(/\s+/g, "_")}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("Report downloaded successfully!", { id: loadToast });
        } catch (err: any) {
            console.error("Download Error:", err);
            if (fallbackUrl) {
                window.open(fallbackUrl, "_blank");
                toast.success("Opening report in new tab...", { id: loadToast });
            } else {
                toast.error(err?.message || "Failed to download report", { id: loadToast });
            }
        } finally {
            setDownloadLoading(false);
            setDownloadingCourseId(null);
            setDownloadFormat(null);
            setDownloadReportType(null);
        }
    };

    const handleViewUserDetail = async () => {
        try {
            setLoading(true);
            const res = await viewCorporateUserDetailApi(member.id);
            if (res?.success) {
                setData(res.data);
            } else {
                setError(res?.message || 'Failed to load user details');
            }
        } catch (err) {
            setError('An error occurred while fetching details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleViewUserDetail();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perple mb-4"></div>
                <p className="text-sm text-gray-500">Loading member details...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 mt-4 text-rose-500">
                <AlertCircle className="w-8 h-8 mb-4" />
                <p className="text-sm font-semibold">{error || 'Failed to load data'}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full pt-12">
            {/* Clean Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white pb-6 border-b border-gray-150">
                {/* Avatar */}
                <div className="shrink-0">
                    {data.image ? (
                        <img src={data.image} alt={data.first_name} className="w-16 h-16 rounded-full object-cover border border-gray-100 shadow-sm" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-perple/10 text-perple border border-perple/20 shadow-sm flex items-center justify-center text-xl font-bold">
                            {data.first_name?.charAt(0) || ''}{(data.last_name && data.last_name !== 'null') ? data.last_name.charAt(0) : ''}
                        </div>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-[#2F2B3D]">
                            {data.first_name} {(data.last_name && data.last_name !== 'null') ? data.last_name : ''}
                        </h2>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {data.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {data.email}
                        </div>
                        {data.phone1 && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {data.phone1}
                            </div>
                        )}
                    </div>
                </div>

                {/* Meta Dates */}
                <div className="flex flex-col gap-2 sm:text-right text-sm text-gray-500 sm:ml-auto w-full sm:w-auto">
                    <div className="flex items-center sm:justify-end gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400 sm:hidden" />
                        <span className="font-semibold text-gray-700">Joined:</span>
                        {data.date_joined ? new Date(data.date_joined).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400 sm:hidden" />
                        <span className="font-semibold text-gray-700">Last Login:</span>
                        {data.last_login ? new Date(data.last_login).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Never'}
                    </div>
                </div>
            </div>

            {/* Simple Courses Section */}
            <div className="mt-6 border border-gray-150 rounded-xl overflow-hidden bg-white shadow-sm">
                {selectedCourseReminder ? (
                    <>
                        <div className="bg-white px-5 py-4 border-b border-gray-150 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedCourseReminder(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-perple" />
                                    <h3 className="text-sm font-bold text-[#2F2B3D]">Reminder Report</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseReminder, 'pdf', 'reminder')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseReminder && downloadReportType === 'reminder'}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-perple text-white rounded-lg text-xs font-semibold hover:bg-perple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseReminder && downloadFormat === 'pdf' && downloadReportType === 'reminder' ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseReminder!, 'excel', 'reminder')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseReminder && downloadReportType === 'reminder'}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseReminder && downloadFormat === 'excel' && downloadReportType === 'reminder' ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download Excel</span>
                                </button>

                            </div>
                        </div>
                        {reminderLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perple mb-4"></div>
                                <p className="text-sm text-gray-500">Loading reminders...</p>
                            </div>
                        ) : reminderError ? (
                            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
                                <AlertCircle className="w-8 h-8 mb-4" />
                                <p className="text-sm font-semibold">{reminderError}</p>
                            </div>
                        ) : reminderData && reminderData.length > 0 ? (
                            <div className="p-5 max-h-[400px] overflow-y-auto space-y-3">
                                {reminderData.map((reminder: any) => (
                                    <div key={reminder.id} className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 hover:border-gray-200 transition-colors">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold text-[#2F2B3D] mb-0.5">
                                                    {reminder.title || reminder.reminder_title || 'Reminder'}
                                                </h4>
                                                {(reminder.description || reminder.note) && (
                                                    <p className="text-[11px] text-gray-500 mt-0.5">{reminder.description || reminder.note}</p>
                                                )}
                                                {reminder.course_detail?.name && (
                                                    <span className="inline-block mt-1 text-[10px] bg-perple/10 text-perple font-semibold px-2 py-0.5 rounded">
                                                        {reminder.course_detail.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                {reminder.remind_at || reminder.reminder_date || reminder.created_at ? (
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(reminder.remind_at || reminder.reminder_date || reminder.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </span>
                                                ) : null}
                                                {reminder.is_completed !== undefined && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${reminder.is_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {reminder.is_completed ? 'Completed' : 'Pending'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">No reminders found</p>
                                <p className="text-[11px] text-gray-400">The student has not set any reminders.</p>
                            </div>
                        )}
                    </>
                ) : selectedCourseQuiz ? (
                    <>
                        <div className="bg-white px-5 py-4 border-b border-gray-150 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedCourseQuiz(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-perple" />
                                    <h3 className="text-sm font-bold text-[#2F2B3D]">Quiz Report</h3>
                                </div>
                            </div>
                        </div>
                        {quizLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perple mb-4"></div>
                                <p className="text-sm text-gray-500">Loading quiz data...</p>
                            </div>
                        ) : quizError ? (
                            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
                                <AlertCircle className="w-8 h-8 mb-4" />
                                <p className="text-sm font-semibold">{quizError}</p>
                            </div>
                        ) : quizData && quizData.length > 0 ? (
                            <div className="p-5">
                                {/* Analytics Summary */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Total Attempts</div>
                                        <div className="text-2xl font-black text-blue-900">{quizData.length}</div>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Highest Score</div>
                                        <div className="text-2xl font-black text-emerald-900">
                                            {Math.max(...quizData.map(q => q.score || 0))}%
                                        </div>
                                    </div>
                                    <div className="bg-perple/5 p-4 rounded-xl border border-perple/10 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="text-[10px] text-perple font-bold uppercase tracking-wider mb-1">Passed</div>
                                        <div className="text-2xl font-black text-perple">
                                            {quizData.filter(q => q.result?.toLowerCase() === 'pass').length}
                                        </div>
                                    </div>
                                </div>

                                {/* List of Attempts */}
                                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                                    {quizData.map((quiz: any, idx: number) => (
                                        <div key={quiz.id} className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 hover:border-gray-200 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">Attempt {quizData.length - idx}</span>
                                                        <h4 className="text-xs font-bold text-[#2F2B3D]">
                                                            {quiz.quiz?.name || 'Unknown Quiz'}
                                                        </h4>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(quiz.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${quiz.result?.toLowerCase() === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {quiz.result || 'Unknown'}
                                                </span>
                                            </div>

                                            {/* Graph Data / Stats */}
                                            <div className="mt-4 flex flex-col gap-2">
                                                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                                    <span>Score: {quiz.total_right_answer_given} / {quiz.total_question} ({quiz.score}%)</span>
                                                    <span>Passing Score: {quiz.quiz?.pass_percentage}%</span>
                                                </div>
                                                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                                                    {quiz.total_question > 0 ? (
                                                        <>
                                                            <div
                                                                className="bg-emerald-500 h-full"
                                                                style={{ width: `${(quiz.total_right_answer_given / quiz.total_question) * 100}%` }}
                                                                title={`Right: ${quiz.total_right_answer_given}`}
                                                            />
                                                            <div
                                                                className="bg-rose-500 h-full"
                                                                style={{ width: `${(quiz.total_wrong_answer_given / quiz.total_question) * 100}%` }}
                                                                title={`Wrong: ${quiz.total_wrong_answer_given}`}
                                                            />
                                                        </>
                                                    ) : null}
                                                </div>
                                                <div className="flex justify-between text-[9px] text-gray-400 font-semibold mt-0.5">
                                                    <span className="text-emerald-600">{quiz.total_right_answer_given} Correct</span>
                                                    <span className="text-rose-500">{quiz.total_wrong_answer_given} Incorrect</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">No quiz attempts found</p>
                                <p className="text-[11px] text-gray-400">The student has not attempted any quizzes for this course.</p>
                            </div>
                        )}
                    </>
                ) : selectedCourseNotes ? (
                    <>
                        <div className="bg-white px-5 py-4 border-b border-gray-150 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedCourseNotes(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-perple" />
                                    <h3 className="text-sm font-bold text-[#2F2B3D]">Student Notes</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseNotes!, 'pdf', 'notes')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseNotes}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-perple text-white rounded-lg text-xs font-semibold hover:bg-perple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseNotes && downloadFormat === 'pdf' && downloadReportType === 'notes' ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseNotes!, 'excel', 'notes')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseNotes}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseNotes && downloadFormat === 'excel' && downloadReportType === 'notes' ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download Excel</span>
                                </button>
                            </div>
                        </div>
                        {notesLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perple mb-4"></div>
                                <p className="text-sm text-gray-500">Loading notes...</p>
                            </div>
                        ) : notesError ? (
                            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
                                <AlertCircle className="w-8 h-8 mb-4" />
                                <p className="text-sm font-semibold">{notesError}</p>
                            </div>
                        ) : notesData && notesData.length > 0 ? (
                            <div className="p-5 max-h-[400px] overflow-y-auto space-y-4">
                                {notesData.map((note) => (
                                    <div key={note.id} className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 hover:border-gray-200 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="text-xs font-bold text-[#2F2B3D]">
                                                    {note.lecture_info?.video_info?.name || note.lecture_info?.ebook_info?.name || 'Unknown Lecture'}
                                                </h4>
                                                <span className="text-[10px] text-gray-500 capitalize">{note.lecture_info?.lecture_type === 2 ? 'PDF' : note.note_type} &bull; {new Date(note.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                            </div>
                                            {note.duration && note.duration !== "0" && (
                                                <span className="bg-perple/10 text-perple text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                    {formatDuration(parseInt(note.duration))}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="text-xs text-gray-700 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: note.note_content }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">No notes found</p>
                                <p className="text-[11px] text-gray-400">The student has not created any notes for this course.</p>
                            </div>
                        )}
                    </>
                ) : selectedCourseReport ? (
                    <>
                        <div className="bg-white px-5 py-4 border-b border-gray-150 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedCourseReport(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-perple" />
                                    <h3 className="text-sm font-bold text-[#2F2B3D]">Video Report</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseReport!, 'pdf', 'video')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseReport}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-perple text-white rounded-lg text-xs font-semibold hover:bg-perple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseReport && downloadFormat === 'pdf' && (!downloadReportType || downloadReportType === 'video') ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => handleDownloadReport(selectedCourseReport!, 'excel', 'video')}
                                    disabled={downloadLoading && downloadingCourseId === selectedCourseReport}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloadLoading && downloadingCourseId === selectedCourseReport && downloadFormat === 'excel' && (!downloadReportType || downloadReportType === 'video') ? (
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>Download Excel</span>
                                </button>
                            </div>
                        </div>
                        {reportLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perple mb-4"></div>
                                <p className="text-sm text-gray-500">Loading report...</p>
                            </div>
                        ) : reportError ? (
                            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
                                <AlertCircle className="w-8 h-8 mb-4" />
                                <p className="text-sm font-semibold">{reportError}</p>
                            </div>
                        ) : reportData ? (
                            <div className="p-5">
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex-1 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Total Videos Watched</div>
                                        <div className="text-2xl font-black text-blue-900">{reportData.total_video_watched}</div>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex-1 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Total Duration Watched</div>
                                        <div className="text-2xl font-black text-emerald-900">{formatDuration(reportData.total_duration_video_watched || 0)}</div>
                                    </div>
                                </div>

                                <div className="overflow-hidden border border-gray-150 rounded-xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#F8F7FA]">
                                            <tr className="border-b border-gray-150 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                <th className="py-3 px-5">Chapter Name</th>
                                                <th className="py-3 px-5 text-center">Videos</th>
                                                <th className="py-3 px-5 text-center">Duration</th>
                                                <th className="py-3 px-5">Progress</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {reportData.report_data && reportData.report_data.length > 0 ? (
                                                reportData.report_data.map((report: any) => (
                                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                                                        <td className="py-3.5 px-5 font-semibold text-[#2F2B3D]">
                                                            {report.chapter_info?.name || 'Unknown Chapter'}
                                                        </td>
                                                        <td className="py-3.5 px-5 text-center text-gray-600 font-medium">
                                                            {report.total_video_watched} / {report.chapter_info?.no_of_videos}
                                                        </td>
                                                        <td className="py-3.5 px-5 text-center text-gray-600 font-medium text-[11px]">
                                                            <span className="text-emerald-600 font-semibold">{formatDuration(report.video_watched)}</span> <span className="text-gray-400">/</span> {formatDuration(report.chapter_info?.no_of_videos_duration || 0)}
                                                        </td>
                                                        <td className="py-3.5 px-5 min-w-[140px]">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${report.progress === 100 ? 'bg-emerald-500' : 'bg-perple'}`}
                                                                        style={{ width: `${report.progress}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">
                                                                    {report.progress}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center">
                                                        <p className="text-sm text-gray-500">No report data available.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <>
                        <div className="bg-white px-5 py-4 border-b border-gray-150 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#2F2B3D]" />
                                <h3 className="text-sm font-bold text-[#2F2B3D]">Enrolled Courses</h3>
                            </div>
                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {data.courses?.length || 0} Total
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#F8F7FA]">
                                    <tr className="border-b border-gray-150 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">Course Name</th>
                                        <th className="py-3 px-5 text-center">Status</th>
                                        <th className="py-3 px-5">Progress</th>
                                        <th className="py-3 px-5 text-center">Certificate</th>
                                        <th className="py-3 px-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.courses && data.courses.length > 0 ? (
                                        data.courses.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                                                <td className="py-3.5 px-5 font-semibold text-[#2F2B3D]">
                                                    {course.course_detail?.name || 'Unknown Course'}
                                                </td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {course.courses_progress === 100 ? (
                                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                                            Completed
                                                        </span>
                                                    ) : course.is_started ? (
                                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                                                            In Progress
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500">
                                                            Not Started
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-5 min-w-[140px]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${course.courses_progress === 100 ? 'bg-emerald-500' : 'bg-perple'}`}
                                                                style={{ width: `${course.courses_progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">
                                                            {course.courses_progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-5 text-center">
                                                    {course.certificate ? (
                                                        <a
                                                            href={course.certificate}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-perple hover:text-[#5e50eb] hover:underline"
                                                        >
                                                            <Award className="w-3.5 h-3.5" /> View
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 font-medium">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-5">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleViewReport(course.course_detail.id)}
                                                            className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-perple hover:bg-perple/5 rounded-md transition-colors"
                                                            title="View Report"
                                                        >
                                                            <BarChart2 className="w-4 h-4" />
                                                        </button>


                                                        <button
                                                            onClick={() => handleViewNotes(course.course_detail.id)}
                                                            className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-perple hover:bg-perple/5 rounded-md transition-colors"
                                                            title="View Notes"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewQuiz(course.course_detail.id)}
                                                            className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-perple hover:bg-perple/5 rounded-md transition-colors"
                                                            title="View Quiz Report"
                                                        >
                                                            <HelpCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewReminder(course.course_detail.id)}
                                                            className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                                                            title="View Reminders"
                                                        >
                                                            <Bell className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center">
                                                <p className="text-sm text-gray-500">No courses assigned to this member.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default VeiwTeamMemberDetail;