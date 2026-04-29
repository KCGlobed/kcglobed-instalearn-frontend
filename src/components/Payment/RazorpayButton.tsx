import React from 'react';
import { useRazorpayPayment } from '../../hooks/useRazorpayPayment';
import PaymentLoaderModal from './PaymentLoaderModal';
import PaymentSuccessModal from './PaymentSuccessModal';
import PaymentFailedModal from './PaymentFailedModal';

interface RazorpayButtonProps {
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    billing_address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    user_id: string;
    device_id: string;
  };
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable Razorpay Payment Button Component with Full Flow Management
 */
const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  userData,
  label = "Checkout",
  className = "",
  disabled = false
}) => {
  const { initiatePayment, status, isLoading, errorMessage, resetPayment } = useRazorpayPayment();

  const handlePaymentClick = async () => {
    await initiatePayment(userData);
  };

  return (
    <>
      <button
        onClick={handlePaymentClick}
        disabled={isLoading || status === 'paying' || disabled}
        className={`group relative flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg ${className} ${
          (isLoading || status === 'paying' || disabled)
            ? 'opacity-60 cursor-not-allowed bg-gray-400'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
          } text-white font-bold py-4 px-8 rounded-2xl`}
      >
        {isLoading || status === 'paying' ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="tracking-wide">Processing...</span>
          </>
        ) : (
          <span className="tracking-wide">{label}</span>
        )}
      </button>

      {/* 1. Initializing State */}
      {status === 'initializing' && (
        <PaymentLoaderModal message="Initializing Payment..." />
      )}

      {/* 2. Verifying State */}
      {status === 'verifying' && (
        <PaymentLoaderModal message="Verifying Your Payment..." />
      )}

      {/* 3. Success State */}
      {status === 'success' && (
        <PaymentSuccessModal />
      )}

      {/* 4. Failed State */}
      {status === 'failed' && (
        <PaymentFailedModal 
          message={errorMessage || undefined}
          onRetry={handlePaymentClick}
          onClose={resetPayment}
        />
      )}
    </>
  );
};

export default RazorpayButton;
