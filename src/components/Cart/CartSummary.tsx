import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import RazorpayButton from '../Payment/RazorpayButton';
import { getDeviceId } from '../../store/slices/courseCartSlice';

interface CartSummaryProps {
    totalPrice: number;
    originalPrice: number;
    discountCount: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, originalPrice, discountCount }) => {
    const navigate = useNavigate()
    const isLogin = useSelector((state: RootState) => state.auth.isAuthenticated);

    const userID = localStorage.getItem("userID") || "";
    const deviceID = getDeviceId();

    // In a real application, these should come from your user profile state/store
    const userData = {
        first_name: "Harish", // Should be dynamic
        last_name: "Kumar",   // Should be dynamic
        email: "[EMAIL_ADDRESS]", // Should be dynamic
        phone: "9915039343",  // Should be dynamic
        user_id: userID,
        device_id: deviceID,
        billing_address: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    };

    const handleCheckOut = () => {
        sessionStorage.setItem('checkout_access', 'true');
        navigate("/checkout");
    };


    return (
        <div className="lg:sticky lg:top-8 bg-white border border-gray-100 rounded-md p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Total:</h2>
            <div className="mb-6">
                <p className="text-[32px] font-bold text-[#1c1d1f] leading-none mb-1">₹{totalPrice}</p>
                {discountCount > 0 && (
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[14px] text-gray-400 line-through">₹{originalPrice}</p>
                        <p className="text-[14px] text-[#1c1d1f] font-medium">{Math.round((discountCount / originalPrice) * 100)}% off</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleCheckOut}
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold py-3.5 rounded transition-colors text-[16px] active:scale-[0.98] shadow-md mb-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Checkout
            </button>

            <div className="pt-5 border-t border-gray-100">
                <h3 className="text-[13px] font-bold text-[#1c1d1f] mb-3 uppercase tracking-tight">Promotions</h3>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Enter Coupon"
                        className="flex-1 border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-gray-900 rounded-sm min-w-0"
                    />
                    <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 text-[13px] font-bold rounded-sm transition-colors flex-shrink-0">
                        Apply
                    </button>
                </div>
                <p className="text-[11px] text-gray-500 italic">Valid coupons will be applied at checkout.</p>
            </div>
        </div>
    );
};

export default CartSummary;
