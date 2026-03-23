import { useEffect, useRef, useState } from "react";
import {
    Bell,
    Heart,
    ShoppingCart,
    ChevronDown,
    Menu,
    X,
    BookOpen,
} from "lucide-react";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";


// ─── Browse Dropdown ──────────────────────────────────────────────────────────

const BrowseDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { categories } = useSelector((state: RootState) => state.homepageCategory);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative", overflow: "visible" }}>
            <button
                onClick={() => setOpen((p) => !p)}
                className={`flex items-center gap-1.5 h-[44px] px-4 text-[14px] font-semibold border transition-all duration-150 whitespace-nowrap ${open
                    ? "border-[#5624D0] text-[#5624D0] bg-[#F5F4FF]"
                    : "border-[#E9EAF0] text-[#1D2026] hover:border-[#5624D0] hover:text-[#5624D0] hover:bg-[#F5F4FF]"
                    }`}
                style={{ borderRadius: "4px" }}
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                Browse
                <ChevronDown
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                />
            </button>

            {/* Category panel */}
            {open && (
                <div
                    className="browse-dropdown bg-white"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        minWidth: 220,
                        zIndex: 9998,
                        border: "1px solid #E9EAF0",
                        borderRadius: "6px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                    }}
                    role="listbox"
                >
                    <div className="px-3 pt-3 pb-1">
                        <span className="text-[10px] font-semibold text-[#8C94A3] uppercase tracking-widest">
                            Categories
                        </span>
                    </div>
                    <ul className="py-1">
                        {categories.length === 0 && (
                            <li className="px-3 py-2 text-[13px] text-[#8C94A3]">Loading…</li>
                        )}
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                role="option"
                                aria-selected={false}
                                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F5F4FF] transition-colors duration-100 group"
                                onClick={() => setOpen(false)}
                            >
                                <BookOpen className="w-4 h-4 text-[#8C94A3] group-hover:text-[#5624D0] transition-colors shrink-0" />
                                <span className="text-[13px] text-[#1D2026] group-hover:text-[#5624D0] font-medium transition-colors">
                                    {cat.name}
                                </span>
                                {cat.total_courses > 0 && (
                                    <span className="ml-auto text-[11px] text-[#8C94A3]">
                                        {cat.total_courses}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileDrawer = ({
    open,
    onClose,
    onSignIn,
}: {
    open: boolean;
    onClose: () => void;
    onSignIn: () => void;
}) => {
    const { categories } = useSelector((state: RootState) => state.homepageCategory);

    // Prevent body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden"
                style={{
                    zIndex: 9990,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                }}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className="fixed top-0 left-0 h-full bg-white flex flex-col lg:hidden"
                style={{
                    width: 280,
                    zIndex: 9995,
                    transform: open ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
                }}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 h-[64px] border-b border-[#E9EAF0] shrink-0">
                    <img
                        src="/instalogo.png"
                        alt="KC Globed"
                        className="h-8 w-auto"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/120x32?text=KC+Globed"; }}
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded text-[#6E7485] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Category list */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 pt-4 pb-2">
                        <span className="text-[10px] font-semibold text-[#8C94A3] uppercase tracking-widest">
                            Browse Categories
                        </span>
                    </div>
                    <ul>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F5F4FF] transition-colors group"
                                onClick={onClose}
                            >
                                <BookOpen className="w-4 h-4 text-[#8C94A3] group-hover:text-[#5624D0] transition-colors shrink-0" />
                                <span className="text-[14px] font-medium text-[#1D2026] group-hover:text-[#5624D0] transition-colors">
                                    {cat.name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Auth buttons in drawer */}
                    <div className="flex flex-col gap-3 px-4 mt-4 pb-6">
                        <Button variant="secondary" title="Sign Up" className="w-full h-[44px] !rounded-sm" />
                        <Button variant="primary" title="Sign In" className="w-full h-[44px] !rounded-sm"
                            onClick={onSignIn}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── MainHeader ───────────────────────────────────────────────────────────────

const MainHeader = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = () => {
        setDrawerOpen(false); // Close drawer if it's open
        navigate('/login');
    };

    return (
        <>
            <header
                className="sticky top-0 w-full bg-white border-b border-[#E9EAF0]"
                style={{ zIndex: 9980, overflow: "visible" }}
            >
                {/* ── Mobile bar (< md) ── */}
                <div
                    className="flex md:hidden items-center gap-2 px-3 h-[60px]"
                    style={{ overflow: "visible" }}
                >
                    {/* Hamburger */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="shrink-0 p-2 rounded text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search — takes all remaining space */}
                    <div className="flex-1 min-w-0" style={{ overflow: "visible" }}>
                        <SearchBar />
                    </div>

                    {/* Cart */}
                    <button
                        className="shrink-0 p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors relative"
                        aria-label="Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Tablet bar (md → lg) ── */}
                <div
                    className="hidden md:flex lg:hidden items-center gap-3 px-4 h-[68px]"
                    style={{ overflow: "visible" }}
                >
                    {/* Logo */}
                    <div className="shrink-0">
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                            className="h-9 w-auto"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/130x36?text=KC+Globed"; }}
                        />
                    </div>

                    {/* Search — fills space */}
                    <div className="flex-1 min-w-0" style={{ overflow: "visible" }}>
                        <SearchBar />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <Bell className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <Heart className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <Button variant="secondary" title="Sign Up" className="h-[38px] px-4 !rounded-sm text-[13px]" />
                        <Button variant="primary" title="Sign In" className="h-[38px] px-4 !rounded-sm text-[13px]"
                            onClick={handleSignIn}
                        />
                    </div>
                </div>

                {/* ── Desktop bar (≥ lg) ── */}
                <div
                    className="hidden lg:flex items-center gap-4 px-6 h-[80px]"
                    style={{ overflow: "visible" }}
                >
                    {/* Logo */}
                    <div className="shrink-0">
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                            className="h-10 w-auto"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/150x40?text=KC+Globed"; }}
                        />
                    </div>

                    {/* Browse */}
                    <div className="shrink-0" style={{ overflow: "visible" }}>
                        <BrowseDropdown />
                    </div>

                    {/* Search — fills space between Browse and right actions */}
                    <div className="flex-1 min-w-0 max-w-[640px]" style={{ overflow: "visible" }}>
                        <SearchBar />
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <Bell className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <Heart className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <button className="p-2 rounded text-[#1D2026] hover:text-[#5624D0] hover:bg-[#F5F4FF] transition-colors">
                            <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
                        </button>

                        <div className="w-px h-6 bg-[#E9EAF0] mx-2" />

                        <Button
                            variant="secondary"
                            title="Sign Up"
                            onClick={() => console.log("Sign Up")}
                            className="h-[44px] px-5 !rounded-sm"
                        />
                        <Button
                            variant="primary"
                            title="Sign In"
                            onClick={handleSignIn}
                            className="h-[44px] px-5 !rounded-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Mobile Drawer (rendered outside header to avoid z-index trapping) */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSignIn={handleSignIn} />
        </>
    );
};

export default MainHeader;
