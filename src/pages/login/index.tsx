import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loginUser } from '../../store/slices/authSlice';
import '../../styles/typography.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { LoginCred } from '../../utils/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Get authentication state from Redux store
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const getDeviceId = () => {
        let deviceId = localStorage.getItem("device_id");
        if (!deviceId) {
            deviceId = crypto.randomUUID(); // built-in
            localStorage.setItem("device_id", deviceId);
        }
        return deviceId;
    };

    const getDeviceType = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile/i.test(userAgent)) return "mobile";
        if (/tablet/i.test(userAgent)) return "tablet";
        return "desktop";
    };

    // Initialize React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginCred>({
        defaultValues: {
            email: '',
            password: '',
            role: 'Student', // Default values for the API
            device_id: getDeviceId(),
            device_type: getDeviceType()
        }
    });

    /**
     * Handles form submission by dispatching the loginUser thunk.
     * @param data - The validated form data
     */
    const onSubmit = async (data: LoginCred) => {
        try {
            const result = await dispatch(loginUser(data));

            if (loginUser.fulfilled.match(result)) {
                reset();
                toast.success("Logged in successfully!");
                navigate('/');
            } else if (loginUser.rejected.match(result)) {
                const errorMessage = result.payload as string || "Login failed";
                toast.error(errorMessage);
            }
        }
        catch (error) {
            console.error("Unexpected error during login:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };



    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative">
                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/8"></div>
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/8"></div>

                <div className="relative z-10 bg-white w-[460px] flex flex-col shadow-md rounded-lg items-center text-left">
                    <div className='w-[125px] h-[25px] my-10'>
                        <img src="/instalogo.png" alt="KC Globed" />
                    </div>

                    <div className="w-full px-10">
                        <div>
                            <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold">
                                Welcome to KCG InstaLearn!
                                <span>👋🏻</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px] pr-20">
                                Please log in to account and start the adventure
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <label htmlFor="email" className="text-[#2F2B3DE5] font-medium mb-1"> Email or Username</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        id="email"
                                        type="text"
                                        placeholder="Enter your email"
                                        className={`h-[38px] w-full rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 w-full mb-4">
                                    <label htmlFor="password" className="text-sm text-[#2F2B3DE5] font-medium mb-1"> Password </label>
                                    <div className="relative w-full">
                                        <input
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className={`h-[38px] w-full rounded border ${errors.password ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                                        />
                                        <img
                                            src="/eye.svg"
                                            alt="Toggle password visibility"
                                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-[12px] mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                        <input type="checkbox" id="rememberMe" className="w-4 h-4 accent-[#7367F0] cursor-pointer" />
                                        <label htmlFor="rememberMe" className="text-sm text-[#2F2B3DE5] cursor-pointer"> Remember me</label>
                                    </div>
                                    <a href="/forgot-password" title="Forgot Password" className="text-sm text-[#7367F0] hover:underline">
                                        Forgot password?
                                    </a>
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
                                            Logging in...
                                        </span>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>
                            </form>

                            <div className="flex flex-col items-center gap-4">
                                <p className="text-sm text-[#2F2B3DE5]">
                                    New on our platform?
                                    <a href="/signup"
                                        className="text-[#7367F0] pl-1 hover:underline font-medium">
                                        Create an account
                                    </a>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
                                <span className="text-sm text-[#2F2B3DE5]">or</span>
                                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
                            </div>

                            <div className="flex justify-center gap-4 pb-10">
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/fb-icon.svg" alt="facebook" /></a>
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/twitter-icon.svg" alt="twitter" /></a>
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/git-icon.svg" alt="github" /></a>
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/Google-icon.svg" alt="Google" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
