import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useModal } from './ModalContext';
import { cancelActiveSubscriptionApi } from '../../utils/service';
import toast from 'react-hot-toast';

const CancelSubscription = ({ myActivesubscriptionDetails, onSuccess }: any) => {
    const { hideModal } = useModal();
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        if (!myActivesubscriptionDetails?.id) {
            toast.error("Invalid subscription details.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                order_id: myActivesubscriptionDetails.id
            };
            const response = await cancelActiveSubscriptionApi(payload);
            
            toast.success("Subscription cancelled successfully!");
            if (onSuccess) {
                onSuccess();
            }
            hideModal();
        } catch (error: any) {
            console.error("Cancellation error:", error);
            toast.error(error?.message || "Failed to cancel subscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-2 mt-5 max-w-md w-full">
            {/* Header / Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#2d2f31] leading-6 mb-1">
                        Cancel Subscription
                    </h3>
                    <p className="text-sm text-[#6a6f73] leading-relaxed">
                        Are you sure you want to cancel your active <strong>{myActivesubscriptionDetails?.plan_info?.plan_name || 'Starter'} Plan</strong> subscription?
                    </p>
                    <p className="text-xs text-rose-500 font-medium mt-2 leading-relaxed">
                        This action will terminate your active subscription. You will lose access to team member seats and learning history.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F2F4] mt-5">
                <button
                    type="button"
                    disabled={loading}
                    onClick={hideModal}
                    className="px-5 py-2 text-[14px] font-bold text-[#2d2f31] hover:bg-[#f7f9fa] rounded-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Keep Subscription
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={handleCancel}
                    className="px-5 py-2 text-[14px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
            </div>
        </div>
    );
};

export default CancelSubscription;