import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { getDeviceId, applyCouponSuccess, removeCoupon } from '../../store/slices/courseCartSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { validateCouponApi } from '../../utils/service';
import toast from 'react-hot-toast';

interface CartSummaryProps {
    totalPrice: number;
    originalPrice: number;
    discountCount: number;
}

const GST_RATE = 0.18;

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, originalPrice, discountCount }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { appliedCoupon } = useSelector((state: RootState) => state.cart);

    const userID = localStorage.getItem("userID") || "";
    const deviceID = getDeviceId();

    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponMessage(null);
        try {
            const response = await validateCouponApi({
                device_id: deviceID,
                code: couponInput.trim()
            });
            if (response && response.success) {
                dispatch(applyCouponSuccess(response.data));
                setCouponMessage({ text: 'Coupon applied successfully!', isError: false });
                setCouponInput('');
                toast.success(response?.message || 'Coupon applied successfully!');
            } else {
                setCouponMessage({ text: response?.message || 'Invalid coupon code', isError: true });
                dispatch(removeCoupon());
                toast.error(response?.message || 'Invalid coupon code');
            }
        } catch (error: any) {
            setCouponMessage({ text: error.message || 'Failed to validate coupon', isError: true });
            dispatch(removeCoupon());
            toast.error(error.message || 'Failed to validate coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponMessage(null);
        setCouponInput('');
    };

    const handleCheckOut = () => {
        sessionStorage.setItem('checkout_access', 'true');
        navigate("/checkout");
    };

    // GST Calculation (18% on discounted/final total)
    const finalSubtotal = appliedCoupon ? appliedCoupon.summary.final_total : totalPrice;
    const gstAmount = Math.round(finalSubtotal * GST_RATE);
    const totalPayable = finalSubtotal + gstAmount;

    return (
        <div className="lg:sticky lg:top-8 bg-white border border-gray-100 rounded-md p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Order Summary</h2>
            <div className="mb-6">
                {/* Original & Discount */}
                {discountCount > 0 && (
                    <div className="flex flex-col gap-0.5 mb-3">
                        <p className="text-[14px] text-gray-400 line-through">₹{originalPrice}</p>
                        <p className="text-[14px] text-[#1c1d1f] font-medium">{Math.round((discountCount / originalPrice) * 100)}% off</p>
                    </div>
                )}

                {/* Price Breakdown */}
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center text-[13px] text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{totalPrice}</span>
                    </div>
                    {appliedCoupon && (
                        <div className="flex justify-between items-center text-[13px] text-green-700">
                            <span>Coupon ({appliedCoupon.coupon_code})</span>
                            <span className="font-medium">- ₹{appliedCoupon.summary.discount_applied}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-[13px] text-gray-600">
                        <span>GST (18%)</span>
                        <span className="font-medium text-[#1c1d1f]">+ ₹{gstAmount}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                        <span className="text-[15px] font-bold text-[#1c1d1f]">Total Payable</span>
                        <span className="text-[22px] font-bold text-[#1c1d1f]">₹{totalPayable}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckOut}
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-3.5 rounded transition-colors text-[16px] active:scale-[0.98] shadow-md mb-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Checkout
            </button>

            <div className="pt-5 border-t border-gray-100">
                <h3 className="text-[13px] font-bold text-[#1c1d1f] mb-3 uppercase tracking-tight">Promotions</h3>

                {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between text-[13px] text-green-800 mb-3">
                        <div>
                            <span className="font-bold">{appliedCoupon.coupon_code}</span> applied!
                            <div className="text-[11px] text-green-600 font-medium">Saved ₹{appliedCoupon.summary.discount_applied}</div>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-[11px] font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-tight ml-2 border border-red-200 hover:border-red-400 bg-white px-2 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Enter Coupon"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            disabled={couponLoading}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            className="flex-1 border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-gray-900 rounded-sm min-w-0 disabled:bg-gray-50"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponInput.trim()}
                            className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-4 py-2 text-[13px] font-bold rounded-sm transition-colors flex-shrink-0 flex items-center justify-center min-w-[70px]"
                        >
                            {couponLoading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : 'Apply'}
                        </button>
                    </div>
                )}

                {couponMessage && (
                    <p className={`text-[12px] font-semibold mb-3 ${couponMessage.isError ? 'text-red-600' : 'text-green-600'}`}>
                        {couponMessage.text}
                    </p>
                )}

                <p className="text-[11px] text-gray-500 italic">Valid coupons will be applied at checkout.</p>
            </div>
        </div>
    );
};

export default CartSummary;
