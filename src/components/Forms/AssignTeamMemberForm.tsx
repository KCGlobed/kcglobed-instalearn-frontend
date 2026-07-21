import { useEffect, useState } from "react";
import { getCorporateUserListApi, assignSingleCourseToStudentsApi } from "../../utils/service";
import Select from "react-select";
import { useModal } from "../Modals/ModalContext";
import toast from "react-hot-toast";
import * as yup from "yup";

const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        background: '#fff',
        borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
        boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#6366f1' : '#d1d5db'
        },
        borderRadius: '0.75rem',
        padding: '0.25rem'
    }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#eef2ff',
        borderRadius: '0.5rem',
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: '#4f46e5',
        fontWeight: '600',
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: '#4f46e5',
        ':hover': {
            backgroundColor: '#e0e7ff',
            color: '#3730a3',
        },
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#eef2ff' : 'transparent',
        color: state.isSelected ? 'white' : '#111827',
        cursor: 'pointer',
        padding: '0.75rem 1rem',
        '&:active': {
            backgroundColor: '#4f46e5',
        }
    }),
    menu: (base: any) => ({
        ...base,
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        zIndex: 50
    }),
};

interface AssignTeamMemberFormProps {
    courseId: any;
}

const assignSchema = yup.object().shape({
    courseId: yup
        .number()
        .typeError("Invalid course identifier.")
        .required("Course ID is required."),
    userIds: yup
        .array()
        .of(yup.number().required())
        .min(1, "Please select at least one team member.")
        .required("Please select at least one team member.")
});

const AssignTeamMemberForm = ({ courseId }: AssignTeamMemberFormProps) => {
    const [corporateUserList, setCorporateUserList] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { hideModal } = useModal();

    useEffect(() => {
        getCorporateUserListApi().then((res) => {
            console.log(res);
            setCorporateUserList(res.data || []);
        }).catch(err => {
            console.error("Failed to fetch corporate users", err);
        });
    }, []);

    const options = corporateUserList.map((user: any) => ({
        value: user.email,
        label: `${user.first_name} ${user.last_name}`,
        ...user
    }));

    const formatOptionLabel = ({ first_name, last_name, email, image }: any) => {
        const initials = (first_name?.[0] || "") + (last_name?.[0] || "");

        return (
            <div className="flex items-center gap-3">
                {image ? (
                    <img src={image} alt={first_name} className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm border border-gray-100" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm border border-indigo-50">
                        {initials || email?.[0] || "?"}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{first_name} {last_name}</span>
                    <span className="text-xs text-gray-500 font-medium">{email}</span>
                </div>
            </div>
        );
    };

    const handleAssign = async () => {
        try {
            const payload = {
                user_id: selectedUsers.map(opt => opt.id),
                course_id: Number(courseId)
            };

            // Validate using yup
            await assignSchema.validate({
                courseId: payload.course_id,
                userIds: payload.user_id
            }, { abortEarly: false });

            setIsSubmitting(true);
            await assignSingleCourseToStudentsApi(payload);
            toast.success("Course assigned successfully!");
            setSelectedUsers([]);
            hideModal(); ``
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                // Set the validation error message to show inline
                const firstErrorMessage = error.inner[0]?.message || error.message;
                setValidationError(firstErrorMessage);
                toast.error(firstErrorMessage);
            } else {
                console.error("Failed to assign course:", error);
                toast.error(error?.message || "Failed to assign course.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-white rounded-2xl relative">

            {/* Header Area */}
            <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Assign Course</h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Select team members to assign this course to. They will be notified via email.</p>
                </div>
            </div>

            {/* Form Area */}
            <div className="mb-8 relative z-10">
                <label className="block text-sm font-bold text-gray-700 mb-2">Team Members</label>
                <Select
                    isMulti
                    options={options}
                    value={selectedUsers}
                    onChange={(selected: any) => {
                        setSelectedUsers(selected || []);
                        setValidationError(null);
                    }}
                    formatOptionLabel={formatOptionLabel}
                    styles={customStyles}
                    placeholder="Search by name or email..."
                    noOptionsMessage={() => "No team members found"}
                />
                {validationError && (
                    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {validationError}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    onClick={hideModal}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAssign}
                    disabled={isSubmitting || selectedUsers.length === 0}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span>Assigning...</span>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Confirm Assignment</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default AssignTeamMemberForm;