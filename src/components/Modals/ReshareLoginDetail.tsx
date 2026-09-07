import React, { useState } from "react";
import { Key, ShieldAlert, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useModal } from "./ModalContext";
import { reshareUserLoginDetail } from "../../utils/service";

interface ReshareLoginDetailProps {
    userId: number;
    userName: string;
    member: any;
}

const ReshareLoginDetail = ({ userId, userName, member }: ReshareLoginDetailProps) => {
    const { hideModal } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReshare = async () => {
        try {
            setIsSubmitting(true);
            const payload = {
                user_id: userId
            };
            const response = await reshareUserLoginDetail(payload);
            if (response?.success ?? true) {
                toast.success(response?.message || "Credentials shared successfully!");
                hideModal();
            } else {
                toast.error(response?.message || "Failed to share credentials.");
            }
        } catch (error: any) {
            console.error("Reshare failed:", error);
            toast.error(error?.message || "An error occurred while sharing credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative pt-4 w-full max-w-md mx-auto">
            {/* Top glowing line */}
            <div className="absolute -top-6 -left-6 -right-6 h-1.5 bg-gradient-to-r from-indigo-500 via-[#A8A1F8] to-[#8F85F3] rounded-t-xl" />

            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <Key className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-bold text-[#2F2B3D] tracking-tight">Reshare Credentials</h3>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal pl-8">
                        Resend the login details to <span className="font-semibold text-[#2F2B3D]">{userName}</span>
                    </p>
                </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h5 className="text-xs font-bold text-amber-800">Please Note</h5>
                    <p className="text-[10.5px] text-amber-700 mt-1 leading-relaxed">
                        This action will resend the welcome email containing the initial credentials/login information to the employee's registered email address: <span className="font-semibold">{member?.email || 'N/A'}</span>.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={hideModal}
                    className="h-9 px-4 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleReshare}
                    className="h-9 px-4 bg-perple hover:bg-[#5e50eb] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Share Again</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReshareLoginDetail;