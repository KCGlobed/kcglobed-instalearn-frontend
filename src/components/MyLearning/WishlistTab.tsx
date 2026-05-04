import React, { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { viewWishlistAction, toggleWishlistAction } from '../../store/slices/courseWishList';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCartAction } from '../../store/slices/courseCartSlice';

const WishlistTab = () => {
    const dispatch = useAppDispatch();
    const { wishListItems, loading, error } = useAppSelector((state: RootState) => state.wishList);
    const { cartItems } = useAppSelector((state: RootState) => state.cart);

    useEffect(() => {
        dispatch(viewWishlistAction());
    }, [dispatch]);

    const handleRemove = async (e: React.MouseEvent, courseId: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await dispatch(toggleWishlistAction({ course_id: courseId })).unwrap();
            toast.success("Removed from wishlist");
        } catch (err: any) {
            toast.error(err || "Failed to remove");
        }
    };

    const handleAddToCart = async (e: React.MouseEvent, courseId: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await dispatch(addToCartAction({ course_id: courseId })).unwrap();
            toast.success("Added to cart");
        } catch (err: any) {
            toast.error(err || "Failed to add to cart");
        }
    };

    if (loading && wishListItems.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl p-3 border border-gray-100">
                        <div className="bg-gray-100 aspect-video rounded-lg mb-3"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-full mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (wishListItems.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 max-w-xl mx-auto font-inter">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-7 h-7 text-indigo-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Empty Wishlist</h3>
                <p className="text-gray-500 text-sm mb-8 px-6 leading-relaxed">
                    Courses you add to your wishlist will appear here.
                </p>
                <Link 
                    to="/" 
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                    Browse Now
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-inter">
            {wishListItems.map((item: any) => {
                const course = item.course_info;
                const isInCart = cartItems.some((c: any) => c.course_info?.id === course.id);

                return (
                    <div key={item.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                        {/* Compact Image */}
                        <Link 
                            to={`/courses/detail/${course.id}`} 
                            className="relative aspect-video overflow-hidden"
                        >
                            <img 
                                src={course.image} 
                                alt={course.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={(e) => handleRemove(e, course.id)}
                                    className="p-2 bg-white rounded-full text-rose-500 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Link>

                        {/* Content Area - Very Compact */}
                        <div className="p-3.5 flex flex-col flex-grow">
                            <div className="flex-grow">
                                <Link to={`/courses/detail/${course.id}`}>
                                    <h3 className="font-bold text-gray-900 text-[14px] leading-tight mb-1.5 line-clamp-2 hover:text-indigo-600 transition-colors">
                                        {course.name}
                                    </h3>
                                </Link>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                        <span className="text-[12px] font-bold text-gray-700">4.5</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">Expert Inst.</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-gray-900">₹{course.price}</span>
                                    {course.discount > 0 && (
                                        <span className="text-[10px] text-gray-400 line-through">₹{Math.round(course.price / (1 - course.discount/100))}</span>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={(e) => !isInCart && handleAddToCart(e, course.id)}
                                    disabled={isInCart}
                                    className={`h-9 px-3.5 flex items-center gap-2 font-bold text-[12px] transition-all rounded-lg whitespace-nowrap ${
                                        isInCart 
                                            ? 'bg-green-50 text-green-600 border border-green-100' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
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
            })}
        </div>
    );
};

export default WishlistTab;
