import '../../styles/typography.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserApi, verifyOtpApi } from '../../utils/service';
import VerifyOtp from './VerifyOtp';

interface SignupFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}

// ─── Register Form ────────────────────────────────────────────────────────────

interface RegisterFormProps {
    onSuccess: (data: SignupFormData) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data: SignupFormData) => {
        setApiError('');
        try {
            await registerUserApi(data);
            onSuccess(data);            // Lift data up; parent switches to OTP view
        } catch (err: any) {
            setApiError(err?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="w-full px-10">
            {/* Heading */}
            <div className="mb-6">
                <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold">
                    Create an Account! <span>🚀</span>
                </h3>
                <p className="text-[#2F2B3DB2] text-[15px]">
                    Join KCG InstaLearn and start your learning journey
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* API-level error */}
                {apiError && (
                    <p className="text-red-500 text-[12px] bg-red-50 border border-red-200 rounded px-3 py-2">
                        {apiError}
                    </p>
                )}

                {/* First Name + Last Name */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="first_name" className="text-sm text-[#2F2B3DE5] font-medium">
                            First Name
                        </label>
                        <input
                            {...register('first_name', { required: 'First name is required' })}
                            id="first_name"
                            type="text"
                            placeholder="Harish"
                            className={`h-[38px] w-full rounded border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} pl-3 pr-3 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-[11px] mt-0.5">{errors.first_name.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="last_name" className="text-sm text-[#2F2B3DE5] font-medium">
                            Last Name
                        </label>
                        <input
                            {...register('last_name', { required: 'Last name is required' })}
                            id="last_name"
                            type="text"
                            placeholder="Kumar"
                            className={`h-[38px] w-full rounded border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} pl-3 pr-3 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-[11px] mt-0.5">{errors.last_name.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm text-[#2F2B3DE5] font-medium">
                        Email
                    </label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className={`h-[38px] w-full rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} pl-3 pr-3 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-[11px] mt-0.5">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="text-sm text-[#2F2B3DE5] font-medium">
                        Phone
                    </label>
                    <input
                        {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^(\+91)?[6-9]\d{9}$/,
                                message: 'Enter a valid phone number (e.g. +919915039343)',
                            },
                        })}
                        id="phone"
                        type="tel"
                        placeholder="+919915039343"
                        className={`h-[38px] w-full rounded border ${errors.phone ? 'border-red-500' : 'border-gray-300'} pl-3 pr-3 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-[11px] mt-0.5">{errors.phone.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm text-[#2F2B3DE5] font-medium">
                        Password
                    </label>
                    <div className="relative w-full">
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            className={`h-[38px] w-full rounded border ${errors.password ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                        />
                        <img
                            src="/eye.svg"
                            alt="Toggle password"
                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-[11px] mt-0.5">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="confirm_password" className="text-sm text-[#2F2B3DE5] font-medium">
                        Confirm Password
                    </label>
                    <div className="relative w-full">
                        <input
                            {...register('confirm_password', {
                                required: 'Please confirm your password',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                            id="confirm_password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            className={`h-[38px] w-full rounded border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} pl-3 pr-10 text-sm outline-none focus:border-[#7367F0] transition-colors`}
                        />
                        <img
                            src="/eye.svg"
                            alt="Toggle confirm password"
                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                    {errors.confirm_password && (
                        <p className="text-red-500 text-[11px] mt-0.5">{errors.confirm_password.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-[38px] mt-2 ${isSubmitting ? 'bg-[#7367F0]/70 cursor-not-allowed' : 'bg-[#7367F0] hover:bg-[#5f50e1]'} text-white rounded flex items-center justify-center font-medium transition-all shadow-sm active:scale-[0.98] text-sm`}
                >
                    {isSubmitting ? 'Creating Account…' : 'Create Account'}
                </button>
            </form>

            {/* Login link */}
            <div className="flex justify-center mt-5">
                <p className="text-sm text-[#2F2B3DE5]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#7367F0] pl-1 hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
                <span className="text-sm text-[#2F2B3DE5]">or</span>
                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 pb-10 mt-5">
                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/fb-icon.svg" alt="facebook" /></a>
                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/twitter-icon.svg" alt="twitter" /></a>
                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/git-icon.svg" alt="github" /></a>
                <a href="#" className="hover:opacity-80 transition-opacity"><img src="/Google-icon.svg" alt="Google" /></a>
            </div>
        </div>
    );
};

// ─── Signup Page (orchestrator) ───────────────────────────────────────────────

type Step = 'register' | 'verify';

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('register');
    const [registeredData, setRegisteredData] = useState<SignupFormData | null>(null);

    /** Called when RegisterForm succeeds — store data, switch to OTP view */
    const handleRegistered = (data: SignupFormData) => {
        setRegisteredData(data);
        setStep('verify');
    };

    /** Called after OTP is verified — redirect to dashboard / login */
    const handleVerified = () => {
        // TODO: dispatch login thunk or set auth token from verify response
        navigate('/');
    };

    /** Calls the verify-OTP API; throws on failure so VerifyOtp can show error */
    const handleVerify = async (otp: string) => {
        if (!registeredData) throw new Error('No registration data found.');
        // verifyOtpApi should throw an Error with a message on failure
        const response = await verifyOtpApi({ email: registeredData.email, otp });
        return response
    };

    /** Resends the OTP; throws on failure */
    const handleResend = async () => {
        if (!registeredData) throw new Error('No registration data found.');
        // await resendOtpApi({ email: registeredData.email });
    };

    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden py-10">
            <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/8" />
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/8" />

                <div className="relative z-10 bg-white w-[560px] flex flex-col shadow-md rounded-lg items-center text-left">
                    {/* Logo — always visible */}
                    <div className="w-[125px] h-[25px] my-10">
                        <img src="/instalogo.png" alt="KC Globed" />
                    </div>

                    {step === 'register' && (
                        <RegisterForm onSuccess={handleRegistered} />
                    )}

                    {step === 'verify' && registeredData && (
                        <>
                            <VerifyOtp
                                email={registeredData.email}
                                onVerified={handleVerified}
                                onVerify={handleVerify}
                                onResend={handleResend}
                            />

                            {/* Back link */}
                            <button
                                onClick={() => setStep('register')}
                                className="flex items-center gap-1.5 text-sm text-[#2F2B3DB2] hover:text-[#7367F0] transition-colors mb-8"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                Back to registration
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SignupPage;