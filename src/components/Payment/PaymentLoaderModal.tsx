import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface PaymentLoaderModalProps {
  message: string;
}

const PaymentLoaderModal: React.FC<PaymentLoaderModalProps> = ({ message }) => {
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-900/70 backdrop-blur-md p-4">
      <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center max-w-sm w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-30 scale-150"></div>
          <div className="bg-indigo-50 p-5 rounded-full relative z-10 border border-indigo-100">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight text-center">
          Secure Processing
        </h3>
        <p className="text-gray-500 text-center font-medium animate-pulse text-lg">
          {message}
        </p>
        
        <div className="mt-10 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-full animate-[loading_1.5s_infinite] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Bank-grade Security
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default PaymentLoaderModal;
