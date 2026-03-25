import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchTags } from "../../store/slices/tagSlice";
import SkeltonLoader from "../Loader/SkeltonLoader";


const AllInOneFinance = () => {
    const [activeTab, setActiveTab] = useState("Most Popular");
    const courses = [
        {
            id: 1,
            category: "DESIGN",
            categoryBg: "bg-[#FFEEE8]",
            categoryText: "text-[#FF6636]",
            title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 2,
            category: "DEVELOPMENTS",
            categoryBg: "bg-[#EBEBFF]",
            categoryText: "text-[#5624D0]",
            title: "The Complete 2021 Web Development Bootcamp",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 3,
            category: "BUSINESS",
            categoryBg: "bg-[#E1F7E3]",
            categoryText: "text-[#15711F]",
            title: "Learn Python Programming Masterclass",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 4,
            category: "MARKETING",
            categoryBg: "bg-[#FFF2E5]",
            categoryText: "text-[#FD8E1F]",
            title: "The Complete Digital Marketing Course - 12 Courses in 1",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 5,
            category: "IT & SOFTWARE",
            categoryBg: "bg-[#FFEEE8]",
            categoryText: "text-[#FF6636]",
            title: "Reiki Level I, II and Master/Teacher Program",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 6,
            category: "MUSIC",
            categoryBg: "bg-[#EBEBFF]",
            categoryText: "text-[#5624D0]",
            title: "The Complete Foundation Stock Trading Course",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 7,
            category: "MARKETING",
            categoryBg: "bg-[#FFF2E5]",
            categoryText: "text-[#FD8E1F]",
            title: "Beginner to Pro in Excel: Financial Modeling and Valuation",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 8,
            category: "HEALTH & FITNESS",
            categoryBg: "bg-[#E1F7E3]",
            categoryText: "text-[#15711F]",
            title: "The Python Mega Course: Build 10 Real World Applications",
            price: "$57",
            rating: "5.0",
            students: "265.7K",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600"
        }
    ];
    const dispatch = useAppDispatch();
    const { tags, loading } = useAppSelector((state) => state.tag);
    const tabs = ["Most Popular", "New Courses", "Trending"];

    console.log(tags, "check");



    useEffect(() => {
        if (!tags || tags.length === 0) {
            dispatch(fetchTags());
        }
    }, []);








    return (
        <section className="bg-[#FFFFFE] py-20 px-4 xl:px-0 ">
            <div className="max-w-[1320px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-[36px] font-bold text-[#1D2026] mb-4">
                        Finance, Accounting & More, All in one place.
                    </h2>
                    <p className="text-[#6E7485] text-[16px]">
                        From fundamentals to advanced concepts - learn it all here.
                    </p>
                </div>

                {/* Filters - Unified left-aligned tab container */}
                {loading ? <SkeltonLoader loaderType="tag" /> : (
                    <div className="flex justify-start items-center mb-10 overflow-x-auto no-scrollbar">
                        <div className="flex p-1 bg-white border border-[#E9EAF0] rounded-sm">
                            {tags.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-6 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-[2px] cursor-pointer whitespace-nowrap ${activeTab === tab.name
                                        ? "bg-[#EBEBFF] text-[#5624D0]"
                                        : "text-[#6E7485] hover:bg-gray-50 border border-transparent"
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Course Grid - Fixed 4 in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 rounded-[4px] overflow-hidden"
                        >
                            <div className="relative overflow-hidden aspect-[16/10]">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-4 flex flex-col min-h-[180px]">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${course.categoryBg} ${course.categoryText}`}>
                                        {course.category}
                                    </span>
                                    <span className="text-[#FF6636] font-bold text-[18px]">
                                        {course.price}
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
                                    <div className="text-[12px] text-[#4E5566]">
                                        <span className="font-semibold">{course.students}</span> students
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default AllInOneFinance;