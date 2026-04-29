import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface PaymentFailedModalProps {
  message?: string;
  onRetry: () => void;
  onClose: () => void;
}

const PaymentFailedModal: React.FC<PaymentFailedModalProps> = ({ 
  message = "We couldn't verify your transaction. Please try again.", 
  onRetry,
  onClose
}) => {
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-900/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center max-w-sm w-full relative overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10 flex flex-col items-center w-full">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8 border border-rose-100">
            <AlertCircle className="w-14 h-14 text-rose-500" />
          </div>
          
          <h3 className="text-3xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
            Payment Failed
          </h3>
          <p className="text-gray-500 text-center font-medium mb-10 leading-relaxed">
            {message}
          </p>
          
          <div className="flex flex-col w-full gap-4">
            <button
              onClick={onRetry}
              className="group flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-200"
            >
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold py-2 transition-colors uppercase tracking-widest text-xs"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentFailedModal;
