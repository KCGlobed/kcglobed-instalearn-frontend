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
import { useAppSelector } from "../hooks/useRedux";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { viewCartDetails } from "../store/slices/courseCartSlice";
import { viewWishlistAction } from "../store/slices/courseWishList";
import { fetchUnreadNotifications, markNotificationAsRead } from "../store/slices/notificationSlice";

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
};
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
    const { unreadCount } = useAppSelector((state: RootState) => state.notification);
    const navigate = useNavigate();

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

                    {/* Notification Link in Mobile */}
                    <div className="px-4 pt-6 pb-2 border-t border-[#E9EAF0] mt-4">
                        <span className="text-[10px] font-semibold text-[#8C94A3] uppercase tracking-widest">
                            Account
                        </span>
                    </div>
                    <ul>
                        <li
                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#F5F4FF] transition-colors group"
                            onClick={() => { navigate('/notifications'); onClose(); }}
                        >
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-[#8C94A3] group-hover:text-[#5624D0] transition-colors shrink-0" />
                                <span className="text-[14px] font-medium text-[#1D2026] group-hover:text-[#5624D0] transition-colors">
                                    Notifications
                                </span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#FF4B2B] text-white text-[10px] font-bold rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </li>
                    </ul>

                    {/* Auth buttons in drawer */}
                    {/* <div className="flex flex-col gap-3 px-4 mt-4 pb-6">

                        <Button variant="secondary" title="Sign Up" className="w-full h-[44px] !rounded-sm" />
                        <Button variant="primary" title="Sign In" className="w-full h-[44px] !rounded-sm"
                            onClick={onSignIn}
                        />
                    </div> */}
                </div>
            </div>
        </>
    );
};

