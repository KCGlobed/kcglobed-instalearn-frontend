import { useEffect, useState, useRef, useCallback } from "react";
import {
    SlidersHorizontal, Search, ChevronDown, ChevronUp,
} from "lucide-react";
import CoursesCard from "../Cards/CoursesCard";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { filterCoursesListParams, loadMoreCourses } from "../../store/slices/filterCoursesParamsSlice";
import Sidebar from "./SideBar";

const CourseListFilter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [name, setName] = useState("");
    const [debouncedName, setDebouncedName] = useState("");
    const dispatch = useAppDispatch();
    
    // Select from filterCourseParams state
    const { courses, loading, error, isFetchingMore, pagination } = useAppSelector(
        (state: any) => state.filterCourseParams
    );
    const navigate = useNavigate();
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleCourseClick = (course: any) => {
        navigate(`/courses/detail/${course.id}`);
    };

    // Debounce the search term to prevent rapid API requests
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(name);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [name]);

    // Fetch fresh course list whenever any filter parameter changes
    useEffect(() => {
        dispatch(filterCoursesListParams({
            subcategory: selectedSubcategories,
            name: debouncedName,
            level: selectedLevels,
            rating: selectedRatings,
            tags: selectedTags
        }));
    }, [selectedSubcategories, debouncedName, selectedLevels, selectedRatings, selectedTags, dispatch]);

    // Handle fetching more courses on scrolling
    const handleLoadMore = useCallback(() => {
        if (!loading && !isFetchingMore && pagination?.next_page) {
            dispatch(loadMoreCourses(pagination.next_page));
        }
    }, [dispatch, loading, isFetchingMore, pagination]);

    // Set up intersection observer for infinite scroll sentinel
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    handleLoadMore();
                }
            },
            { rootMargin: "200px" }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [handleLoadMore]);

    return (
        <section className="bg-white px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto pt-8 pb-6 border-b border-[#E9EAF0]">
                {/* Top Row: Filter, Search, Sort */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

                    {/* Left: Filter & Search */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">

                        {/* Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 h-[48px] px-5 border border-[#5624D0] bg-[#F5F4FF] text-[#5624D0] rounded-[4px] font-semibold text-[15px] transition-colors hover:bg-[#ebe6ff] shrink-0 w-full sm:w-auto"
                        >
                            <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={2.5} />
                            <span>Filter</span>
                            <span className="w-6 h-6 flex items-center justify-center bg-[#5624D0] text-white text-[12px] font-bold rounded ml-1">
                                {selectedSubcategories.length + selectedLevels.length + selectedRatings.length + selectedTags.length}
                            </span>
                        </button>

                        {/* Search Input */}
                        <div className="flex items-center gap-3 h-[48px] px-4 border border-[#E9EAF0] bg-white rounded-[4px] w-full sm:w-[380px] md:w-[480px] transition-colors focus-within:border-[#5624D0]">
                            <Search className="w-5 h-5 text-[#8C94A3]" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full h-full bg-transparent outline-none text-[#1D2026] text-[15px] placeholder:text-[#8C94A3]"
                            />
                        </div>

                    </div>

                    {/* Right: Sort By Dropdown */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                        <span className="text-[#8C94A3] text-[14px] whitespace-nowrap">Sort by:</span>
                        <div className="relative group shrink-0 flex-1 sm:flex-none">
                            <button className="flex items-center justify-between h-[48px] px-4 border border-[#E9EAF0] bg-white rounded-[4px] min-w-[180px] sm:min-w-[200px] w-full text-[#1D2026] text-[14px] font-medium transition-colors group-hover:border-[#8C94A3]">
                                <span>Trending</span>
                                <ChevronDown className="w-4 h-4 text-[#8C94A3] stroke-[2px]" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Row: Suggestions and Results */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-6 gap-4">

                    {/* Suggestions */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[14px]">
                        <span className="text-[#8C94A3] font-medium mr-1">Suggestion:</span>
                        <a href="#" className="text-[#FF6636] font-medium hover:underline transition-all">user interface</a>
                        <a href="#" className="text-[#FF6636] font-medium hover:underline transition-all">user experience</a>
                        <a href="#" className="text-[#FF6636] font-medium hover:underline transition-all">web design</a>
                        <a href="#" className="text-[#FF6636] font-medium hover:underline transition-all">interface</a>
                        <a href="#" className="text-[#FF6636] font-medium hover:underline transition-all">app</a>
                    </div>

                    {/* Dynamic Results Count */}
                    <div className="text-[14px] text-[#8C94A3] shrink-0 lg:text-right">
                        Showing <span className="font-bold text-[#1D2026]">{courses.length}</span> of <span className="font-bold text-[#1D2026]">{pagination?.total_results || courses.length}</span> results
                        {name && <> for "<span className="font-bold text-[#1D2026]">{name}</span>"</>}
                    </div>

                </div>
            </div>

            <div className="max-w-[1320px] mx-auto py-10 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                {isFilterOpen && (
                    <div className="w-full lg:w-[280px] xl:w-[312px] shrink-0 transition-all duration-300">
                        <Sidebar selectedSubcategories={selectedSubcategories}
                            setSelectedSubcategories={setSelectedSubcategories}
                            selectedLevels={selectedLevels}
                            setSelectedLevels={setSelectedLevels}
                            selectedRatings={selectedRatings}
                            setSelectedRatings={setSelectedRatings}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                    </div>
                )}

                {/* Right Courses Grid */}
                <div className="flex-1 min-w-0 transition-all duration-300">
                    <CoursesCard onCourseClick={handleCourseClick} isSidebarOpen={isFilterOpen} courses={courses} loading={loading} error={error} />
                    
                    {/* Infinite Scroll Sentinel and fetching states */}
                    <div ref={sentinelRef} className="w-full py-6 flex flex-col items-center justify-center">
                        {isFetchingMore && (
                            <div className="flex items-center gap-2 text-sm text-[#5624D0] font-medium">
                                <svg className="animate-spin h-5 w-5 text-[#5624D0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading more courses...</span>
                            </div>
                        )}
                        {!loading && !isFetchingMore && pagination && !pagination.next_page && courses.length > 0 && (
                            <p className="text-sm text-[#8C94A3] font-medium">
                                All courses loaded ({courses.length} of {pagination.total_results})
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseListFilter;