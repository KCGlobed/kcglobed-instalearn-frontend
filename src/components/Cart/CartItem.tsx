import React, { useState } from 'react';
import { Star, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeFromCart } from '../../store/slices/courseCartSlice';
import { removeFromCartApi } from '../../utils/service';
import { toggleWishlistAction } from '../../store/slices/courseWishList';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';

interface CartItemProps {
    item: any;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    const { wishListItems } = useAppSelector((state: RootState) => state.wishList);
    const [isMoving, setIsMoving] = useState(false);

    const dispatch = useAppDispatch();

    const isWishlist = wishListItems.some((wItem: any) =>
        (wItem.course_info?.id || wItem.course_id) === item.course_info?.id
    );

    const handleRemove = async () => {
        try {
            await removeFromCartApi(item.id);
            dispatch(removeFromCart(item.id));
            toast.success("Removed from cart");
        } catch (error) {
            toast.error("Failed to remove from cart");
        }
    };

    const handleMoveToWishlist = async () => {
        if (!item.course_info?.id) return;
        setIsMoving(true);
        try {
            if (!isWishlist) {
                await dispatch(toggleWishlistAction({ course_id: item.course_info.id })).unwrap();
            }
            await removeFromCartApi(item.id);
            dispatch(removeFromCart(item.id));
            toast.success("Moved to wishlist");
        } catch (error: any) {
            toast.error(error || "Failed to move to wishlist");
        } finally {
            setIsMoving(false);
        }
    };

    const formatDuration = (seconds: string | number | null | undefined) => {
        if (!seconds) return "0h 0m";

        const secNum = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
        if (!secNum || isNaN(secNum)) return "0h 0m";

        const hours = Math.floor(secNum / 3600);
        const minutes = Math.floor((secNum % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };



    return (
        <div className="flex flex-col sm:flex-row gap-4 py-4 group">
            <Link to={`/courses/detail/${item.course_info?.id}`} className="w-full sm:w-[100px] aspect-video bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-50">
                <img
                    src={item.course_info?.image || "https://placehold.co/100x56?text=Course"}
                    alt={item.course_info?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex-1 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <Link to={`/courses/detail/${item.course_info?.id}`}>
                        <h3 className="text-[13px] font-semibold leading-snug hover:text-indigo-600 transition-colors mb-0.5 line-clamp-2">
                            {item.course_info?.name}
                        </h3>
                    </Link>
                    <p className="text-[11px] text-[#6a6f73] mb-1">By {item.course_info?.instructor || "Expert Instructor"}</p>

                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-[11px] font-bold text-[#b4690e]">{item.course_info?.avg_rating}</span>
                        <Star className="w-2.5 h-2.5 fill-[#b4690e] text-[#b4690e]" />
                        <span className="text-[11px] text-[#6a6f73]">({item.course_info?.total_reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#6a6f73]">
                        <span>{formatDuration(item.course_info?.total_video_duration)} total hours</span>
                        <span>•</span>
                        <span>All Levels</span>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1.5 min-w-[90px]">
                    <div className="text-right">
                        <p className="text-[14px] font-bold text-indigo-600">₹{item.course_info?.price}</p>
                        <p className="text-[11px] text-gray-400 line-through">₹{Math.round(item.course_info?.price * 1.8)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] mt-2 sm:mt-1">
                        <button
                            className="flex items-center gap-1 text-[#6a6f73] hover:text-red-500 transition-colors duration-150"
                            onClick={handleRemove}
                        >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                        </button>
                        {isAuthenticated && (
                            <button
                                className={`flex items-center gap-1 transition-colors duration-150 ${isWishlist
                                    ? 'text-rose-600 hover:text-rose-700 font-semibold'
                                    : 'text-indigo-600 hover:text-indigo-700'
                                    }`}
                                onClick={handleMoveToWishlist}
                                disabled={isMoving}
                            >
                                <Heart className={`w-3 h-3 ${isWishlist ? 'fill-current' : ''}`} />
                                <span>{isMoving ? 'Moving...' : 'Move to Wishlist'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
