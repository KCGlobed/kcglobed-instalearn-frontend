
import { useEffect, useState, useMemo } from 'react';
import {
    Clock,
    Repeat,
    MoreVertical,
    Pencil,
    Trash2,
    Loader2,
    CalendarDays,
    CheckCircle2,
    Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
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

const MyAllReminderTab = () => {
    const dispatch = useAppDispatch();
    const { showModal } = useModal();
    const { reminders, loading, error } = useAppSelector((state: RootState) => state.reminders);

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

    const handleEditReminder = (reminder: any) => {
        const courseId = typeof reminder.course === 'object' && reminder.course !== null
            ? reminder.course.id
            : Number(reminder.course);

        const courseName = typeof reminder.course === 'object' && reminder.course !== null
            ? reminder.course.name
            : 'Unknown Course';

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
                            throw err;
                        }
                    }}
                />
            ),
            size: "md"
        });
        setActiveDropdown(null);
    };

    if (loading && reminders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E9EAF0] rounded-[4px]">
                <Loader2 className="w-9 h-9 animate-spin text-[#5624D0] mb-3" />
                <p className="text-xs text-[#6E7485] font-semibold">Loading reminders…</p>
            </div>
        );
    }

    if (error && reminders.length === 0) {
        return (
            <div className="py-16 text-center border border-red-200 bg-red-50/20 rounded-[4px]">
                <p className="text-sm font-semibold text-red-600">Failed to load reminders: {error}</p>
            </div>
        );
    }

    if (reminders.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-[4px] border border-[#E9EAF0] max-w-xl mx-auto font-inter">
                <div className="w-16 h-16 bg-indigo-50 rounded-[4px] flex items-center justify-center mx-auto mb-5">
                    <Bell className="w-7 h-7 text-indigo-200" />
                </div>
                <h3 className="text-xl font-bold text-[#1D2026] mb-2 tracking-tight">No reminders scheduled</h3>
                <p className="text-[#6E7485] text-sm mb-8 px-6 leading-relaxed">
                    Set study reminders on your courses to build a learning habit.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#1D2026] text-white text-sm font-bold rounded-[4px] hover:bg-[#5624D0] transition-all shadow-lg hover:shadow-[#5624D0]/20"
                >
                    Explore Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700 font-inter">
            {reminders.map(reminder => {
                const freq: FrequencyType = FREQUENCY_LABELS[reminder.frequency] ?? 'Daily';
                const formattedTime = formatTimeString(reminder.time);
                const courseName = typeof reminder.course === 'object' && reminder.course !== null
                    ? reminder.course.name
                    : 'Unknown Course';

                return (
                    <div
                        key={reminder.id}
                        className="relative bg-white border border-[#E9EAF0] rounded-[4px] p-5 flex flex-col justify-between min-h-[180px] shadow-xs transition-all hover:border-[#d1d7dc]"
                    >
                        <div className="flex-1 min-w-0 pr-6">
                            <h2 className="text-[15px] font-bold text-[#1D2026] mb-3 leading-snug line-clamp-2" title={reminder.title}>
                                {reminder.title}
                            </h2>

                            <div className="flex flex-col gap-2 mb-4 text-[12px] text-[#1D2026] font-bold">
                                <div className="flex items-center gap-2">
                                    <Clock size={15} className="text-[#6E7485]" />
                                    <span>{formattedTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Repeat size={15} className="text-[#6E7485]" />
                                    <span>{freq}</span>
                                </div>
                                {/* Show days for Weekly */}
                                {freq === 'Weekly' && reminder.days && (
                                    <div className="flex items-center gap-2 text-[#5624D0]">
                                        <CheckCircle2 size={13} />
                                        <span className="text-[11px]">{formatDaysDisplay(reminder.days)}</span>
                                    </div>
                                )}
                                {/* Show date for Once */}
                                {freq === 'Once' && reminder.date && (
                                    <div className="flex items-center gap-2 text-[#5624D0]">
                                        <CalendarDays size={13} />
                                        <span className="text-[11px]">{reminder.date}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-[12px] text-[#6E7485] font-medium leading-relaxed mt-auto pt-3 border-t border-[#F1F2F4]">
                            <p className="mb-0.5 text-[11px]">Added to calendar</p>
                            <p className="text-[#1D2026] font-semibold truncate" title={courseName}>{courseName}</p>
                        </div>

                        {/* Three-dot menu */}
                        <div className="absolute right-3 top-3 reminder-dropdown-container">
                            <button
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === reminder.id ? null : reminder.id
                                    )
                                }
                                className="p-1.5 text-[#1D2026] hover:bg-[#F1F2F4] rounded-full transition-colors focus:outline-none"
                                aria-label="Reminder options"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {activeDropdown === reminder.id && (
                                <div className="absolute right-0 mt-1 w-[140px] bg-white border border-[#E9EAF0] rounded-[4px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-30 py-1 text-xs font-semibold">
                                    <button
                                        onClick={() => handleEditReminder(reminder)}
                                        className="w-full text-left px-3.5 py-2 hover:bg-[#F1F2F4] transition-colors flex items-center gap-2 text-[#1D2026]"
                                    >
                                        <Pencil size={12} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReminder(reminder)}
                                        className="w-full text-left px-3.5 py-2 hover:bg-[#F1F2F4] transition-colors flex items-center gap-2 text-[#E23E3E]"
                                    >
                                        <Trash2 size={12} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MyAllReminderTab;