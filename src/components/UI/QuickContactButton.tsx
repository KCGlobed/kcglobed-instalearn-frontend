import React from "react";
import { useModal } from "../Modals/ModalContext";
import QuickContactForm from "../Forms/QuickContactForm";
import { useLocation } from "react-router-dom";

export default function QuickContactButton() {
    const { showModal } = useModal();
    const location = useLocation();

    const handleOpenContact = () => {
        showModal({
            content: <QuickContactForm />,
            type: "custom",
            size: "lg",
            hideCloseButton: true,
        });
    };

    // Button should only show on home, courses, career, and profile routes
    const showOnRoutes = ["/", "/courses", "/career", "/profile"];
    const shouldShow =
        showOnRoutes.includes(location.pathname) ||
        location.pathname.startsWith("/courses/") ||
        location.pathname.startsWith("/course-details/");

    if (!shouldShow) {
        return null;
    }

    return (
        <button
            onClick={handleOpenContact}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center bg-[#FF9F00] hover:bg-[#E68F00] text-white rounded-l-xl group focus:outline-none w-10 h-36 md:w-11 md:h-40 transition-colors duration-200 cursor-pointer"
            aria-label="Quick Contact"
        >
            <span
                className="text-xs md:text-sm font-bold tracking-wider whitespace-nowrap select-none"
                style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                }}
            >
                Quick Contact
            </span>
        </button>
    );
}

