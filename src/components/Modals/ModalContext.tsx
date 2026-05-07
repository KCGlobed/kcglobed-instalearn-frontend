// src/context/ModalContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type ModalType = "default" | "success" | "error" | "custom";
type ModalSize = "sm" | "md" | "lg" | "xl" | "xxl";

interface ModalData {
    title?: string;
    content: ReactNode;
    type?: ModalType;
    size?: ModalSize;
}

interface ModalContextType {
    showModal: (data: ModalData) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within ModalProvider");
    return context;
};

const getSizeClass = (size: ModalSize = "md") => {
    switch (size) {
        case "sm":
            return "max-w-sm";
        case "md":
            return "max-w-md";
        case "lg":
            return "max-w-3xl";
        case "xl":
            return "max-w-5xl";
        case "xxl":
            return "max-w-7xl";
        default:
            return "max-w-md";
    }
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const showModal = (data: ModalData) => setModalData(data);
    const hideModal = () => setModalData(null);

    // Lock body scroll when modal is open; restore on close or unmount
    useEffect(() => {
        if (modalData) {
            // Preserve current scroll position to avoid layout shift
            const scrollY = window.scrollY;
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";

            return () => {
                document.body.style.overflow = "";
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                // Restore exact scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [modalData]);

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modalData && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto"
                    onClick={(e) => { if (e.target === e.currentTarget) hideModal(); }}
                >
                    <div
                        className={`rounded-xl shadow-2xl w-full relative my-auto max-h-[90vh] flex flex-col ${modalData.type === 'custom'
                                ? 'bg-transparent overflow-hidden'
                                : 'bg-white overflow-y-auto'
                            } ${getSizeClass(modalData.size)}`}
                    >
                        <button
                            onClick={hideModal}
                            className={`absolute cursor-pointer top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${modalData.type === 'custom'
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-100'
                                }`}
                        >
                            ✕
                        </button>
                        {modalData.title && (
                            <h2 className="text-xl font-semibold mb-4 text-center px-6 pt-6">{modalData.title}</h2>
                        )}
                        <div className={modalData.type !== 'custom' ? 'overflow-y-auto flex-1 px-6 pb-6' : ''}>
                            {modalData.content}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
