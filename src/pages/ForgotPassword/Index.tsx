import { useAppDispatch } from '../../hooks/useAppDispatch';
import { forgotPasswordAction } from '../../store/slices/forgotpasswordSlice';
import '../../styles/typography.css';
import { ChevronLeft } from "lucide-react";
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { ForgotPasswordPayload } from '../../utils/types';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const { loading } = useSelector((state: RootState) => state.forgotPassword);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordPayload>({
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: ForgotPasswordPayload) => {
        try {
            const result = await dispatch(forgotPasswordAction(data));

            if (forgotPasswordAction.fulfilled.match(result)) {
                toast.success(result.payload.message || "Reset link sent successfully!");
                reset();
            } else if (forgotPasswordAction.rejected.match(result)) {
                const errorMessage = (result.payload as string) || "Failed to send reset link";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative">

                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/[8%]"></div>
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/[8%]"></div>

                <div className="relative z-10 bg-white w-[460px] flex flex-col shadow-md rounded-lg items-center text-left">
                    <div className='w-[125px] h-[25px] my-10'>
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                        />
                    </div>

                    <div className="w-full px-10">
                        <div>
                            <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold">
                                Forgot Password
                                <span> 🔒</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px] pr-10">
                                Enter your email address and we'll send you instructions to reset your password
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <label htmlFor="email" className="text-[#2F2B3DE5] font-medium mb-1">
                                        Email
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            id="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            placeholder="Enter your email"
                                            className={`h-[38px] w-full rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-[38px] ${loading ? 'bg-[#7367F0]/70 cursor-not-allowed' : 'bg-[#7367F0]'} text-white rounded mt-6 flex items-center justify-center font-medium transition-all shadow-sm active:scale-[0.98]`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>


                            <div className='flex justify-center align-center pb-10'>
                                <a href="/login" className="flex items-center font-medium gap-1 text-[#7367F0]">
                                    <ChevronLeft />
                                    Back Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default ForgotPassword;