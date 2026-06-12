import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecommendationCardProps {
    index: number;
    course: any;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ course }) => {
    const courseData = course?.course ?? course;

    return (
        <Link to={`/courses/detail/${courseData?.id}`} className="group cursor-pointer block">
            {/* Thumbnail */}
            <div className="aspect-video rounded-sm overflow-hidden bg-gray-50 mb-2 border border-gray-100 relative">
                <img
                    src={courseData?.image || `https://placehold.co/150x84?text=Course`}
                    alt={courseData?.name || 'Course'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                >
                    <Heart className="w-3 h-3 text-gray-500 hover:text-rose-500 transition-colors" />
                </button>
            </div>

            {/* Title */}
            <h4 className="text-[11px] font-semibold line-clamp-2 leading-tight mb-0.5 group-hover:text-indigo-600 transition-colors">
                {courseData?.name}
            </h4>

            {/* Instructor */}
            <p className="text-[9px] text-[#6a6f73] mb-0.5 truncate">
                {courseData?.instructor || 'Expert Instructor'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-bold text-[#b4690e]">
                    {courseData?.avg_rating?.toFixed(1) || '—'}
                </span>
                <Star className="w-2 h-2 fill-[#b4690e] text-[#b4690e]" />
                {courseData?.total_reviews > 0 && (
                    <span className="text-[9px] text-[#6a6f73]">({courseData.total_reviews})</span>
                )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-[#1c1d1f]">
                    ₹{courseData?.price}
                </span>
                {courseData?.original_price && (
                    <span className="text-[10px] text-gray-400 line-through">
                        ₹{courseData.original_price}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default RecommendationCard;
