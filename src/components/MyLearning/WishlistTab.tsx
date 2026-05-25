import React, { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { viewWishlistAction, toggleWishlistAction } from '../../store/slices/courseWishList';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCartAction } from '../../store/slices/courseCartSlice';


import CourseCard from './CourseCard';

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
                    <div key={i} className="animate-pulse bg-white rounded-[4px] p-3 border border-[#E9EAF0]">
                        <div className="bg-gray-100 aspect-[16/10] rounded-[4px] mb-3"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-full mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (wishListItems.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-[4px] border border-[#E9EAF0] max-w-xl mx-auto">
                <div className="w-16 h-16 bg-indigo-50 rounded-[4px] flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-7 h-7 text-indigo-200" />
                </div>
                <h3 className="text-xl font-bold text-[#1D2026] mb-2 tracking-tight">Empty Wishlist</h3>
                <p className="text-[#6E7485] text-sm mb-8 px-6 leading-relaxed">
                    Courses you add to your wishlist will appear here.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#1D2026] text-white text-sm font-bold rounded-[4px] hover:bg-[#5624D0] transition-all shadow-lg hover:shadow-[#5624D0]/20"
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
                    <CourseCard 
                        key={item.id} 
                        course={course} 
                        type="wishlist"
                        isInCart={isInCart}
                        onRemove={(e) => handleRemove(e, course.id)}
                        onAddToCart={(e) => handleAddToCart(e, course.id)}
                    />
                );
            })}
        </div>
    );
};

export default WishlistTab;
