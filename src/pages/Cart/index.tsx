import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks/useRedux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { viewCartDetails } from '../../store/slices/courseCartSlice';
import { viewWishlistAction } from '../../store/slices/courseWishList';
import type { RootState } from '../../store/store';
import MainHeader from '../../layouts/MainHeader';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';
import EmptyCart from '../../components/Cart/EmptyCart';
import RecommendationCard from '../../components/Cart/RecommendationCard';
import { getRelatedCourseApi } from '../../utils/service';
import _Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Vite ESM fix — same pattern as ToolSlider.tsx
const Slider = (_Slider as any).default || _Slider;

const Cart = () => {
    const dispatch = useAppDispatch();
    const { cartItems: cart, loading } = useAppSelector((state: RootState) => state.cart);
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const sliderRef = useRef<typeof Slider>(null);

    const sliderSettings = {
        dots: false,
        infinite: recommendedCourses.length > 5,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768,  settings: { slidesToShow: 3 } },
            { breakpoint: 560,  settings: { slidesToShow: 2 } },
            { breakpoint: 400,  settings: { slidesToShow: 1 } },
        ],
    };

    useEffect(() => {
        dispatch(viewCartDetails());
        if (isAuthenticated) {
            dispatch(viewWishlistAction());
        }
    }, [dispatch, isAuthenticated]);

    const { totalPrice, originalPrice, discountCount } = useMemo(() => {
        const total = cart.reduce((sum, item) => sum + (item.course_info?.price || 0), 0);
        const original = cart.reduce((sum, item) => sum + (item.course_info?.original_price || Math.round((item.course_info?.price || 0) * 1.8)), 0);
        return {
            totalPrice: total,
            originalPrice: original,
            discountCount: original - total
        };
    }, [cart]);



    const getRecommendedCourses = async () => {
        const payload = {
            course_id: cart.map((item: any) => item.course_info?.id).join(","),
        }
        if (cart.length > 0) {
            const response = await getRelatedCourseApi(payload.course_id);
            if (response) {
                setRecommendedCourses(response.data);
            }
        }
    }

    useEffect(() => {
        getRecommendedCourses();
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
                    {recommendedCourses.length > 0 && (
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-[18px] font-bold tracking-tight">You might also like</h2>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => (sliderRef.current as any)?.slickPrev()}
                                        className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                        aria-label="Previous"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => (sliderRef.current as any)?.slickNext()}
                                        className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                        aria-label="Next"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="-mx-2">
                                <Slider ref={sliderRef} {...sliderSettings}>
                                    {recommendedCourses.map((course: any, index: number) => (
                                        <div key={course.id ?? index} className="px-2 outline-none">
                                            <RecommendationCard index={index} course={course} />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
};

export default Cart;