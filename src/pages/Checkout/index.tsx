import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import TopHeader from '../../layouts/TopHeader';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import RazorpayButton from '../../components/Payment/RazorpayButton';
import { Lock } from 'lucide-react';
import { getDeviceId } from '../../store/slices/courseCartSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip country code/non-digits and return last 10 digits.
 * +917503643061 → 7503643061
 * 919876543210  → 9876543210
 * 7503643061    → 7503643061
 */
const sanitizePhone = (raw: string | undefined | null): string => {
    if (!raw) return '';
    return raw.replace(/\D/g, '').slice(-10);
};

// ─── FloatingField ─────────────────────────────────────────────────────────
// MUST be defined OUTSIDE CheckoutPage to prevent unmount/remount on every
// parent re-render (which causes the focus-loss / can't-type bug).

interface FloatingFieldProps {
    id: string;
    label: string;
    type?: string;
    registration: UseFormRegisterReturn;
    error?: string;
    maxLength?: number;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    onInput?: React.FormEventHandler<HTMLInputElement>;
}

const FloatingField: React.FC<FloatingFieldProps> = ({
    id,
    label,
    type = 'text',
    registration,
    error,
    maxLength,
    inputMode,
    onInput,
}) => (
    <div className="space-y-1">
        <div className="relative group">
            <input
                {...registration}
                type={type}
                id={id}
                maxLength={maxLength}
                inputMode={inputMode}
                onInput={onInput}
                className={`w-full border-2 p-4 pt-6 pb-2 text-[16px] font-medium rounded-none focus:outline-none focus:border-[#1c1d1f] transition-all peer ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder=" "
                autoComplete="off"
            />
            <label
                htmlFor={id}
                className="absolute left-4 top-2 text-[12px] font-bold text-[#1c1d1f] uppercase tracking-wide transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500
                    peer-focus:top-2 peer-focus:text-[12px] peer-focus:font-bold peer-focus:text-[#1c1d1f]"
            >
                {label}
            </label>
        </div>
        {error && <p className="text-red-500 text-[11px] font-bold mt-1">{error}</p>}
    </div>
);


// ─── CheckoutPage ─────────────────────────────────────────────────────────────

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems: cart, appliedCoupon } = useAppSelector((state: RootState) => state.cart);
    const userID = localStorage.getItem('userID') || '';
    const deviceID = getDeviceId();
    const isLogin = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const { register, watch, formState: { errors, isValid } } = useForm<CheckoutFormData>({
        mode: 'onChange',
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: sanitizePhone(user?.phone),
        },
    });

    const watchedData = watch();

    // Security & Redirect
    // useEffect(() => {
    //     const hasAccess = sessionStorage.getItem('checkout_access');
    //     if (!hasAccess || cart.length === 0) {
    //         navigate('/cart');
    //     }
    // }, [cart.length, navigate]);

    // Price Calculations
    const { totalPrice, originalPrice, discountCount } = useMemo(() => {
        const total = cart.reduce((sum, item) => sum + (item.course_info?.price || 0), 0);
        const original = cart.reduce((sum, item) => sum + Math.round((item.course_info?.price || 0) * 1.8), 0);
        return { totalPrice: total, originalPrice: original, discountCount: original - total };
    }, [cart]);

    // GST Calculation (18% on discounted total)
    const GST_RATE = 0.18;
    const finalSubtotal = appliedCoupon ? appliedCoupon.summary.final_total : totalPrice;
    const gstAmount = Math.round(finalSubtotal * GST_RATE);
    const totalPayable = finalSubtotal + gstAmount;

    // Payload — always send clean 10-digit phone
    const userDataForPayment = {
        first_name: watchedData.first_name || 'Guest',
        last_name: watchedData.last_name || 'User',
        email: watchedData.email,
        phone: sanitizePhone(watchedData.phone) || '9999999999',
        user_id: userID,
        device_id: deviceID,
        coupon_code: appliedCoupon ? appliedCoupon.coupon_code : undefined,
    };

    // Strip non-digits on phone input (native event, doesn't interfere with RHF)
    const handlePhoneInput: React.FormEventHandler<HTMLInputElement> = (e) => {
        const el = e.currentTarget;
        const cleaned = el.value.replace(/\D/g, '').slice(0, 10);
        if (el.value !== cleaned) el.value = cleaned;
    };

    return (
        <div className="min-h-screen bg-[#f7f9fa] font-inter">
            <TopHeader />
            <MainHeader />

            <div className="max-w-[1200px] mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-[#1c1d1f] mb-10">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* ── Main Content ── */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 1. Account / Contact Section */}
                        <section className="bg-white border border-gray-200 p-8 rounded-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-[#1c1d1f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <h2 className="text-xl font-bold text-[#1c1d1f]">
                                    {isLogin ? 'Contact Details' : 'Log in or create an account'}
                                </h2>
                            </div>

                            <div className="pl-9 space-y-6">
                                {isLogin && (
                                    <p className="text-[13px] text-gray-500 -mt-2">
                                        Signed in as{' '}
                                        <span className="font-bold text-[#1c1d1f]">{user?.email}</span>.
                                        {' '}Update your details below if needed.
                                    </p>
                                )}

                                {!isLogin && (
                                    <p className="text-[14px] text-[#2d2f31] leading-relaxed">
                                        An account is required to access your purchased courses. By signing up, you agree to our{' '}
                                        <span className="text-indigo-600 underline cursor-pointer">Terms of Use</span>{' '}and{' '}
                                        <span className="text-indigo-600 underline cursor-pointer">Privacy Policy</span>.
                                    </p>
                                )}

                                {/* Email */}
                                <FloatingField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    registration={register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    error={errors.email?.message}
                                />

                                {/* First & Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FloatingField
                                        id="first_name"
                                        label="First Name"
                                        registration={register('first_name', {
                                            required: 'First name is required',
                                        })}
                                        error={errors.first_name?.message}
                                    />
                                    <FloatingField
                                        id="last_name"
                                        label="Last Name"
                                        registration={register('last_name', {
                                            required: 'Last name is required',
                                        })}
                                        error={errors.last_name?.message}
                                    />
                                </div>

                                {/* Phone */}
                                <FloatingField
                                    id="phone"
                                    label="Phone Number (10 digits)"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    onInput={handlePhoneInput}
                                    registration={register('phone', {
                                        required: 'Phone number is required',
                                        validate: (val) =>
                                            sanitizePhone(val).length === 10 ||
                                            'Enter a valid 10-digit mobile number',
                                    })}
                                    error={errors.phone?.message}
                                />

                                {!isLogin && (
                                    <p className="text-sm font-bold text-[#2d2f31]">No password required</p>
                                )}
                            </div>
                        </section>

                        {/* 2. Order Details */}
                        <section className="bg-white border border-gray-200 p-8 rounded-none shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#1c1d1f] text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold">2</span>
                                    <h2 className="text-[24px] font-bold text-[#1c1d1f]">Order details</h2>
                                </div>
                                <span className="text-gray-500 text-sm font-medium">
                                    {cart.length} course{cart.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="pl-9 space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-6 items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                                    >
                                        <div className="w-24 sm:w-32 aspect-video flex-shrink-0 overflow-hidden border border-gray-100">
                                            <img
                                                src={item.course_info?.image || 'https://placehold.co/200x120?text=Course'}
                                                alt={item.course_info?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#1c1d1f] text-[16px] leading-tight mb-1 line-clamp-2">
                                                {item.course_info?.name}
                                            </h4>
                                            <p className="text-[12px] text-gray-500">
                                                By {item.course_info?.instructor || 'Expert Instructor'}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-[#1c1d1f] text-[16px]">₹{item.course_info?.price}</p>
                                            <p className="text-[13px] text-gray-400 line-through">
                                                ₹{Math.round(item.course_info?.price * 1.8)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-4">
                            <div className="bg-white border border-gray-200 p-8 rounded-none shadow-sm">
                                <h2 className="text-[20px] font-bold text-[#1c1d1f] mb-6">Order summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#6a6f73]">Original Price:</span>
                                        <span className="text-[#2d2f31]">₹{originalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#6a6f73]">Discounts:</span>
                                        <span className="text-green-600 font-medium">-₹{discountCount.toFixed(2)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-[#6a6f73]">Coupon ({appliedCoupon.coupon_code}):</span>
                                            <span className="text-green-600 font-medium">-₹{appliedCoupon.summary.discount_applied.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#6a6f73]">Subtotal:</span>
                                        <span className="text-[#2d2f31] font-medium">₹{finalSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#6a6f73]">GST (18%):</span>
                                        <span className="text-[#2d2f31] font-medium">+₹{gstAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                                        <span className="text-[18px] font-bold text-[#1c1d1f]">Total Payable:</span>
                                        <span className="text-[24px] font-bold text-[#1c1d1f]">₹{totalPayable.toFixed(2)}</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-[#6a6f73] mb-6 leading-relaxed">
                                    InstaLearn is required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
                                </p>

                                <p className="text-[11px] text-[#6a6f73] mb-6">
                                    By completing your purchase, you agree to these{' '}
                                    <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Terms of Service</span>.
                                </p>

                                <RazorpayButton
                                    userData={userDataForPayment}
                                    label="Complete Payment"
                                    disabled={!isValid}
                                    className="w-full !rounded-none !py-4 !text-[16px] !font-bold !bg-[#a435f0] hover:!bg-[#8710d8] transition-all"
                                />

                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-[12px] text-[#6a6f73] font-bold">
                                        <Lock className="w-3 h-3" />
                                        Secure Connection
                                    </div>
                                    <div className="flex gap-4 opacity-50 grayscale">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CheckoutPage;