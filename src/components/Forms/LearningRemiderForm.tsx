import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { createReminder, updateReminder } from '../../store/slices/reminderSlice';
import { useModal } from '../Modals/ModalContext';
import toast from 'react-hot-toast';

type FrequencyType = 'Daily' | 'Weekly' | 'Once';

const FREQUENCY_VALUES: Record<FrequencyType, number> = {
    Daily: 1,
    Weekly: 2,
    Once: 3,
};

const FREQUENCY_LABELS: Record<number | string, FrequencyType> = {
    1: 'Daily',
    2: 'Weekly',
    3: 'Once',
};

const DAYS_CONFIG = [
    { label: 'Su', value: 'sun' },
    { label: 'Mo', value: 'mon' },
    { label: 'Tu', value: 'tue' },
    { label: 'We', value: 'wed' },
    { label: 'Th', value: 'thu' },
    { label: 'Fr', value: 'fri' },
    { label: 'Sa', value: 'sat' },
];

interface LearningRemiderFormProps {
    courseId: number;
    courseName: string;
    reminder?: any;
    onSuccess?: () => void;
}

export const LearningRemiderForm: React.FC<LearningRemiderFormProps> = ({
    courseId,
    courseName,
    reminder,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const { hideModal } = useModal();
    const [submitting, setSubmitting] = useState(false);

    // Form inputs
    const [titleInput, setTitleInput] = useState('');
    const [timeInput, setTimeInput] = useState('12:00');
    const [dateInput, setDateInput] = useState(() => new Date().toISOString().split('T')[0]);
    const [frequencyInput, setFrequencyInput] = useState<FrequencyType>('Daily');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    // Populate initial states if editing
    useEffect(() => {
        if (reminder) {
            setTitleInput(reminder.title || '');

            // Restore time
            try {
                if (reminder.time) {
                    const parts = reminder.time.split(':');
                    setTimeInput(`${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`);
                } else {
                    setTimeInput('12:00');
                }
            } catch {
                setTimeInput('12:00');
            }

            // Restore frequency
            const freq: FrequencyType = FREQUENCY_LABELS[reminder.frequency] ?? 'Daily';
            setFrequencyInput(freq);

            // Restore days
            if (freq === 'Weekly' && reminder.days) {
                setSelectedDays(reminder.days.split(',').map((d: string) => d.trim()).filter(Boolean));
            } else {
                setSelectedDays([]);
            }

            // Restore date
            if (freq === 'Once' && reminder.date) {
                setDateInput(reminder.date);
            } else {
                setDateInput(new Date().toISOString().split('T')[0]);
            }
        }
    }, [reminder]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const buildPayload = (id?: number) => {
        const timeVal = timeInput;
        const defaultTitle = `Learning reminder for ${courseName.split(':')[0].toLowerCase().trim()}`;
        const title = titleInput.trim() || defaultTitle;
        const frequency = FREQUENCY_VALUES[frequencyInput];

        const base: Record<string, any> = {
            course_id: courseId,
            title,
            frequency,
            time: timeVal,
            date: '',
            days: '',
        };

        if (id !== undefined) {
            base.reminder_id = id;
        }

        if (frequencyInput === 'Weekly') {
            base.days = selectedDays.join(',');
            base.date = '';
        } else if (frequencyInput === 'Once') {
            base.date = dateInput;
            base.days = '';
        }

        return base;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (frequencyInput === 'Weekly' && selectedDays.length === 0) {
            toast.error('Please select at least one day for Weekly reminders.');
            return;
        }

        try {
            setSubmitting(true);
            const payload = buildPayload(reminder?.id);
            if (reminder) {
                await dispatch(updateReminder(payload)).unwrap();
                toast.success('Reminder updated successfully!');
            } else {
                await dispatch(createReminder(payload)).unwrap();
                toast.success('Reminder created successfully!');
            }
            if (onSuccess) onSuccess();
            hideModal();
        } catch (err: any) {
            console.error('Failed to save reminder', err);
            toast.error(err?.message || 'Failed to save reminder');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-2 mt-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#F1F2F4]">
                <h3 className="font-bold text-[18px] text-[#2d2f31]">
                    {reminder ? 'Edit Study Reminder' : 'Add Learning Reminder'}
                </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-sm">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#2d2f31] font-bold text-[13px]">
                        Reminder title <span className="text-[#6a6f73] font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        value={titleInput}
                        onChange={e => setTitleInput(e.target.value)}
                        placeholder={`e.g., Learning reminder for ${courseName.split(':')[0].toLowerCase().trim()}`}
                        className="border border-[#d1d7dc] bg-white rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-[#2d2f31] text-[13px] font-medium"
                    />
                </div>

                {/* Frequency pill buttons */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#2d2f31] font-bold text-[13px]">Frequency</label>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['Daily', 'Weekly', 'Once'] as FrequencyType[]).map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    setFrequencyInput(opt);
                                    setSelectedDays([]);
                                }}
                                className={`px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-all ${frequencyInput === opt
                                        ? 'border-[#2d2f31] bg-white text-[#2d2f31] shadow-xs'
                                        : 'border-[#d1d7dc] bg-white text-[#6a6f73] hover:border-[#2d2f31] hover:text-[#2d2f31]'
                                    }`}
                            >
                                {frequencyInput === opt && (
                                    <span className="mr-1 text-[#5624D0]">✓</span>
                                )}
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time — always shown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#2d2f31] font-bold text-[13px]">Time</label>
                    <input
                        type="time"
                        required
                        value={timeInput}
                        onChange={e => setTimeInput(e.target.value)}
                        className="border border-[#d1d7dc] bg-white rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-[#2d2f31] text-[13px] font-medium w-[180px]"
                    />
                </div>

                {/* Weekly: Day selector */}
                {frequencyInput === 'Weekly' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-[#2d2f31] font-bold text-[13px]">Day</label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {DAYS_CONFIG.map(day => {
                                const active = selectedDays.includes(day.value);
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`w-11 h-11 rounded-full border text-[12px] font-bold transition-all ${active
                                                ? 'bg-[#2d2f31] border-[#2d2f31] text-white shadow-xs'
                                                : 'bg-white border-[#d1d7dc] text-[#2d2f31] hover:border-[#2d2f31]'
                                            }`}
                                    >
                                        {active ? '' : '+'} {day.label}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedDays.length === 0 && (
                            <p className="text-[11px] text-red-500 font-medium">
                                Select at least one day.
                            </p>
                        )}
                    </div>
                )}

                {/* Once: Date picker */}
                {frequencyInput === 'Once' && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#2d2f31] font-bold text-[13px]">Date</label>
                        <input
                            type="date"
                            required
                            value={dateInput}
                            onChange={e => setDateInput(e.target.value)}
                            className="border border-[#d1d7dc] bg-white rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-[#2d2f31] text-[13px] font-medium w-[200px]"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#F1F2F4]">
                    <button
                        type="button"
                        onClick={hideModal}
                        className="px-4 py-2 hover:bg-[#f7f9fa] transition-colors rounded-sm text-[#2d2f31] font-bold text-[13px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 bg-[#5624D0] hover:bg-[#461DA5] disabled:bg-[#d1d7dc] text-white rounded-sm font-bold text-[13px] transition-colors min-w-[120px]"
                    >
                        {submitting ? 'Saving...' : reminder ? 'Save Changes' : 'Create Reminder'}
                    </button>
                </div>
            </form>
        </div>
    );
};
