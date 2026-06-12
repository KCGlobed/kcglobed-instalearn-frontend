import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            setIsVisible(scrolled > 300);

            const docHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                document.documentElement.offsetHeight,
                document.body.offsetHeight
            );
            const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            const totalScrollable = docHeight - winHeight;

            if (totalScrollable > 0) {
                const progress = (scrolled / totalScrollable) * 100;
                setScrollProgress(Math.min(100, Math.max(0, progress)));
            } else {
                setScrollProgress(0);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const radius = 22.5;
    const circumference = 2 * Math.PI * radius; // ~141.37
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-500 ease-in-out ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-y-6 scale-75 pointer-events-none"
            } hover:scale-110 active:scale-95 group focus:outline-none`}
            style={{
                boxShadow: isVisible 
                    ? "0 10px 25px -5px rgba(86, 36, 208, 0.3), 0 8px 10px -6px rgba(86, 36, 208, 0.3)" 
                    : "none"
            }}
            aria-label="Scroll to top"
        >
            {/* SVG Radial Progress Ring */}
            <svg 
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 50 50"
            >
                <defs>
                    <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7367F0" />
                        <stop offset="100%" stopColor="#5624D0" />
                    </linearGradient>
                </defs>
                {/* Background track circle */}
                <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    className="stroke-gray-200/80 dark:stroke-slate-800/80 fill-none"
                    strokeWidth="3"
                />
                {/* Active progress circle */}
                <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    className="fill-none transition-all duration-100 ease-out"
                    strokeWidth="3"
                    stroke="url(#scrollProgressGradient)"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Inner Floating Button - glassmorphic & hover states */}
            <div className="absolute inset-[4px] flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-all duration-300 group-hover:bg-[#5624D0] border border-white/40 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.06)]">
                <ChevronUp 
                    className="w-5 h-5 text-[#5624D0] group-hover:text-white transition-all duration-300 group-hover:scale-110" 
                    strokeWidth={2.5} 
                />
            </div>
        </button>
    );
};

export default ScrollToTop;