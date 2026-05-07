import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createMyListApi } from '../../utils/service';
import toast from 'react-hot-toast';
import { useModal } from '../Modals/ModalContext';

interface ListFormProps {
    courseId: any;
}

const ListForm: React.FC<ListFormProps> = ({ courseId }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            course_id: courseId
        }
    });
    const [loading, setLoading] = useState(false);
    const { hideModal } = useModal();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await createMyListApi(data);
            toast.success(response.message || "List created successfully");
            hideModal();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white">
            <div className="mb-6">
                <h2 className="text-[20px] font-bold text-[#1D2026] tracking-tight mb-2">Create New List</h2>
                <p className="text-[14px] text-[#6E7485] leading-relaxed">
                    Organize your learning path by grouping related courses into a custom list.
                </p>
            </div>

            <div className="flex flex-col gap-y-2 mb-8">
                <label htmlFor="title" className="text-[14px] font-semibold text-[#1D2026]">
                    List Title
                </label>
                <input
                    id="title"
                    type="text"
                    {...register("title", {
                        required: "Please enter a title for your list",
                        minLength: { value: 3, message: "Title must be at least 3 characters long" }
                    })}
                    placeholder="e.g. Masterclass Collection"
                    className={`h-12 border ${errors.title ? 'border-rose-500 bg-rose-50' : 'border-[#E9EAF0]'} rounded-[4px] px-4 text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#5624D0] transition-all`}
                />
                {errors.title && (
                    <span className="text-[12px] text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">
                        {errors.title.message}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3 justify-end pt-6 border-t border-[#F1F2F4]">
                <button
                    type="button"
                    onClick={hideModal}
                    className="px-6 h-12 text-[14px] font-bold text-[#1D2026] hover:bg-[#F8F9FB] rounded-[4px] transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 h-12 bg-[#1D2026] text-white text-[14px] font-bold rounded-[4px] hover:bg-[#5624D0] transition-all shadow-lg hover:shadow-[#5624D0]/20 flex items-center justify-center min-w-[140px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Create List'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ListForm;