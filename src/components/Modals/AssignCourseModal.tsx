import React, { useEffect, useState } from 'react';
import { BookOpen, Trash2, Loader2, Sparkles, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useModal } from './ModalContext';
import { useAppSelector } from '../../hooks/useRedux';
import { courseAssignToMember, courseCatalogListApi, courseRemoveToMember } from '../../utils/service';

interface Course {
    id: number;
    name: string;
}

interface AssignCourseModalProps {
    userId: number;
    userName: string;
    onSuccess: () => void;
}

const AssignCourseModal = ({ userId, userName, onSuccess }: AssignCourseModalProps) => {
    const { hideModal } = useModal();
    const [activeTab, setActiveTab] = useState<'assigned' | 'assign'>('assigned');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState<number | null>(null);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

    // Find detailed corporate user in redux to get their currently assigned courses
    const { corporateUsers } = useAppSelector((state) => state.corporateUser);
    const userDetail = corporateUsers.find((user) => user.id === userId);
    const currentCourses = userDetail?.courses || [];

    // Fetch the courses catalog on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const response = await courseCatalogListApi();
                if (response?.data && Array.isArray(response.data)) {
                    setCourses(response.data);
                } else if (Array.isArray(response)) {
                    setCourses(response);
                }
            } catch (error: any) {
                console.error('Failed to load courses:', error);
                toast.error('Could not load course list catalog.');
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    // react-select custom styles to match the premium theme
    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused ? '#7367F0' : '#E5E7EB',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(115, 103, 240, 0.08)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#7367F0' : '#D1D5DB',
            },
            fontSize: '12px',
            borderRadius: '12px',
            minHeight: '44px',
            backgroundColor: '#F9FAFB',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#7367F0'
                : state.isFocused
                    ? 'rgba(115, 103, 240, 0.06)'
                    : 'transparent',
            color: state.isSelected ? '#ffffff' : '#2F2B3D',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '10px 14px',
            ':active': {
                backgroundColor: state.isSelected ? '#7367F0' : 'rgba(115, 103, 240, 0.12)',
            }
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: 'rgba(115, 103, 240, 0.08)',
            borderRadius: '8px',
            padding: '2px 6px',
            border: '1px solid rgba(115, 103, 240, 0.15)',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#7367F0',
            fontWeight: '600',
            fontSize: '11px',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#7367F0',
            borderRadius: '100%',
            marginLeft: '4px',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
        }),
        menuPortal: (provided: any) => ({
            ...provided,
            zIndex: 99999,
        })
    };

    // Filter out courses already assigned to the user
    const assignedCourseIds = new Set(currentCourses.map((c) => c.course_detail?.id).filter(Boolean));
    const availableCourses = courses.filter((c) => !assignedCourseIds.has(c.id));

    const courseOptions = availableCourses.map(course => ({
        value: course.id,
        label: course.name
    }));

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCourses.length === 0) {
            toast.error('Please select at least one course.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                user_id: userId,
                course_id: selectedCourses
            };

            await courseAssignToMember(payload);
            toast.success('Course(s) assigned successfully!');
            setSelectedCourses([]);
            onSuccess();
            // Automatically switch back to assigned courses view
            setActiveTab('assigned');
        } catch (error: any) {
            console.error('Failed to assign course:', error);
            toast.error(error?.message || 'Failed to assign course.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveCourse = async (courseId: number) => {
        try {
            setIsRemoving(courseId);
            const payload = {
                user_id: userId,
                course_id: [courseId]
            };
            await courseRemoveToMember(payload);
            toast.success('Course assignment removed.');
            onSuccess();
        } catch (error: any) {
            console.error('Failed to remove course assignment:', error);
            toast.error(error?.message || 'Failed to remove course assignment.');
        } finally {
            setIsRemoving(null);
        }
    };

    return (
        <div className="relative pt-4 w-full max-w-lg mx-auto">
            {/* Top glowing line */}
            <div className="absolute -top-6 -left-6 -right-6 h-1.5 bg-gradient-to-r from-[#7367F0] via-[#A8A1F8] to-[#8F85F3] rounded-t-xl" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#7367F0]/10 rounded-lg text-[#7367F0]">
                            <BookOpen className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-bold text-[#2F2B3D] tracking-tight">Manage Courses</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal pl-8">
                        Assign new training or review active courses for <span className="font-semibold text-[#2F2B3D]">{userName}</span>
                    </p>
                </div>
            </div>

            {/* Premium Tabbar */}
            <div className="flex border-b border-gray-100 mb-6 gap-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('assigned')}
                    className={`flex-1 pb-3 text-xs font-bold transition-all relative border-b-2 text-center cursor-pointer ${
                        activeTab === 'assigned'
                            ? 'border-[#7367F0] text-[#7367F0]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Assigned Courses ({currentCourses.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('assign')}
                    className={`flex-1 pb-3 text-xs font-bold transition-all relative border-b-2 text-center cursor-pointer ${
                        activeTab === 'assign'
                            ? 'border-[#7367F0] text-[#7367F0]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Assign New Course
                </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'assigned' && (
                <div className="space-y-4">
                    {currentCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-xs font-medium text-gray-500">No courses currently assigned</p>
                            <p className="text-[10px] text-gray-400 mt-1">Switch to the "Assign New Course" tab to select catalog courses.</p>
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {currentCourses.map((uc) => {
                                const courseId = uc.course_detail?.id;
                                const courseName = uc.course_detail?.name || 'Unknown Course';
                                if (!courseId) return null;

                                return (
                                    <div
                                        key={uc.id}
                                        className="flex items-center justify-between p-3 bg-white border border-gray-150 rounded-xl hover:border-gray-300 transition-colors shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="p-1.5 bg-purple-50 rounded-lg text-perple">
                                                <BookOpen className="w-3.5 h-3.5" />
                                            </span>
                                            <span className="text-xs font-bold text-[#2F2B3D] line-clamp-1">{courseName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={isRemoving !== null}
                                            onClick={() => handleRemoveCourse(courseId)}
                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                            title="Remove Course Assignment"
                                        >
                                            {isRemoving === courseId ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'assign' && (
                <form onSubmit={handleAssign} className="space-y-6">
                    {loadingCourses ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-6 h-6 animate-spin text-perple" />
                            <span className="text-xs text-gray-500 ml-2 font-medium">Loading catalog courses...</span>
                        </div>
                    ) : availableCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
                            <p className="text-xs font-bold text-gray-600">All courses assigned!</p>
                            <p className="text-[10px] text-gray-400 mt-1">This user is already enrolled in all courses from the corporate catalog.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                Select Courses to Assign
                            </label>
                            <Select
                                isMulti
                                options={courseOptions}
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Search & select courses..."
                                value={courseOptions.filter(opt => selectedCourses.includes(opt.value))}
                                onChange={(selectedOpts) => {
                                    setSelectedCourses(selectedOpts ? selectedOpts.map(o => o.value) : []);
                                }}
                                menuPortalTarget={document.body}
                            />
                            <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                                You can select multiple courses at once.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={hideModal}
                            className="h-9 px-4 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        {availableCourses.length > 0 && (
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedCourses.length === 0}
                                className="h-9 px-4 bg-perple hover:bg-[#5e50eb] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Assigning...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Assign Course</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default AssignCourseModal;
