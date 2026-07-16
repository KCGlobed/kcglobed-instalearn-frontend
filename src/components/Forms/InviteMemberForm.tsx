import React, { useEffect, useState } from 'react';
import { Mail, Phone, User, Loader2, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { shareCourseAccessApi, courseList, courseCatalogListApi } from '../../utils/service';
import { useModal } from '../Modals/ModalContext';
import { useAppDispatch } from '../../hooks/useRedux';
import { fetchCorporateUsers } from '../../store/slices/corporateUserSlice';

interface Course {
    id: number;
    name: string;
}

interface InviteMemberFormProps {
    onSuccess?: () => void;
}

interface InviteMemberFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    selectedCourses: number[];
}

const InviteMemberForm = ({ onSuccess }: InviteMemberFormProps) => {
    const { hideModal } = useModal();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, control, formState: { errors } } = useForm<InviteMemberFormInputs>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            selectedCourses: [],
        }
    });

    // Courses API list state
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load course catalog on mount
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
                console.error('Failed to load course list:', error);
                toast.error('Could not load training catalog courses.');
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
            borderColor: errors.selectedCourses ? '#EF4444' : (state.isFocused ? '#7367F0' : '#E5E7EB'),
            boxShadow: errors.selectedCourses 
                ? '0 0 0 4px rgba(239, 68, 68, 0.08)' 
                : (state.isFocused ? '0 0 0 4px rgba(115, 103, 240, 0.08)' : 'none'),
            '&:hover': {
                borderColor: errors.selectedCourses ? '#EF4444' : (state.isFocused ? '#7367F0' : '#D1D5DB'),
            },
            fontSize: '12px',
            borderRadius: '12px',
            minHeight: '44px',
            backgroundColor: errors.selectedCourses ? 'rgba(239, 68, 68, 0.02)' : '#F9FAFB',
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

    const courseOptions = courses.map(course => ({
        value: course.id,
        label: course.name
    }));

    // Form submit handler
    const onSubmit = async (data: InviteMemberFormInputs) => {
        try {
            setIsSubmitting(true);
            const payload = {
                first_name: data.firstName.trim(),
                last_name: data.lastName.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                course_id: data.selectedCourses,
            };

            await shareCourseAccessApi(payload);
            toast.success('Invitation sent and course access shared successfully!');

            // Refresh member list
            dispatch(fetchCorporateUsers(undefined));

            if (onSuccess) {
                onSuccess();
            }
            hideModal();
        } catch (error: any) {
            console.error('Failed to share course access:', error);
            toast.error(error?.message || 'Failed to send invitation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative pt-4 w-full max-w-lg mx-auto">
            {/* Top Glowing Gradient accent line */}
            <div className="absolute -top-6 -left-6 -right-6 h-1.5 bg-gradient-to-r from-[#7367F0] via-[#A8A1F8] to-[#8F85F3] rounded-t-xl" />

            {/* Header section with sparkles */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#7367F0]/10 rounded-lg text-[#7367F0]">
                            <Sparkles className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-bold text-[#2F2B3D] tracking-tight">Invite Team Member</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal pl-8">
                        Assign a corporate seat, share training access, and invite.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* First Name Input group */}
                    <div className="group flex flex-col gap-1.5">
                        <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${errors.firstName ? 'text-rose-500' : 'text-gray-500 group-focus-within:text-[#7367F0]'}`}>
                            First Name
                        </label>
                        <div className={`relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-sm ${
                            errors.firstName 
                                ? 'bg-rose-50/20 border border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/8' 
                                : 'bg-[#F9FAFB] border border-gray-200 focus-within:border-[#7367F0] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#7367F0]/8'
                        }`}>
                            <User className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${errors.firstName ? 'text-rose-400' : 'text-gray-400 focus-within:text-[#7367F0]'}`} />
                            <input
                                type="text"
                                placeholder="Enter first name"
                                {...register('firstName', {
                                    required: 'First name is required',
                                    validate: value => value.trim() !== '' || 'First name cannot be empty'
                                })}
                                className="w-full bg-transparent text-xs text-[#2F2B3D] placeholder-gray-400 focus:outline-none font-medium"
                            />
                        </div>
                        {errors.firstName && (
                            <span className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                                {errors.firstName.message}
                            </span>
                        )}
                    </div>

                    {/* Last Name Input group */}
                    <div className="group flex flex-col gap-1.5">
                        <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${errors.lastName ? 'text-rose-500' : 'text-gray-500 group-focus-within:text-[#7367F0]'}`}>
                            Last Name
                        </label>
                        <div className={`relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-sm ${
                            errors.lastName 
                                ? 'bg-rose-50/20 border border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/8' 
                                : 'bg-[#F9FAFB] border border-gray-200 focus-within:border-[#7367F0] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#7367F0]/8'
                        }`}>
                            <User className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${errors.lastName ? 'text-rose-400' : 'text-gray-400 focus-within:text-[#7367F0]'}`} />
                            <input
                                type="text"
                                placeholder="Enter last name"
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    validate: value => value.trim() !== '' || 'Last name cannot be empty'
                                })}
                                className="w-full bg-transparent text-xs text-[#2F2B3D] placeholder-gray-400 focus:outline-none font-medium"
                            />
                        </div>
                        {errors.lastName && (
                            <span className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                                {errors.lastName.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Email Address Input group */}
                <div className="group flex flex-col gap-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${errors.email ? 'text-rose-500' : 'text-gray-500 group-focus-within:text-[#7367F0]'}`}>
                        Email Address
                    </label>
                    <div className={`relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-sm ${
                        errors.email 
                            ? 'bg-rose-50/20 border border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/8' 
                            : 'bg-[#F9FAFB] border border-gray-200 focus-within:border-[#7367F0] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#7367F0]/8'
                    }`}>
                        <Mail className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${errors.email ? 'text-rose-400' : 'text-gray-400 focus-within:text-[#7367F0]'}`} />
                        <input
                            type="email"
                            placeholder="Enter email address"
                            {...register('email', {
                                required: 'Email address is required',
                                validate: {
                                    noSpaces: value => value.trim() === value || 'Email cannot contain leading or trailing spaces',
                                    validFormat: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address'
                                }
                            })}
                            className="w-full bg-transparent text-xs text-[#2F2B3D] placeholder-gray-400 focus:outline-none font-medium"
                        />
                    </div>
                    {errors.email && (
                        <span className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Phone Number Input group */}
                <div className="group flex flex-col gap-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${errors.phone ? 'text-rose-500' : 'text-gray-500 group-focus-within:text-[#7367F0]'}`}>
                        Phone Number
                    </label>
                    <div className={`relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-sm ${
                        errors.phone 
                            ? 'bg-rose-50/20 border border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/8' 
                            : 'bg-[#F9FAFB] border border-gray-200 focus-within:border-[#7367F0] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#7367F0]/8'
                    }`}>
                        <Phone className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${errors.phone ? 'text-rose-400' : 'text-gray-400 focus-within:text-[#7367F0]'}`} />
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            {...register('phone', {
                                required: 'Phone number is required',
                                validate: value => value.trim() !== '' || 'Phone number cannot be empty'
                            })}
                            className="w-full bg-transparent text-xs text-[#2F2B3D] placeholder-gray-400 focus:outline-none font-medium"
                        />
                    </div>
                    {errors.phone && (
                        <span className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                            {errors.phone.message}
                        </span>
                    )}
                </div>

                {/* Course Catalog Selection with react-select */}
                <div className="group flex flex-col gap-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${errors.selectedCourses ? 'text-rose-500' : 'text-gray-500 group-focus-within:text-[#7367F0]'}`}>
                        Select Course Access
                    </label>
                    <Controller
                        control={control}
                        name="selectedCourses"
                        rules={{
                            required: 'Please select at least one course to share access.'
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                isMulti
                                options={courseOptions}
                                value={courseOptions.filter(option => value?.includes(option.value))}
                                onChange={(selected) => {
                                    const ids = selected ? selected.map((option: any) => option.value) : [];
                                    onChange(ids);
                                }}
                                styles={customSelectStyles}
                                isLoading={loadingCourses}
                                placeholder="Search and select courses..."
                                noOptionsMessage={() => "No courses found"}
                                menuShouldScrollIntoView={false}
                                menuPortalTarget={document.body}
                            />
                        )}
                    />
                    {errors.selectedCourses && (
                        <span className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                            {errors.selectedCourses.message}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-gray-100 mt-8">
                    <button
                        type="button"
                        onClick={hideModal}
                        disabled={isSubmitting}
                        className="px-5 h-10 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100/70 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 h-10 bg-gradient-to-r from-[#7367F0] to-[#8F85F3] hover:from-[#5e50eb] hover:to-[#7b71ee] text-white text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#7367F0]/25 hover:shadow-xl hover:shadow-[#7367F0]/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Send Invitation</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InviteMemberForm;