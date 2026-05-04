import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { viewCartDetails } from '../../store/slices/courseCartSlice';
import type { RootState } from '../../store/store';
import MainHeader from '../../layouts/MainHeader';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';
import EmptyCart from '../../components/Cart/EmptyCart';
import RecommendationCard from '../../components/Cart/RecommendationCard';

const Cart = () => {
    const { cartItems: cart, loading } = useAppSelector((state: RootState) => state.cart);

    const { totalPrice, originalPrice, discountCount } = useMemo(() => {
        const total = cart.reduce((sum, item) => sum + (item.course_info?.price || 0), 0);
        const original = cart.reduce((sum, item) => sum + (item.course_info?.original_price || Math.round((item.course_info?.price || 0) * 1.8)), 0);
        return {
            totalPrice: total,
            originalPrice: original,
            discountCount: original - total
        };
    }, [cart]);

    if (loading && cart.length === 0) {
        return (
            <>
                <MainHeader />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="min-h-screen bg-white font-['Inter',_sans-serif] text-[#1c1d1f]">
                <main className="max-w-[1200px] mx-auto px-4 py-8 lg:px-6">
                    <h1 className="text-[24px] font-bold mb-1 tracking-tight">Shopping Cart</h1>
                    <p className="text-[13px] font-semibold mb-6">{cart.length} Courses in Cart</p>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side: Course List */}
                        <div className="flex-1">
                            {cart.length > 0 ? (
                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                    {cart.map((item: any) => (
                                        <CartItem key={item.course_info?.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyCart />
                            )}
                        </div>

                        {/* Right Side: Summary */}
                        {cart.length > 0 && (
                            <div className="w-full lg:w-[300px] flex-shrink-0">
                                <CartSummary
                                    totalPrice={totalPrice}
                                    originalPrice={originalPrice}
                                    discountCount={discountCount}
                                />
                            </div>
                        )}
                    </div>

                    {/* Recommendations Section */}
                    <section className="mt-20">
                        <h2 className="text-[18px] font-bold mb-6">You might also like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <RecommendationCard key={i} index={i} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default Cart;