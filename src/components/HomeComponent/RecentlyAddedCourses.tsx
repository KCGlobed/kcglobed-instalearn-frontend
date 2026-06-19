import { Star, BarChart2, Clock, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchHomepageRecentlyAdded } from "../../store/slices/homepageRecentlyAdded";
import { useAppSelector } from "../../hooks/useRedux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { addToCartAction } from "../../store/slices/courseCartSlice";
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

    const handleAddToCart = (e: React.MouseEvent, courseId: number) => {
        e.stopPropagation();
        if (!courseId) return;
        dispatch(addToCartAction({ course_id: courseId }));
    };

    if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;

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
                            courses.map((course: any) => {
                                const category = course.categories?.[0]?.category_info || {
                                    name: "Development",
                                    bg_code: "#EBEBFF",
                                    text_code: "#5624D0",
                                };

                                // API: instrcutor_info array (backend typo), instructors array, or direct instructor_info
                                const instructor =
                                    course.instrcutor_info?.[0]?.instructor_info ||
                                    course.instructors?.[0]?.instructor_info ||
                                    course.instructor_info ||
                                    null;

                                const instructorName =
                                    instructor?.text_1 ||
                                    (course.created_by ? `${course.created_by.first_name} ${course.created_by.last_name}`.trim() : "") ||
                                    "Super Admin";

                                const instructorImage =
                                    instructor?.image ||
                                    course.created_by?.image ||
                                    "https://i.pravatar.cc/100";

                                const oldPrice = course.discount > 0
                                    ? (course.price / (1 - course.discount / 100)).toFixed(2)
                                    : null;

                                const isInCart = cartItems?.some(
                                    (item: any) => item?.course_info?.id === course.id
                                );

                                return (
                                    /* ── Flip card container ───────────────────────── */
                                    <div
                                        key={course.id}
                                        className="course-flip-card"
                                        style={{ perspective: "1200px", minHeight: "380px" }}
                                    >
                                        {/* ── Inner (rotates on hover) ─────────────── */}
                                        <div
                                            className="course-flip-inner relative w-full"
                                            style={{
                                                transformStyle: "preserve-3d",
                                                minHeight: "380px",
                                                transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
                                            }}
                                        >
                                            {/* ══ FRONT FACE ════════════════════════ */}
                                            <div
                                                className="course-flip-front absolute inset-0 bg-white border border-[#E9EAF0] overflow-hidden flex flex-col shadow-sm"
                                                style={{ backfaceVisibility: "hidden" }}
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative overflow-hidden aspect-[16/10]">
                                                    <img
                                                        src={course.image}
                                                        alt={course.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="p-4 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span
                                                            className="px-2 py-0.5 text-[10px] font-bold uppercase"
                                                            style={{ backgroundColor: category.bg_code, color: category.text_code }}
                                                        >
                                                            {category.name}
                                                        </span>
                                                        <span className="text-[#FF6636] font-bold text-[18px]">₹{course.price}</span>
                                                    </div>

                                                    <h3 className="text-[#1D2026] text-sm font-medium mb-1 line-clamp-2 leading-[20px]">
                                                        {course.name}
                                                    </h3>
                                                    {instructorName && (
                                                        <span className="text-[12px] text-[#8C94A3] font-normal truncate block mb-3">
                                                            {instructorName}
                                                        </span>
                                                    )}

                                                    <div className="mt-auto pt-3 border-t border-[#E9EAF0] flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                                            <span className="text-[#1D2026] text-[13px] font-semibold">
                                                                {course.avg_rating || "0.0"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[13px] text-[#8C94A3]">
                                                            <span className="text-[#4E5566] font-semibold">1400</span>
                                                            <span>students</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ══ BACK FACE ═════════════════════════ */}
                                            <div
                                                className="course-flip-back absolute inset-0 bg-white border-2 border-[#5624D0] flex flex-col"
                                                style={{
                                                    backfaceVisibility: "hidden",
                                                    transform: "rotateY(180deg)",
                                                }}
                                            >
                                                {/* Gradient header bar */}
                                                <div className="h-1.5 w-full bg-gradient-to-r from-[#5624D0] via-[#7C3AED] to-[#FF6636] flex-shrink-0" />

                                                <div className="flex flex-col justify-between p-4 flex-grow">
                                                    {/* Top section */}
                                                    <div className="flex flex-col gap-2.5">
                                                        {/* Category */}
                                                        <span
                                                            className="px-2 py-0.5 text-[10px] font-bold uppercase w-fit"
                                                            style={{ backgroundColor: category.bg_code, color: category.text_code }}
                                                        >
                                                            {category.name}
                                                        </span>

                                                        {/* Title */}
                                                        <h4 className="text-[#1D2026] text-[14px] font-bold leading-[20px] line-clamp-2">
                                                            {course.name}
                                                        </h4>

                                                        {/* Instructor + Rating */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ring-2 ring-[#5624D0]/20">
                                                                    <img
                                                                        src={instructorImage}
                                                                        alt={instructorName || "instructor"}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = "https://i.pravatar.cc/100";
                                                                        }}
                                                                    />
                                                                </div>
                                                                {instructorName && (
                                                                    <span className="text-[12px] text-[#4E5566] font-medium truncate max-w-[110px]">
                                                                        {instructorName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                                <Star className="w-3.5 h-3.5 text-[#FD8E1F] fill-[#FD8E1F]" />
                                                                <span className="text-[13px] font-bold text-[#1D2026]">
                                                                    {course.avg_rating || "0.0"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Level + Duration */}
                                                        <div className="flex items-center gap-3 py-2 border-t border-b border-gray-100">
                                                            <div className="flex items-center gap-1">
                                                                <BarChart2 className="w-3.5 h-3.5 text-[#FF6636]" />
                                                                <span className="text-[11px] text-[#4E5566]">{getLevelText(course.level)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5 text-[#23BD33]" />
                                                                <span className="text-[11px] text-[#4E5566]">{course.duration}</span>
                                                            </div>
                                                        </div>

                                                        {/* Price + Wishlist */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                                                <span className="text-[20px] font-bold text-[#1D2026]">₹{course.price}</span>
                                                                {oldPrice && (
                                                                    <>
                                                                        <span className="text-[12px] text-[#8C94A3] line-through">₹{oldPrice}</span>
                                                                        <span className="px-1.5 py-0.5 bg-[#EBEBFF] text-[#5624D0] text-[10px] font-bold">
                                                                            {course.discount}% OFF
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-8 h-8 flex items-center justify-center bg-[#EBEBFF]/60 text-[#FF6636] rounded-sm hover:bg-[#EBEBFF] transition-colors flex-shrink-0"
                                                            >
                                                                <Heart className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Action buttons — always at bottom */}
                                                    <div className="flex flex-col gap-2">
                                                        {!isInCart ? (
                                                            <button
                                                                onClick={(e) => handleAddToCart(e, course.id)}
                                                                disabled={cartLoading}
                                                                className="w-full py-2.5 bg-[#5624D0] text-white flex items-center justify-center gap-2 font-bold hover:bg-[#481fad] transition-all disabled:bg-gray-400 text-sm"
                                                            >
                                                                {cartLoading ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                                                        <span>Adding...</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <ShoppingCart className="w-4 h-4" />
                                                                        Add To Cart
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}
                                                                className="w-full py-2.5 bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                                Go to Cart
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/courses/detail/${course?.id}`); }}
                                                            className="w-full py-2.5 bg-[#EBEBFF] text-[#5624D0] font-bold hover:bg-white hover:border-[#5624D0] border border-transparent transition-all text-sm"
                                                        >
                                                            Course Detail
                                                        </button>
                                                    </div>
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
                    <button
                        onClick={() => navigate("/courses")}
                        className="px-10 py-3.5 bg-[#FFEEE8] text-[#FF6636] font-bold inline-flex items-center gap-2 hover:bg-[#FF6636] hover:text-white transition-all transform active:scale-95"
                    >
                        Browse All Course
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style>{`
                /* Trigger the flip on hover */
                .course-flip-card:hover .course-flip-inner {
                    transform: rotateY(180deg);
                }

                /* Hide scrollbar on back face */
                .course-flip-back::-webkit-scrollbar {
                    display: none;
                }

                /* Respect reduced-motion preference */
                @media (prefers-reduced-motion: reduce) {
                    .course-flip-inner {
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default RecentlyAddedCourses;
