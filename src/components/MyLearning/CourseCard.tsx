import React, { useState } from 'react';
import { Play, MoreVertical, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CourseCardProps {
    course: any;
    type?: 'enrolled' | 'wishlist';
    onRemove?: (e: React.MouseEvent) => void;
    onAddToCart?: (e: React.MouseEvent) => void;
    isInCart?: boolean;
    menuContent?: React.ReactNode;
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    type = 'enrolled',
    onRemove,
    onAddToCart,
    isInCart,
    menuContent
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Enrolled Card View
    if (type === 'enrolled') {
        return (
            <div
                className={`group bg-white rounded-[4px] border border-[#E9EAF0] transition-all duration-300 flex flex-col h-full relative ${isMenuOpen ? 'z-50 shadow-2xl' : 'z-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:z-20'}`}
            >
                {/* Image Section */}
                <div onClick={() => navigate(`/learning/dashboard/${course.id}`)} className=" cursor-pointer relative aspect-video overflow-hidden rounded-t-[4px] bg-gray-100">
                    <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 fill-white" />
                        </div>
                    </div>
                </div>

                {/* Hover-Triggered Menu */}
                {menuContent && (
                    <div
                        className="absolute top-3 right-3 z-[60]"
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <button
                            className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-all ${isMenuOpen ? 'bg-white text-[#1D2026] shadow-lg' : 'bg-black/20 text-white hover:bg-white hover:text-[#1D2026]'}`}
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {isMenuOpen && menuContent && (
                            <div className="absolute right-0 top-10">
                                {menuContent}
                            </div>
                        )}
                    </div>
                )}

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1">
                    <Link to={`/learning/dashboard/${course.id}`} className="hover:text-[#5624D0] transition-colors">
                        <h3 className="text-[15px] font-bold text-[#1D2026] line-clamp-2 leading-snug mb-2">
                            {course.name}
                        </h3>
                    </Link>
                    <p className="text-[12px] text-[#6E7485] line-clamp-2 mb-4 flex-1">
                        {course.short_description?.replace(/<[^>]*>?/gm, '') || "No description available"}
                    </p>

                    {/* Progress Section */}
                    <div className="space-y-2 mt-auto pt-4 border-t border-[#F1F2F4]">
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#1D2026] uppercase tracking-wider">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F1F2F4] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Wishlist Card View
    return (
        <div className="group bg-white border border-[#E9EAF0] rounded-[4px] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
            {/* Compact Image */}
            <Link
                to={`/courses/detail/${course.id}`}
                className="relative aspect-video overflow-hidden rounded-t-[4px]"
            >
                <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={onRemove}
                        className="p-2 bg-white rounded-full text-rose-500 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        title="Remove"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </Link>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <Link to={`/courses/detail/${course.id}`} className="hover:text-[#5624D0] transition-colors">
                        <h3 className="text-[15px] font-bold text-[#1D2026] line-clamp-2 leading-snug mb-2">
                            {course.name}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#FD8E1F] text-[#FD8E1F]" />
                            <span className="text-[13px] font-bold text-[#1D2026]">4.5</span>
                        </div>
                        <span className="text-[11px] text-[#6E7485] font-medium italic">Expert Instructor</span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E9EAF0]">
                    <div className="flex flex-col">
                        <span className="text-[18px] font-bold text-[#FF6636]">₹{course.price}</span>
                    </div>

                    <button
                        onClick={onAddToCart}
                        disabled={isInCart}
                        className={`h-9 px-4 flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-all rounded-[4px] whitespace-nowrap ${isInCart
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-[#1D2026] text-white hover:bg-[#5624D0] shadow-sm'
                            }`}
                    >
                        {isInCart ? 'In Cart' : (
                            <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
