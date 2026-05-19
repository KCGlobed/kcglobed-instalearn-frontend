import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { storeRefreshToken, storeToken, storeUserID, storeUserProfile, storeUserRole } from '../../utils/tokenStorage';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { restoreAuth } from '../../store/slices/authSlice';

interface VerifyOtpProps {
    email: string;
    onVerified: () => void;
    onResend: () => Promise<void>;
    onVerify: (otp: string) => Promise<void>;
}

const VerifyOtp = ({ email, onVerified, onResend, onVerify }: VerifyOtpProps) => {
    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const dispatch = useAppDispatch();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendCooldown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const focusInput = (index: number) => {
        if (index >= 0 && index < OTP_LENGTH) {
            inputRefs.current[index]?.focus();
        }
    };

    const handleChange = (index: number, value: string) => {
        // Accept only digits
        const digit = value.replace(/\D/g, '').slice(-1);
        if (!digit && value !== '') return;

        setError('');
        const updated = [...otp];
        updated[index] = digit;
        setOtp(updated);

        if (digit && index < OTP_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const updated = [...otp];
            if (otp[index]) {
                updated[index] = '';
                setOtp(updated);
            } else if (index > 0) {
                updated[index - 1] = '';
                setOtp(updated);
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;

        const updated = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((char, i) => {
            updated[i] = char;
        });
        setOtp(updated);
        // Focus the next empty or last input
        const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        focusInput(nextIndex);
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length < OTP_LENGTH) {
            setError('Please enter all 6 digits.');
            return;
        }
        setIsVerifying(true);
        setError('');
        try {
            let response: any = await onVerify(otpValue);
            console.log(response);
            const { access, refresh }: any = response?.data.token;
            storeToken(access);
            storeRefreshToken(refresh);
            storeUserID(response?.data?.user_id);
            storeUserRole(response?.data?.user_role); // Store user role in localStorage
            storeUserProfile(JSON.stringify(response?.data));
            dispatch(restoreAuth(response?.data.token))

            onVerified();
        } catch (err: any) {
            setError(err?.message || 'Invalid OTP. Please try again.');
            // Shake + clear on error
            setOtp(Array(OTP_LENGTH).fill(''));
            setTimeout(() => focusInput(0), 50);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || isResending) return;
        setIsResending(true);
        setError('');
        try {
            await onResend();
            setOtp(Array(OTP_LENGTH).fill(''));
            setCanResend(false);
            setResendCooldown(60);
            setTimeout(() => focusInput(0), 50);
        } catch (err: any) {
            setError(err?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length));
    const isFilled = otp.every((d) => d !== '');

    return (
        <div className="flex flex-col items-center w-full px-10">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-[#7367F0]/10 flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7367F0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center">
                <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold mb-1">Verify your email ✉️</h3>
                <p className="text-[#2F2B3DB2] text-[14px] leading-snug">
                    We sent a 6-digit code to{' '}
                    <span className="font-medium text-[#2F2B3DE5]">{maskedEmail}</span>.
                    <br />Enter it below to confirm your account.
                </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2.5 mb-5">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        onFocus={(e) => e.target.select()}
                        className={`
                            w-[42px] h-[48px] text-center text-[18px] font-semibold rounded-md border
                            outline-none transition-all duration-150 caret-[#7367F0]
                            ${error
                                ? 'border-red-400 bg-red-50 text-red-600'
                                : digit
                                    ? 'border-[#7367F0] bg-[#7367F0]/5 text-[#7367F0]'
                                    : 'border-gray-300 text-[#2F2B3DE5]'
                            }
                            focus:border-[#7367F0] focus:ring-2 focus:ring-[#7367F0]/20
                        `}
                        aria-label={`OTP digit ${i + 1}`}
                        autoFocus={i === 0}
                    />
                ))}
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-[12px] mb-3 text-center">{error}</p>
            )}

            {/* Verify Button */}
            <button
                onClick={handleVerify}
                disabled={isVerifying || !isFilled}
                className={`
                    w-full h-[38px]
                    ${isVerifying || !isFilled
                        ? 'bg-[#7367F0]/50 cursor-not-allowed'
                        : 'bg-[#7367F0] hover:bg-[#5f50e1] active:scale-[0.98]'
                    }
                    text-white rounded font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2
                `}
            >
                {isVerifying ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Verifying…
                    </>
                ) : 'Verify Email'}
            </button>

            {/* Resend */}
            <div className="flex items-center gap-1.5 mt-4 mb-2 text-sm text-[#2F2B3DB2]">
                <span>Didn't receive the code?</span>
                {canResend ? (
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-[#7367F0] font-medium hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Sending…' : 'Resend'}
                    </button>
                ) : (
                    <span className="text-[#7367F0] font-medium tabular-nums">
                        Resend in {resendCooldown}s
                    </span>
                )}
            </div>
        </div>
    );
};

export default VerifyOtp;