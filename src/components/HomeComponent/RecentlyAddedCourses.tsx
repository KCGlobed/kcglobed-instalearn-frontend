import { Star, User, BarChart2, Clock, Check, Heart, ShoppingCart, ChevronRight } from "lucide-react";

/**
 * RecentlyAddedCourses Component
 * High-fidelity course grid with a pixel-perfect, vertically centered hover tooltip.
 * Designed to match the Figma design exactly with smooth, stable animations.
 */
const RecentlyAddedCourses = () => {
    const courses = [
        {
            id: 1,
            category: "DEVELOPMENTS",
            categoryBg: "bg-[#EBEBFF]",
            categoryText: "text-[#5624D0]",
            title: "2021 Complete Python Bootcamp From Zero to Hero in Python",
            price: "$14.00",
            oldPrice: "$26.00",
            discount: "56% OFF",
            rating: "5.0",
            totalReviews: "357,914",
            students: "265.7K",
            instructor: "Kevin Gilbert",
            level: "Beginner",
            duration: "6 hour",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
            outcomes: [
                "Learn to use Python professionally, learning both Python 2 and Python 3!",
                "Create games with Python, like Tic Tac Toe and Blackjack!",
                "Create games with Python, like Tic Tac Toe and Blackjack!"
            ]
        },
        {
            id: 2,
            category: "DESIGN",
            categoryBg: "bg-[#FFEEE8]",
            categoryText: "text-[#FF6636]",
            title: "The Python Mega Course: Build 10 Real World Applications",
            price: "$14.00",
            oldPrice: "$26.00",
            discount: "56% OFF",
            rating: "5.0",
            totalReviews: "357,914",
            students: "265.7K",
            instructor: "Kevin Gilbert",
            level: "Beginner",
            duration: "6 hour",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
            outcomes: [
                "Build 10 real-world applications in Python",
                "Automation, web apps, data science & more",
                "Learn Python from absolute scratch"
            ]
        },
        {
            id: 3,
            category: "IT & SOFTWARE",
            categoryBg: "bg-[#EBEBFF]",
            categoryText: "text-[#5624D0]",
            title: "Facebook Ads & Facebook Marketing MASTERY 2021 Cours...",
            price: "$14.00",
            oldPrice: "$26.00",
            discount: "56% OFF",
            rating: "5.0",
            totalReviews: "357,914",
            students: "265.7K",
            instructor: "Kevin Gilbert",
            level: "Beginner",
            duration: "6 hour",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600",
            outcomes: [
                "Master Facebook Ads Manager",
                "Advanced retargeting strategies",
                "Scale your business globally"
            ]
        },
        {
            id: 4,
            category: "MARKETING",
            categoryBg: "bg-[#FFF2E5]",
            categoryText: "text-[#FD8E1F]",
            title: "The Beginners Guide to Financial modeling",
            price: "$14.00",
            oldPrice: "$26.00",
            discount: "56% OFF",
            rating: "5.0",
            totalReviews: "357,914",
            students: "265.7K",
            instructor: "Kevin Gilbert",
            level: "Intermediate",
            duration: "8 hour",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
            outcomes: [
                "Build 3-statement financial models",
                "Excel hacks for finance pros",
                "Master business valuation"
            ]
        }
    ];

    return (
        <section className="bg-white pb-24 px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#1D2026] mb-2">
                        Recently added courses
                    </h2>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <div key={course.id} className="relative group/course">
                            {/* Card Body */}
                            <div className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 rounded-none overflow-hidden h-full flex flex-col z-20 relative">
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${course.categoryBg} ${course.categoryText}`}>
                                            {course.category}
                                        </span>
                                        <span className="text-[#FF6636] font-bold text-[18px]">
                                            $57
                                        </span>
                                    </div>

                                    <h3 className="text-[#1D2026] text-sm font-medium mb-4 line-clamp-2 h-10 group-hover:text-[#5624D0] transition-colors leading-[20px]">
                                        {course.title}
                                    </h3>

                                    <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                            <span className="text-[#1D2026] text-[13px] font-semibold">{course.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[13px] text-[#8C94A3]">
                                            <span className="text-[#4E5566] font-semibold">{course.students}</span>
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
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase w-fit ${course.categoryBg} ${course.categoryText}`}>
                                        {course.category}
                                    </span>

                                    {/* Title */}
                                    <h4 className="text-[#1D2026] text-[18px] font-bold leading-[26px]">
                                        {course.title}
                                    </h4>

                                    {/* Instructor & Rating Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                <img src="https://i.pravatar.cc/100?u=kevin" alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] text-[#8C94A3]">Course by</span>
                                                <span className="text-[14px] text-[#1D2026] font-medium leading-none">{course.instructor}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                            <span className="text-[#1D2026] text-[14px] font-bold">{course.rating}</span>
                                            <span className="text-[#8C94A3] text-[12px]">({course.totalReviews})</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats Row */}
                                    <div className="flex items-center justify-between text-[#1D2026] pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-[#5624D0]" />
                                            <span className="text-[14px] font-medium">{course.students} <span className="text-[#8C94A3] font-normal">students</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BarChart2 className="w-4 h-4 text-[#FF6636]" />
                                            <span className="text-[14px] font-medium text-[#4E5566]">{course.level}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-[#23BD33]" />
                                            <span className="text-[14px] font-medium text-[#4E5566]">{course.duration}</span>
                                        </div>
                                    </div>

                                    {/* Pricing Row */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[24px] font-bold text-[#1D2026]">{course.price}</span>
                                            <span className="text-[16px] text-[#8C94A3] line-through">{course.oldPrice}</span>
                                            <span className="px-2 py-0.5 bg-[#EBEBFF] text-[#5624D0] text-[12px] font-bold">{course.discount}</span>
                                        </div>
                                        <button className="w-10 h-10 flex items-center justify-center bg-[#EBEBFF]/50 text-[#FF6636] rounded-sm hover:bg-[#EBEBFF] transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Outcomes Section */}
                                    <div className="flex flex-col gap-3 py-2 border-t border-gray-100">
                                        <h5 className="text-[12px] font-bold text-[#1D2026] uppercase tracking-wider">What you'll learn</h5>
                                        <ul className="flex flex-col gap-2">
                                            {course.outcomes.map((outcome, idx) => (
                                                <li key={idx} className="flex gap-2">
                                                    <Check className="w-4 h-4 min-w-[16px] text-[#23BD33] mt-0.5" />
                                                    <span className="text-[13px] text-[#6E7485] leading-[20px]">{outcome}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        <button className="w-full py-3 bg-[#5624D0] text-white flex items-center justify-center gap-2 font-bold hover:bg-[#481fad] transition-all">
                                            <ShoppingCart className="w-5 h-5" />
                                            Add To Cart
                                        </button>
                                        <button className="w-full py-3 bg-[#EBEBFF] text-[#5624D0] font-bold hover:bg-white hover:border-[#5624D0] border border-transparent transition-all">
                                            Course Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Browse Button */}
                <div className="mt-16 text-center">
                    <button className="px-10 py-3.5 bg-[#FFEEE8] text-[#FF6636] font-bold inline-flex items-center gap-2 hover:bg-[#FF6636] hover:text-white transition-all transform active:scale-95">
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