// ─── Notification Dropdown ───────────────────────────────────────────────────
const NotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { notifications, unreadCount, loading } = useAppSelector((state: RootState) => state.notification);
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUnreadNotifications());
        }
    }, [dispatch, isAuthenticated]);

    const handleMarkAsRead = async (id: number) => {
        await dispatch(markNotificationAsRead({ notification_id: [id] }));
    };

    return (
        <div className="relative" ref={dropdownRef} style={{ overflow: "visible" }}>
            <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded transition-all duration-200 relative group ${open ? 'bg-[#F5F4FF] text-[#5624D0]' : 'text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0]'}`}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <Bell className={`w-5 h-5 stroke-[1.5px] ${open ? 'fill-[#5624D0]/10' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4B2B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+12px)] w-[320px] bg-white rounded-[10px] py-1 border border-[#E9EAF0] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[9999]"
                    style={{
                        animation: "browseDropdownIn 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        transformOrigin: "top right"
                    }}
                >
                    <div className="px-5 py-4 border-b border-[#E9EAF0] flex justify-between items-center bg-[#fcfcfd] rounded-t-[10px]">
                        <span className="text-[15px] font-bold text-[#1D2026]">Notifications</span>
                        <button
                            className="text-[12px] font-semibold text-[#5624D0] hover:underline"
                            onClick={() => {
                                // Optional: Mark all as read logic
                                if (notifications.length > 0) {
                                    dispatch(markNotificationAsRead({ notification_id: notifications.map(n => n.id) }));
                                }
                            }}
                        >
                            Mark all as read
                        </button>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                        {loading ? (
                            <div className="px-5 py-10 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5624D0] mx-auto mb-2"></div>
                                <p className="text-[13px] text-[#8C94A3]">Loading notifications...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className="px-5 py-3.5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#F5F4FF]/50 cursor-pointer transition-colors group relative"
                                    onClick={() => {
                                        handleMarkAsRead(n.id);
                                        // navigate if needed, e.g. to course page if course id exists
                                        if (n.course) {
                                            navigate(`/courses/detail/${n.course}`);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="text-[13.5px] font-semibold text-[#1D2026] leading-snug group-hover:text-[#5624D0]">{n.title}</p>
                                        <span className="w-2 h-2 bg-[#5624D0] rounded-full shrink-0 mt-1.5" />
                                    </div>
                                    <p className="text-[12.5px] text-[#6E7485] mt-1 line-clamp-2">{n.description}</p>
                                    <p className="text-[11px] text-[#8C94A3] mt-2 font-medium">{formatTimeAgo(n.created_at)}</p>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <div className="w-12 h-12 bg-[#F5F4FF] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-6 h-6 text-[#8C94A3]" />
                                </div>
                                <p className="text-[14px] font-medium text-[#1D2026]">No new notifications</p>
                                <p className="text-[12px] text-[#8C94A3] mt-1">We'll notify you when something arrives</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-[#fcfcfd] rounded-b-[10px] border-t border-[#E9EAF0]">
                        <button
                            className="w-full py-2.5 text-[13px] font-bold text-[#5624D0] hover:bg-[#F5F4FF] rounded transition-colors"
                            onClick={() => {
                                navigate('/notifications');
                                setOpen(false);
                            }}
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Wishlist Dropdown ───────────────────────────────────────────────────────
const WishlistDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { wishListItems, loading } = useAppSelector((state: RootState) => state.wishList);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        dispatch(viewWishlistAction());
    }, [dispatch]);

    return (
        <div className="relative" ref={dropdownRef} style={{ overflow: "visible" }}>
            <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded transition-all duration-200 relative group ${open ? 'bg-[#F5F4FF] text-[#5624D0]' : 'text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0]'}`}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <Heart className={`w-5 h-5 stroke-[1.5px] ${open ? 'fill-[#5624D0]/10' : ''}`} />
                {wishListItems.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF4B2B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                        {wishListItems.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+12px)] w-[300px] bg-white rounded-[10px] py-1 border border-[#E9EAF0] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[9999]"
                    style={{
                        animation: "browseDropdownIn 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        transformOrigin: "top right"
                    }}
                >
                    <div className="px-5 py-4 border-b border-[#E9EAF0] bg-[#fcfcfd] rounded-t-[10px]">
                        <span className="text-[15px] font-bold text-[#1D2026]">Wishlist</span>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                        {loading ? (
                            <div className="px-5 py-10 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5624D0] mx-auto mb-2"></div>
                                <p className="text-[14px] text-[#6E7485]">Loading...</p>
                            </div>
                        ) : wishListItems.length > 0 ? (
                            wishListItems.map((item: any) => (
                                <div key={item.id} onClick={() => { navigate(`/courses/detail/${item.course_info?.id}`); setOpen(false); }} className="px-5 py-3.5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#F5F4FF]/50 cursor-pointer transition-colors flex gap-3">
                                    <img src={item.course_info?.image} alt={item.course_info?.name} className="w-16 h-9 object-cover rounded bg-[#F5F4FF]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-[#1D2026] leading-tight truncate">{item.course_info?.name}</p>
                                        <p className="text-[13px] font-bold text-[#1D2026] mt-1">₹{item.course_info?.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-[14px] text-[#6E7485]">Your wishlist is empty.</p>
                                <button className="mt-2 text-[#5624D0] text-[13px] font-bold hover:underline" onClick={() => setOpen(false)}>Explore courses</button>
                            </div>
                        )}
                    </div>

                    {wishListItems.length > 0 && (
                        <div className="p-3 bg-[#fcfcfd] rounded-b-[10px] border-t border-[#E9EAF0]">
                            <button className="w-full py-2.5 text-[14px] font-bold text-white bg-[#5624D0] hover:bg-[#461DA5] rounded transition-colors" onClick={() => { navigate('/my-learning?tab=wishlist'); setOpen(false); }}>
                                Go to Wishlist
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Cart Dropdown ───────────────────────────────────────────────────────────
const CartDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { cartItems: cart, loading: cartLoading, error: cartError } = useAppSelector((state: RootState) => state.cart);
    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        dispatch(viewCartDetails());
    }, []);


    console.log(cart, "cart");

    const handleCartPage = () => {
        navigate("/cart")
    }

    return (
        <div className="relative" ref={dropdownRef} style={{ overflow: "visible" }}>
            <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded transition-all duration-200 relative group ${open ? 'bg-[#F5F4FF] text-[#5624D0]' : 'text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0]'}`}
                aria-expanded={open}
                aria-label="Cart"
                aria-haspopup="menu"
            >
                <ShoppingCart className={`w-5 h-5 stroke-[1.5px] ${open ? 'fill-[#5624D0]/10' : ''}`} />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#5624D0] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                    {cart.length}
                </span>
            </button>

            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+12px)] w-[300px] bg-white rounded-[10px] py-1 border border-[#E9EAF0] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[9999]"
                    style={{
                        animation: "browseDropdownIn 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        transformOrigin: "top right"
                    }}
                >
                    <div className="px-5 py-4 border-b border-[#E9EAF0] bg-[#fcfcfd] rounded-t-[10px]">
                        <span className="text-[15px] font-bold text-[#1D2026]">Cart</span>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                        {cart.length > 0 ? (
                            cart.map((item: any) => (
                                <div key={item.course_info?.id} className="px-5 py-3.5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#F5F4FF]/50 cursor-pointer transition-colors flex gap-3">
                                    <img src={item.course_info?.image} alt={item.course_info?.title} className="w-16 h-9 object-cover rounded bg-[#F5F4FF]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-[#1D2026] leading-tight truncate">{item.course_info?.name}</p>
                                        <p className="text-[11px] text-[#6E7485] mt-0.5 truncate">{item.course_info?.instructor}</p>
                                        <p className="text-[13px] font-bold text-[#1D2026] mt-1">₹{item.course_info?.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-[14px] text-[#6E7485]">Your cart is empty.</p>
                                <button className="mt-2 text-[#5624D0] text-[13px] font-bold hover:underline" onClick={() => setOpen(false)}>Keep shopping</button>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-4 bg-[#fcfcfd] rounded-b-[10px] border-t border-[#E9EAF0]">
                            <div className="flex justify-between items-center mb-4 px-1">
                                <span className="text-[14px] font-medium text-[#1D2026]">Total:</span>
                                <span className="text-[16px] font-bold text-[#1D2026]">₹{cart.reduce((total, item) => total + item.course_info?.price, 0)}</span>
                            </div>
                            <button onClick={() => { handleCartPage(); setOpen(false) }} className="w-full py-2.5 text-[14px] font-bold text-white bg-[#5624D0] hover:bg-[#461DA5] rounded transition-colors" >
                                Go to Cart
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Profile Dropdown ────────────────────────────────────────────────────────
const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { unreadCount } = useAppSelector((state: RootState) => state.notification);
    const userProfile = localStorage.getItem("userProfile") as any;
    const userName = JSON.parse(userProfile).first_name?.charAt(0).toUpperCase() + JSON.parse(userProfile).last_name?.charAt(0).toUpperCase();

    const onLogoutClick = () => {
        dispatch(logout());
        navigate('/');
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div className="relative" ref={dropdownRef} style={{ overflow: "visible" }}>
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-[#5624D0] text-white flex items-center justify-center font-bold text-[15px] hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#5624D0]/40 shrink-0"
                aria-expanded={open}
                aria-haspopup="menu"
            >
                {userName}
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-white rounded-[10px] py-1 border border-[#E9EAF0] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[9999]"
                    style={{
                        animation: "browseDropdownIn 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        transformOrigin: "top right" // expanding out from the avatar
                    }}
                >
                    {/* Header: User Info */}
                    <div className="px-5 py-4 bg-[#fcfcfd] border-b border-[#E9EAF0] mt-[-4px] rounded-t-[10px] mb-2">
                        <p className="text-[15px] font-bold text-[#1D2026] leading-tight mb-0.5">{JSON.parse(userProfile).first_name} {JSON.parse(userProfile).last_name}</p>
                        <p className="text-[13px] text-[#6E7485] font-medium truncate">{JSON.parse(userProfile).email}</p>
                    </div>

                    {/* Group 1 */}
                    <div className="py-1">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/my-learning'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">My Learning</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cart'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">My Cart</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/my-learning?tab=wishlist'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Wishlist</a>
                    </div>

                    {/* <div className="h-px bg-[#E9EAF0] my-1 mx-5" /> */}

                    {/* Group 2 */}
                    {/* <div className="py-1">
                        <a href="#" onClick={(e) => e.preventDefault()} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Refer a Friend</a>
                        <a href="#" onClick={(e) => e.preventDefault()} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Teach on Platform</a>
                    </div> */}

                    <div className="h-px bg-[#E9EAF0] my-1 mx-5" />

                    {/* Group 3 */}
                    <div className="py-1">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/notifications'); setOpen(false); }} className="flex justify-between items-center px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">
                            <span>Notifications</span>
                            {unreadCount > 0 && <span className="px-1.5 py-0.5 bg-[#FF4B2B] text-white text-[10px] font-bold rounded-full">{unreadCount}</span>}
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile?tab=notifications'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Notification Preferences</a>
                    </div>

                    <div className="h-px bg-[#E9EAF0] my-1 mx-5" />


                    {/* Group 4 */}
                    <div className="py-1 pb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile?tab=profile'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Account Settings</a>
                        {/* <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile?tab=payment'); setOpen(false); }} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Payment Methods</a> */}
                        <a href="#" onClick={(e) => onLogoutClick()} className="block px-5 py-2.5 text-[14px] font-medium text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0] transition-colors">Log out</a>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── MainHeader ───────────────────────────────────────────────────────────────

const MainHeader = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((s: RootState) => s.auth);
    // Toggle this to test logged in vs logged out UI
    const isLoggedIn = isAuthenticated;

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
                    <CartDropdown />
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
                        <NotificationDropdown />
                        <WishlistDropdown />
                        <CartDropdown />

                        <div className="w-px h-5 bg-[#E9EAF0] mx-1" />

                        {isLoggedIn ? (
                            <ProfileDropdown />
                        ) : (
                            <>
                                <Button variant="secondary" title="Sign Up" className="h-[38px] px-4 !rounded-sm text-[13px]" />
                                <Button variant="primary" title="Sign In" className="h-[38px] px-4 !rounded-sm text-[13px]"
                                    onClick={handleSignIn}
                                />
                            </>
                        )}
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
                            className="h-10 w-auto cursor-pointer"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/150x40?text=KC+Globed"; }}
                            onClick={() => navigate('/')}
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
                        <NotificationDropdown />
                        <WishlistDropdown />
                        <CartDropdown />

                        <div className="w-px h-6 bg-[#E9EAF0] mx-2" />

                        {isLoggedIn ? (
                            <ProfileDropdown />
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Drawer (rendered outside header to avoid z-index trapping) */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSignIn={handleSignIn} />
        </>
    );
};

export default MainHeader;
