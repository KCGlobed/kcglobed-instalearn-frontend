import { useEffect, useState, useCallback, memo } from "react";
import { Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchTags } from "../../store/slices/tagSlice";
import SkeltonLoader from "../Loader/SkeltonLoader";
import { fetchCoursesById } from "../../store/slices/courseSlice";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CourseItem {
    id: number;
    courses: {
        image: string;
        name: string;
        price: number | string;
        avg_rating?: number;
        total_students?: number | string;
        categories: { category_info: { name: string } }[];
    };
}

// ---------------------------------------------------------------------------
// CourseCard — extracted to avoid re-creating the component on every render
// ---------------------------------------------------------------------------
const CourseCard = memo(({ course }: { course: CourseItem }) => {
    const info = course.courses;

    return (
        <div className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 rounded-[4px] overflow-hidden">
            <div className="relative overflow-hidden aspect-[16/10]">
                <img
                    src={info?.image}
                    alt={info?.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col min-h-[180px]">
                <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#EBEBFF] text-[#5624D0]">
                        {info?.categories?.[0]?.category_info?.name}
                    </span>
                    <span className="text-[#FF6636] font-bold text-[18px]">
                        ${info?.price}
                    </span>
                </div>

                <h3 className="text-[#1D2026] text-sm font-medium mb-4 line-clamp-2 h-10 group-hover:text-[#5624D0] transition-colors leading-[20px]">
                    {info?.name}
                </h3>

                <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                        <span className="text-[#1D2026] text-[13px] font-semibold">
                            {info?.avg_rating ?? 5}
                        </span>
                    </div>
                    <div className="text-[12px] text-[#4E5566]">
                        <span className="font-semibold">{info?.total_students ?? "100k"}</span>{" "}
                        students
                    </div>
                </div>
            </div>
        </div>
    );
});

CourseCard.displayName = "CourseCard";

// ---------------------------------------------------------------------------
// CourseGrid skeleton — shown while courses load
// ---------------------------------------------------------------------------
const CourseGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div
                key={i}
                className="bg-white border border-[#E9EAF0] rounded-[4px] overflow-hidden animate-pulse"
            >
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-4 flex flex-col gap-3 min-h-[180px]">
                    <div className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-10 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex justify-between">
                        <div className="h-4 w-10 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const AllInOneFinance = () => {
    const dispatch = useAppDispatch();
    const { tags, loading: tagsLoading } = useAppSelector((state) => state.tag);
    const { courses, loading: courseLoading } = useAppSelector((state) => state.course);

    // Initialise to null so we know "not yet set"
    const [activeTab, setActiveTab] = useState<number | null>(null);

    // Fetch tags once on mount
    useEffect(() => {
        if (!tags || tags.length === 0) {
            dispatch(fetchTags());
        }
    }, [dispatch]);

    // Once tags arrive, default the active tab to the first tag
    useEffect(() => {
        if (tags?.length > 0 && activeTab === null) {
            setActiveTab(tags[0].id);
        }
    }, [tags, activeTab]);

    // Fetch courses whenever the active tab changes
    useEffect(() => {
        if (activeTab !== null) {
            dispatch(fetchCoursesById(activeTab));
        }
    }, [activeTab, dispatch]);

    const handleTabClick = useCallback((id: number) => {
        setActiveTab(id);
    }, []);

    return (
        <section className="bg-[#FFFFFE] py-20 px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-[36px] font-bold text-[#1D2026] mb-4">
                        Finance, Accounting &amp; More, All in one place.
                    </h2>
                    <p className="text-[#6E7485] text-[16px]">
                        From fundamentals to advanced concepts - learn it all here.
                    </p>
                </div>

                {/* Tab filters */}
                {tagsLoading ? (
                    <SkeltonLoader loaderType="tag" />
                ) : (
                    <div className="flex justify-start items-center mb-10 overflow-x-auto no-scrollbar">
                        <div className="flex p-1 bg-white border border-[#E9EAF0] rounded-sm">
                            {tags.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`px-6 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-[2px] cursor-pointer whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-[#EBEBFF] text-[#5624D0]"
                                        : "text-[#6E7485] hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Course grid */}
                {courseLoading ? (
                    <CourseGridSkeleton />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course: CourseItem) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
        </section>
    );
};

export default AllInOneFinance;