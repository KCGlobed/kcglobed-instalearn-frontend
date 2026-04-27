import React from 'react';
import { Star, Heart } from 'lucide-react';

interface RecommendationCardProps {
    index: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ index }) => {
    return (
        <div className="group cursor-pointer">
            <div className="aspect-video rounded-sm overflow-hidden bg-gray-50 mb-1.5 border border-gray-50 relative">
                <img src={`https://placehold.co/150x84?text=Course`} alt="Recommended" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute top-1 right-1 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-3 h-3" />
                </button>
            </div>
            <h4 className="text-[11px] font-semibold line-clamp-2 leading-tight mb-0.5 group-hover:text-indigo-600">
                UI/UX Design Masterclass 2024
            </h4>
            <p className="text-[9px] text-[#6a6f73] mb-0.5">Alex Grant</p>
            <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-bold text-[#b4690e]">4.8</span>
                <Star className="w-2 h-2 fill-[#b4690e] text-[#b4690e]" />
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold">₹749</span>
                <span className="text-[10px] text-gray-400 line-through">₹3k</span>
            </div>
        </div>
    );
};

export default RecommendationCard;
