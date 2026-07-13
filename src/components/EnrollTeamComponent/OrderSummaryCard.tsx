import React, { useState } from 'react';
import { Rocket, Lock } from 'lucide-react';
import type { Plan, CheckoutCalculation } from './types';

interface OrderSummaryCardProps {
  plan: Plan;
  calculations: CheckoutCalculation;
  couponApplied: boolean;
  isProcessing: boolean;
  onApplyCoupon: (code: string) => boolean;
  onPlaceOrder: () => void;
  onChangePlan: () => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = React.memo(({
  plan,
  calculations,
  couponApplied,
  isProcessing,
  onApplyCoupon,
  onPlaceOrder,
  onChangePlan,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const success = onApplyCoupon(couponCode);
    if (!success) {
      setCouponError('Invalid coupon code');
    }
  };

  const formatVal = (val: number) => Math.round(val).toLocaleString('en-IN');
  const sym = calculations.currencySymbol;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">ORDER SUMMARY</h3>
      
      {/* Plan Info Badge */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#A435F0] text-white flex items-center justify-center">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{plan.plan_name} Plan</h4>
            <span className="text-xs text-slate-500 font-medium">
              {plan.plan_type === 3 ? 'Annual Billing' : 'Monthly Billing'}
            </span>
          </div>
        </div>
        <button
          onClick={onChangePlan}
          className="text-xs font-bold text-[#A435F0] hover:text-[#8B1AD3] cursor-pointer transition-colors"
        >
          Change
        </button>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-slate-600 font-medium">
          <span>{plan.no_of_licence} User Seats</span>
          <span>{sym}{formatVal(calculations.seatsPrice)}</span>
        </div>

        {calculations.savings > 0 && (
          <div className="flex justify-between text-indigo-600 font-semibold">
            <span>Annual Savings (20%)</span>
            <span>-{sym}{formatVal(calculations.savings)}</span>
          </div>
        )}

        {couponApplied && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount (SAVE20)</span>
            <span>-{sym}{formatVal(calculations.couponDiscount)}</span>
          </div>
        )}

        <div className="h-[1px] bg-slate-100 my-4" />

        <div className="flex justify-between text-slate-500 text-xs">
          <span>Subtotal</span>
          <span>{sym}{formatVal(calculations.subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-500 text-xs">
          <span>GST (18%)</span>
          <span>+ {sym}{formatVal(calculations.tax)}</span>
        </div>

        <div className="h-[1px] bg-slate-100 my-4" />

        {/* Total Payable */}
        <div className="flex justify-between items-end py-2">
          <div>
            <span className="text-base font-bold text-slate-900 block leading-none">Total Payable</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Billed annually in {plan.currency || 'INR'}</span>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {sym}{formatVal(calculations.total)}
          </span>
        </div>

        {/* Place Secure Order Button */}
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full mt-6 py-3.5 bg-[#A435F0] hover:bg-[#8B1AD3] disabled:bg-[#d89cf8] text-white rounded font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm animate-fade-in-up"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Place Secure Order</span>
              <Lock className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Promotions Form */}
        <form onSubmit={handleApply} className="space-y-1.5 pt-6 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">PROMOTIONS</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError('');
              }}
              placeholder="Enter Coupon"
              className="flex-1 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#A435F0] bg-white text-sm text-slate-800 uppercase"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded font-bold text-xs transition-colors cursor-pointer ${
                couponCode.trim() 
                  ? 'bg-[#A435F0] hover:bg-[#8B1AD3] text-white' 
                  : 'bg-[#D1D5DB] text-white'
              }`}
            >
              Apply
            </button>
          </div>
          {couponError && <span className="text-xs text-red-500 font-medium block mt-1">{couponError}</span>}
          <p className="text-[10px] text-slate-400">Valid coupons will be applied at checkout.</p>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
          By clicking "Place Secure Order", you agree to InstaLearn's{' '}
          <span className="underline hover:text-indigo-600 cursor-pointer">Terms of Service</span> and{' '}
          <span className="underline hover:text-indigo-600 cursor-pointer">Privacy Policy</span>. Your subscription will renew automatically.
        </p>
      </div>
    </div>
  );
});

OrderSummaryCard.displayName = 'OrderSummaryCard';
