import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useModal } from './ModalContext';

interface DeleteModalProps {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    title = 'Delete Item',
    description = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
}) => {
    const { hideModal } = useModal();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            hideModal();
        } catch (error) {
            console.error('Failed to confirm deletion:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-2 mt-5  max-w-md w-full">
            {/* Header / Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#2d2f31] leading-6 mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-[#6a6f73] leading-relaxed">
                        {description}
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
                    {cancelText}
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirm}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-[#d1d7dc] text-white text-[14px] font-bold rounded-sm transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed min-w-[100px]"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Trash2 size={15} />
                            <span>{confirmText}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;