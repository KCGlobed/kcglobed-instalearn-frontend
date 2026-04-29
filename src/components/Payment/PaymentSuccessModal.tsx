import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PaymentSuccessModal: React.FC = () => {
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-900/70 backdrop-blur-md">
      <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center max-w-sm w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-inner">
          <CheckCircle className="w-14 h-14 text-green-500 animate-bounce" />
        </div>

        <h3 className="text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
          Payment Verified Successfully
        </h3>
        <p className="text-gray-500 text-center font-semibold text-lg">
          Redirecting to My Learning...
        </p>

        <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce"></span>
          </div>
          <span className="text-indigo-600 font-bold flex items-center gap-2">
            Almost there <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentSuccessModal;
