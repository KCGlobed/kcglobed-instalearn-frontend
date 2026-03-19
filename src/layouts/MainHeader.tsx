import { Search, Bell, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import Button from "../components/Button";

const MainHeader = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E9EAF0] h-[80px] flex items-center">
            <div className="px-6 w-full flex items-center justify-between gap-4">

                {/* Left: Logo & Browse */}
                <div className="flex items-center gap-6">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                            className="h-10 w-auto"
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/150x40?text=KC+Globed';
                            }}
                        />
                    </div>

                    {/* Browse Dropdown */}
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 h-[48px] text-[#4E5566] text-[16px] font-medium border border-[#E9EAF0] hover:bg-gray-50 transition-all">
                            Browse
                            <ChevronDown className="w-4 h-4 text-[#4E5566]" />
                        </button>
                    </div>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-[600px]">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-[20px] h-[20px] text-[#4E5566]" />
                        </div>
                        <input
                            type="text"
                            placeholder="What do you want learn..."
                            className="w-full h-[48px] bg-white border border-[#E9EAF0] pl-11 pr-4 text-[#1D2026] text-[16px] placeholder-[#8C94A3] focus:outline-none focus:border-[#5624D0] transition-all"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button className="text-[#1D2026] hover:text-[#5624D0] transition-all">
                            <Bell className="w-6 h-6 stroke-[1.5px]" />
                        </button>
                        <button className="text-[#1D2026] hover:text-[#5624D0] transition-all">
                            <Heart className="w-6 h-6 stroke-[1.5px]" />
                        </button>
                        <button className="text-[#1D2026] hover:text-[#5624D0] transition-all">
                            <ShoppingCart className="w-6 h-6 stroke-[1.5px]" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            title="Sign Up"
                            onClick={() => console.log("Sign Up")}
                            className="h-[48px] px-6 !rounded-none"
                        />
                        <Button
                            variant="primary"
                            title="Sign In"
                            onClick={() => console.log("Sign In")}
                            className="h-[48px] px-6 !rounded-none"
                        />
                    </div>
                </div>

            </div>
        </header>
    );
};

export default MainHeader;
