import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  show: boolean;
  companyName: string;
  billingEmail: string;
  onNavigate: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = React.memo(({
  show,
  companyName,
  billingEmail,
  onNavigate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-100 shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Subscription Confirmed!</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Congratulations! Your team subscription for <span className="font-semibold text-slate-800">{companyName}</span> is now active. We've sent a receipt and activation instructions to <span className="font-semibold text-[#A435F0]">{billingEmail}</span>.
        </p>

        <button
          onClick={onNavigate}
          className="w-full py-3 bg-[#A435F0] hover:bg-[#8B1AD3] text-white rounded font-bold transition-all shadow-md cursor-pointer"
        >
          Go to Corporate Dashboard
        </button>
      </div>
    </div>
  );
});

SuccessModal.displayName = 'SuccessModal';
