import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItemProps {
    item: any;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 py-4 group">
            <Link to={`/course/${item.course_info?.id}`} className="w-full sm:w-[100px] aspect-video bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-50">
                <img 
                    src={item.course_info?.image || "https://placehold.co/100x56?text=Course"} 
                    alt={item.course_info?.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex-1 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <Link to={`/course/${item.course_info?.id}`}>
                        <h3 className="text-[13px] font-semibold leading-snug hover:text-indigo-600 transition-colors mb-0.5 line-clamp-2">
                            {item.course_info?.name}
                        </h3>
                    </Link>
                    <p className="text-[11px] text-[#6a6f73] mb-1">By {item.course_info?.instructor || "Expert Instructor"}</p>
                    
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-[11px] font-bold text-[#b4690e]">4.5</span>
                        <Star className="w-2.5 h-2.5 fill-[#b4690e] text-[#b4690e]" />
                        <span className="text-[11px] text-[#6a6f73]">(2.4k)</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#6a6f73]">
                        <span>22 total hours</span>
                        <span>•</span>
                        <span>All Levels</span>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1.5 min-w-[90px]">
                    <div className="text-right">
                        <p className="text-[14px] font-bold text-indigo-600">₹{item.course_info?.price}</p>
                        <p className="text-[11px] text-gray-400 line-through">₹{Math.round(item.course_info?.price * 1.8)}</p>
                    </div>
                    
                    <div className="flex gap-2.5 text-[11px]">
                        <button className="text-indigo-600 hover:underline">Remove</button>
                        <button className="text-indigo-600 hover:underline hidden sm:block">Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
