import { Star, User, BarChart2, Clock, Check, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchHomepageRecentlyAdded } from "../../store/slices/homepageRecentlyAdded";
import { useAppSelector } from "../../hooks/useRedux";
import RecentlyAddedCourseLoader from "../Loader/RecentlyHomepageLoader";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { addToCartAction, viewCartDetails } from "../../store/slices/courseCartSlice";
import SkeltonLoader from "../Loader/SkeltonLoader";


const RecentlyAddedCourses = () => {
    const { cartItems, loading: cartLoading } = useAppSelector((state: RootState) => state.cart);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchHomepageRecentlyAdded());
    }, [dispatch]);

    const { data: courses, loading, error } = useAppSelector((state: any) => state.homepageRecentlyAdded);

    const getLevelText = (level: number) => {
        switch (level) {
            case 1: return "Beginner";
            case 2: return "Intermediate";
            case 3: return "Advanced";
            default: return "All Levels";
        }
    };

    const handleAddToCart = (courseId: number) => {
        if (!courseId) return;
        const data = {
            course_id: courseId,
        }
        dispatch(addToCartAction(data));
    }


    if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>
    return (
        <section className="bg-white pb-24 px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#1D2026] mb-2">
                        Recently added courses
                    </h2>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <SkeltonLoader loaderType="course" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses && courses.length > 0 ? (
                            courses.map((course: any, index: number) => {
                                const category = course.categories?.[0]?.category_info || {
                                    name: "Development",
                                    bg_code: "bg-[#EBEBFF]",
                                    text_code: "text-[#5624D0]"
                                };

                                const oldPrice = course.discount > 0
                                    ? (course.price / (1 - course.discount / 100)).toFixed(2)
                                    : null;

                                const isInCart = cartItems?.some((item: any) => item?.course_info?.id === course.id);

                                return (
                                    <div key={course.id} className="relative group/course">
                                        {/* Card Body */}
                                        <div className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 rounded-none overflow-hidden h-full flex flex-col z-20 relative">
                                            <div className="relative overflow-hidden aspect-[16/10]">
                                                <img
                                                    src={course.image}
                                                    alt={course.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="p-4 flex flex-col flex-grow">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${category.bg_code} ${category.text_code}`}>
                                                        {category.name}
                                                    </span>
                                                    <span className="text-[#FF6636] font-bold text-[18px]">
                                                        ₹{course.price}
                                                    </span>
                                                </div>

                                                <h3 className="text-[#1D2026] text-sm font-medium mb-4 line-clamp-2 h-10 group-hover:text-[#5624D0] transition-colors leading-[20px]">
                                                    {course.name}
                                                </h3>

                                                <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                                        <span className="text-[#1D2026] text-[13px] font-semibold">{course.avg_rating || "0.0"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[13px] text-[#8C94A3]">
                                                        <span className="text-[#4E5566] font-semibold">1400</span>
                                                        <span>students</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vertically Centered Tooltip Preview */}
                                        <div
                                            className={`
                                            absolute top-1/2 -translate-y-1/2 z-[100] w-[340px] bg-white border border-[#E9EAF0] shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-6
                                            opacity-0 invisible
                                            group-hover/course:opacity-100 group-hover/course:visible group-hover/course:translate-x-0
                                            transition-all duration-500 ease-in-out
                                            pointer-events-none group-hover/course:pointer-events-auto
                                            ${(index + 1) % 4 === 0
                                                    ? "right-full mr-5 translate-x-4"
                                                    : "left-full ml-5 -translate-x-4"}
                                        `}
                                        >
                                            {/* Tooltip Arrow */}
                                            <div className={`
                                            absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[#E9EAF0] rotate-45 z-[-1]
                                            ${(index + 1) % 4 === 0
                                                    ? "right-[-9px] border-t border-r"
                                                    : "left-[-9px] border-b border-l"}
                                        `}></div>

                                            <div className="flex flex-col gap-4">
                                                {/* Category */}
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase w-fit ${category.bg_code} ${category.text_code}`}>
                                                    {category.name}
                                                </span>

                                                {/* Title */}
                                                <h4 className="text-[#1D2026] text-[18px] font-bold leading-[26px]">
                                                    {course.name}
                                                </h4>

                                                {/* Instructor & Rating Row */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                            <img
                                                                src={course.created_by?.image || "https://i.pravatar.cc/100"}
                                                                alt="avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] text-[#8C94A3]">Course by</span>
                                                            <span className="text-[14px] text-[#1D2026] font-medium leading-none">
                                                                {course.created_by?.first_name} {course.created_by?.last_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                                        <span className="text-[#1D2026] text-[14px] font-bold">{course.avg_rating || "0.0"}</span>
                                                        <span className="text-[#8C94A3] text-[12px]">(0)</span>
                                                    </div>
                                                </div>

                                                {/* Quick Stats Row */}
                                                <div className="flex items-center justify-between text-[#1D2026] pt-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-4 h-4 text-[#5624D0]" />
                                                        <span className="text-[14px] font-medium">0 <span className="text-[#8C94A3] font-normal">students</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <BarChart2 className="w-4 h-4 text-[#FF6636]" />
                                                        <span className="text-[14px] font-medium text-[#4E5566]">{getLevelText(course.level)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4 text-[#23BD33]" />
                                                        <span className="text-[14px] font-medium text-[#4E5566]">{course.duration}</span>
                                                    </div>
                                                </div>

                                                {/* Pricing Row */}
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-[24px] font-bold text-[#1D2026]">₹{course.price}</span>
                                                        {oldPrice && (
                                                            <>
                                                                <span className="text-[16px] text-[#8C94A3] line-through">₹{oldPrice}</span>
                                                                <span className="px-2 py-0.5 bg-[#EBEBFF] text-[#5624D0] text-[12px] font-bold">{course.discount}% OFF</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button className="w-10 h-10 flex items-center justify-center bg-[#EBEBFF]/50 text-[#FF6636] rounded-sm hover:bg-[#EBEBFF] transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Outcomes Section */}
                                                {course.objectives_summary && course.objectives_summary.length > 0 && (
                                                    <div className="flex flex-col gap-3 py-2 border-t border-gray-100">
                                                        <h5 className="text-[12px] font-bold text-[#1D2026] uppercase tracking-wider">What you'll learn</h5>
                                                        <ul className="flex flex-col gap-2">
                                                            {course.objectives_summary.map((outcome: string, idx: number) => (
                                                                <li key={idx} className="flex gap-2">
                                                                    <Check className="w-4 h-4 min-w-[16px] text-[#23BD33] mt-0.5" />
                                                                    <span className="text-[13px] text-[#6E7485] leading-[20px]">{outcome}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 pt-2">
                                                    {!isInCart ? (
                                                        <button
                                                            onClick={() => handleAddToCart(course.id)}
                                                            disabled={cartLoading}
                                                            className="w-full py-3 bg-[#5624D0] text-white flex items-center justify-center gap-2 font-bold hover:bg-[#481fad] transition-all disabled:bg-gray-400"
                                                        >
                                                            {cartLoading ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                    <span>Adding...</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <ShoppingCart className="w-5 h-5" />
                                                                    Add To Cart
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => navigate('/cart')}
                                                            className="w-full py-3 bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <ShoppingCart className="w-5 h-5" />
                                                            Go to Cart
                                                        </button>
                                                    )}

                                                    <button onClick={() => navigate(`/courses/detail/${course?.id}`)} className="w-full py-3 bg-[#EBEBFF] text-[#5624D0] font-bold hover:bg-white hover:border-[#5624D0] border border-transparent transition-all">
                                                        Course Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 text-[#8C94A3]">No courses found.</div>
                        )}
                    </div>
                )}

                {/* Footer Browse Button */}
                <div className="mt-16 text-center">
                    <button onClick={() => navigate('/courses')} className="px-10 py-3.5 bg-[#FFEEE8] text-[#FF6636] font-bold inline-flex items-center gap-2 hover:bg-[#FF6636] hover:text-white transition-all transform active:scale-95">
                        Browse All Course
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default RecentlyAddedCourses;
