import '../../styles/typography.css';
import { useState, useEffect } from 'react';
import { ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { resetPasswordAction, clearStatus } from '../../store/slices/resetpasswordSlice';
import type { RootState } from '../../store/store';
import type { ResetPasswordPayload } from '../../utils/types';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Get uid and token from query params
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const { loading, error, success } = useSelector((state: RootState) => state.resetPassword);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ResetPasswordPayload>({
        defaultValues: {
            password: '',
            confirm_password: '',
            uid: uid || '',
            token: token || ''
        }
    });

    const password = watch("password");

    // Clear state on unmount
    useEffect(() => {
        return () => {
            dispatch(clearStatus());
        };
    }, [dispatch]);

    // Handle success
    useEffect(() => {
        if (success) {
            toast.success("Password reset successfully! Please log in.");
            navigate('/login');
        }
    }, [success, navigate]);

    // Handle initial missing params
    useEffect(() => {
        if (!uid || !token) {
            toast.error("Invalid or expired reset link.");
        }
    }, [uid, token]);

    const onSubmit = (data: ResetPasswordPayload) => {
        if (!uid || !token) {
            toast.error("Invalid reset link. Please request a new one.");
            return;
        }
        dispatch(resetPasswordAction(data));
    };

    /**
     * Renders a loading spinner icon
     */


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
                                Reset Password
                                <span> 🔒</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px] pr-10">
                                Your new password must be different from previously used passwords
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <label htmlFor="password" className="text-[#2F2B3DE5] font-medium mb-1">
                                        New Password
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            id="password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                                            })}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className={`h-[38px] w-full rounded border ${errors.password ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                                        />
                                        <img
                                            src="/eye.svg"
                                            alt="Show password"
                                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password.message}</p>}
                                </div>

                                <div className="flex flex-col gap-1 w-full mb-4">
                                    <label htmlFor="confirm_password" className="text-sm text-[#2F2B3DE5] font-medium mb-1">
                                        Confirm Password
                                    </label>

                                    <div className="relative w-full">
                                        <input
                                            id="confirm_password"
                                            {...register("confirm_password", {
                                                required: "Please confirm your password",
                                                validate: (value) => value === password || "Passwords do not match"
                                            })}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className={`h-[38px] w-full rounded border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                                        />

                                        <img
                                            src="/eye.svg"
                                            alt="Show password"
                                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                    </div>
                                    {errors.confirm_password && <p className="text-red-500 text-[12px] mt-1">{errors.confirm_password.message}</p>}
                                </div>

                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading || !uid || !token}
                                    className={`w-full h-[38px] ${loading ? 'bg-[#7367F0]/70 cursor-not-allowed' : 'bg-[#7367F0]'} text-white rounded mt-6 flex items-center justify-center font-medium transition-all shadow-sm active:scale-[0.98] hover:bg-[#665cd1]`}
                                >
                                    <Loader text="Resetting..." loading={loading} title="Set New Password" />
                                </button>
                            </form>

                            <div className='flex justify-center align-center pb-10'>
                                <Link to="/login" className="flex items-center font-medium gap-1 text-[#7367F0] hover:underline">
                                    <ChevronLeft width={20} height={20} />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default ResetPassword;
