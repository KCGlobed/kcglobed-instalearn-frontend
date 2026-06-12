import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import {
    Clock,
    Repeat,
    MoreVertical,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    CalendarDays,
    CheckCircle2
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import {
    fetchReminders,
    deleteReminder
} from '../../store/slices/reminderSlice';
import { useModal } from '../Modals/ModalContext';
import { LearningRemiderForm } from '../Forms/LearningRemiderForm';
import toast from 'react-hot-toast';
import DeleteModal from '../Modals/DeleteModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type FrequencyType = 'Daily' | 'Weekly' | 'Once';

const FREQUENCY_LABELS: Record<number | string, FrequencyType> = {
    1: 'Daily',
    2: 'Weekly',
    3: 'Once',
};

// ─── Helper: Format 24h "13:00:00" → "1:00 PM" ──────────────────────────────
const formatTimeString = (time24: string): string => {
    try {
        const parts = time24.split(':');
        let hour = parseInt(parts[0], 10);
        const min = parseInt(parts[1], 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        const paddedMin = min < 10 ? `0${min}` : min;
        return `${hour}:${paddedMin} ${ampm}`;
    } catch {
        return time24;
    }
};

// ─── Helper: Format days string "mon,tue,wed" → "Mon, Tue, Wed" ─────────────
const formatDaysDisplay = (days: string): string => {
    if (!days) return '';
    return days
        .split(',')
        .map(d => d.trim())
        .map(d => d.charAt(0).toUpperCase() + d.slice(1))
        .join(', ');
};

// ─── Component ────────────────────────────────────────────────────────────────
const LearningReminder = () => {
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    const courseId = Number(slug) || 1;
    const { showModal } = useModal();

    const { courseDetail } = useAppSelector((state: RootState) => state.courseDetail);
    const courseName = useMemo(
        () => courseDetail?.name || 'Introduction To Python Programming',
        [courseDetail]
    );

    const { reminders, loading, error } = useAppSelector((state: RootState) => state.reminders);

    // Filter to current course
    const courseReminders = useMemo(
        () =>
            reminders.filter(r => {
                const rCourseId =
                    typeof r.course === 'object' && r.course !== null
                        ? r.course.id
                        : Number(r.course);
                return rCourseId === courseId;
            }),
        [reminders, courseId]
    );

    // ── UI state ────────────────────────────────────────────────────────────
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    // ── Fetch on mount ──────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchReminders());
    }, [dispatch]);

    // ── Close dropdown on outside click ────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.reminder-dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAddReminder = () => {
        showModal({
            content: (
                <LearningRemiderForm
                    courseId={courseId}
                    courseName={courseName}
                    onSuccess={() => {
                        dispatch(fetchReminders());
                    }}
                />
            ),
            size: "md"
        });
    };

    const handleEditReminder = (reminder: any) => {
        showModal({
            content: (
                <LearningRemiderForm
                    courseId={courseId}
                    courseName={courseName}
                    reminder={reminder}
                    onSuccess={() => {
                        dispatch(fetchReminders());
                    }}
                />
            ),
            size: "md"
        });
        setActiveDropdown(null);
    };

    const handleDeleteReminder = (reminder: any) => {
        showModal({
            content: (
                <DeleteModal
                    title="Delete Study Reminder"
                    description={`Are you sure you want to delete the study reminder "${reminder.title}"?`}
                    confirmText="Delete"
                    onConfirm={async () => {
                        try {
                            await dispatch(deleteReminder(reminder.id)).unwrap();
                            toast.success('Reminder deleted successfully!');
                            dispatch(fetchReminders());
                        } catch (err: any) {
                            console.error('Failed to delete reminder', err);
                            toast.error(err?.message || 'Failed to delete reminder');
                            throw err; // propagate error so DeleteModal stays open or registers the error
                        }
                    }}
                />
            ),
            size: "md"
        });
        setActiveDropdown(null);
    };

    return (
        <div className="w-full max-w-[850px] mx-auto py-2 font-sans text-[#2d2f31]">

            {/* Header */}
            <h1 className="text-[24px] font-bold text-[#2d2f31] mb-2">Learning reminders</h1>
            <p className="text-[14.5px] text-[#6a6f73] leading-relaxed mb-6">
                Learning a little each day adds up. Research shows that students who make learning a
                habit are more likely to reach their goals. Set time aside to learn and get reminders
                using your learning scheduler.
            </p>

            {/* Reminders list */}
            <div className="flex flex-col gap-4 mb-6">
                {loading && courseReminders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#d1d7dc] rounded-sm">
                        <Loader2 className="w-9 h-9 animate-spin text-[#5624D0] mb-3" />
                        <p className="text-xs text-[#6a6f73] font-semibold">Loading reminders…</p>
                    </div>
                ) : error && courseReminders.length === 0 ? (
                    <div className="py-16 text-center border border-red-200 bg-red-50/20 rounded-sm">
                        <p className="text-sm font-semibold text-red-600">Failed to load reminders: {error}</p>
                    </div>
                ) : courseReminders.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-[#d1d7dc] rounded-sm bg-white">
                        <p className="text-sm text-[#6a6f73] font-medium mb-1">No reminders scheduled yet.</p>
                        <p className="text-xs text-[#8c94a3] max-w-sm mx-auto">
                            Create a habit tracker to keep yourself motivated.
                        </p>
                    </div>
                ) : (
                    courseReminders.map(reminder => {
                        const freq: FrequencyType = FREQUENCY_LABELS[reminder.frequency] ?? 'Daily';
                        const formattedTime = formatTimeString(reminder.time);

                        return (
                            <div
                                key={reminder.id}
                                className="relative bg-white border border-[#d1d7dc] rounded-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-xs"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h2 className="text-[16px] font-bold text-[#2d2f31] mb-3 leading-snug">
                                        {reminder.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-6 mb-3 text-[13px] text-[#2d2f31] font-bold">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{formattedTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Repeat size={16} />
                                            <span>{freq}</span>
                                        </div>
                                        {/* Show days for Weekly */}
                                        {freq === 'Weekly' && reminder.days && (
                                            <div className="flex items-center gap-2 text-[#5624D0]">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[12px]">{formatDaysDisplay(reminder.days)}</span>
                                            </div>
                                        )}
                                        {/* Show date for Once */}
                                        {freq === 'Once' && reminder.date && (
                                            <div className="flex items-center gap-2 text-[#5624D0]">
                                                <CalendarDays size={14} />
                                                <span className="text-[12px]">{reminder.date}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-[13px] text-[#6a6f73] font-medium leading-relaxed">
                                        <p className="mb-0.5">Added to your calendar</p>
                                        <p>Course: {courseName}</p>
                                    </div>
                                </div>

                                {/* Three-dot menu */}
                                <div className="absolute right-6 top-6 md:static relative reminder-dropdown-container">
                                    <button
                                        onClick={() =>
                                            setActiveDropdown(
                                                activeDropdown === reminder.id ? null : reminder.id
                                            )
                                        }
                                        className="p-2 text-[#2d2f31] hover:bg-[#f7f9fa] rounded-full transition-colors focus:outline-none"
                                        aria-label="Reminder options"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {activeDropdown === reminder.id && (
                                        <div className="absolute right-0 mt-1 w-[160px] bg-white border border-[#d1d7dc] rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-30 py-1 text-sm font-medium">
                                            <button
                                                onClick={() => handleEditReminder(reminder)}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f7f9fa] transition-colors flex items-center gap-2 text-[#2d2f31]"
                                            >
                                                <Pencil size={14} />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReminder(reminder)}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f7f9fa] transition-colors flex items-center gap-2 text-[#2d2f31]"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add button */}
            <button
                onClick={handleAddReminder}
                className="inline-flex items-center gap-1 bg-[#5624D0] hover:bg-[#461DA5] text-white font-bold text-[14px] px-5 py-2.5 rounded-sm transition-colors"
            >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add another</span>
            </button>
        </div>
    );
};

export default LearningReminder;