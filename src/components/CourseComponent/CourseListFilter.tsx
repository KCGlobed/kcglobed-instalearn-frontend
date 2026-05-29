import { useEffect, useState, useRef, useCallback } from "react";
import {
    SlidersHorizontal, Search, ChevronDown, ChevronUp,
} from "lucide-react";
import CoursesCard from "../Cards/CoursesCard";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useNavigate, useLocation } from "react-router-dom";
import { filterCoursesListParams, loadMoreCourses } from "../../store/slices/filterCoursesParamsSlice";
import Sidebar from "./SideBar";
import SkeltonLoader from "../Loader/SkeltonLoader";

const CourseListFilter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    // selectedSubcategories is the SINGLE SOURCE OF TRUTH for checkbox state (array of IDs)
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [name, setName] = useState("");

    // expandedCategories controls which category accordions are open
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

    // Track whether URL has been processed on initial load
    const [urlInitialized, setUrlInitialized] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Select category list & course filters from redux state
    const { category: categories } = useAppSelector((state: any) => state.filterCategory);
    const { courses, loading, error, isFetchingMore, pagination } = useAppSelector(
        (state: any) => state.filterCourseParams
    );

    // Stable refs so the scroll observer never causes re-renders
    const loadingRef = useRef(loading);
    const isFetchingMoreRef = useRef(isFetchingMore);
    const nextUrlRef = useRef<string | null>(null);

    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { isFetchingMoreRef.current = isFetchingMore; }, [isFetchingMore]);
    useEffect(() => { nextUrlRef.current = pagination?.next_page || null; }, [pagination]);

    const handleCourseClick = (course: any) => {
        navigate(`/course-details/${course.id}`);
    };

    // -------------------------------------------------------------------
    // URL → State hydration (runs only once when categories are ready)
    // Handles deep-link navigation: /courses?category=IT&subcategory=Dev
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!categories || categories.length === 0) return;
        if (urlInitialized) return;

        const searchParams = new URLSearchParams(location.search);
        const searchVal = searchParams.get("search") || "";
        const catVal = searchParams.get("category") || "";
        const subVal = searchParams.get("subcategory") || "";

        let initialSubIds: number[] = [];
        let initialExpandedIds: number[] = [];

        if (catVal) {
            const matchedCat = categories.find((c: any) =>
                c.name.toLowerCase() === catVal.toLowerCase()
            );
            if (matchedCat) {
                initialExpandedIds = [matchedCat.id];
                if (subVal) {
                    const subVals = subVal.split(",").map((s: string) => s.trim().toLowerCase());
                    const matchedSubs = (matchedCat.subcategory || []).filter((s: any) =>
                        subVals.includes(s.name.toLowerCase())
                    );
                    initialSubIds = matchedSubs.map((s: any) => s.id);
                }
            }
        } else if (searchVal) {
            // Search matching: find subcategory by name
            for (const cat of categories) {
                const sub = (cat.subcategory || []).find(
                    (s: any) => s.name.toLowerCase() === searchVal.toLowerCase()
                );
                if (sub) {
                    initialSubIds = [sub.id];
                    initialExpandedIds = [cat.id];
                    navigate(
                        `/courses?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`,
                        { replace: true }
                    );
                    break;
                }
            }
        }

        if (initialExpandedIds.length > 0) setExpandedCategories(initialExpandedIds);
        if (searchVal) setSearchQuery(searchVal);
        if (searchVal) setName(searchVal);

        if (initialSubIds.length > 0) {
            setSelectedSubcategories(initialSubIds);
        }

        setUrlInitialized(true);
    }, [categories]);

    // -------------------------------------------------------------------
    // Sync search input, filters, and expanded categories with URL params post-initialization
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!urlInitialized || !categories || categories.length === 0) return;

        const searchParams = new URLSearchParams(location.search);
        const searchVal = searchParams.get("search") || "";
        const catVal = searchParams.get("category") || "";
        const subVal = searchParams.get("subcategory") || "";

        // Sync search inputs
        setName(searchVal);
        setSearchQuery(searchVal);

        if (catVal) {
            // Case 1: Category/subcategory explicitly provided in URL
            const matchedCat = categories.find((c: any) =>
                c.name.toLowerCase() === catVal.toLowerCase()
            );
            if (matchedCat) {
                setExpandedCategories(prev => Array.from(new Set([...prev, matchedCat.id])));
                if (subVal) {
                    const subVals = subVal.split(",").map((s: string) => s.trim().toLowerCase());
                    const matchedSubs = (matchedCat.subcategory || []).filter((s: any) =>
                        subVals.includes(s.name.toLowerCase())
                    );
                    const subIds = matchedSubs.map((s: any) => s.id);
                    setSelectedSubcategories(subIds);
                } else {
                    setSelectedSubcategories([]);
                }
            }
        } else if (searchVal) {
            // Case 2: Pure search query. Let's auto-expand categories containing matching subcategories!
            const lowerSearch = searchVal.toLowerCase();
            const matchedCategoryIds: number[] = [];
            for (const cat of categories) {
                const hasMatchingSub = (cat.subcategory || []).some(
                    (sub: any) => sub.name.toLowerCase().includes(lowerSearch)
                );
                if (hasMatchingSub) {
                    matchedCategoryIds.push(cat.id);
                }
            }
            if (matchedCategoryIds.length > 0) {
                setExpandedCategories(prev => Array.from(new Set([...prev, ...matchedCategoryIds])));
            }
        } else {
            // Case 3: Empty query (e.g. cleared filters or went back to /courses)
            setSelectedSubcategories([]);
            setSelectedLevels([]);
            setSelectedRatings([]);
            setSelectedTags([]);
            setExpandedCategories([]);
        }
    }, [location.search, urlInitialized, categories]);

    // Debounced search input → URL update
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const currentSearchVal = searchParams.get("search") || "";
        if (name === currentSearchVal) return;

        const handler = setTimeout(() => {
            const newParams = new URLSearchParams();
            if (name.trim()) newParams.set("search", name.trim());
            navigate(`/courses?${newParams.toString()}`);
        }, 400);

        return () => clearTimeout(handler);
    }, [name, navigate]);

    // -------------------------------------------------------------------
    // Dispatch API whenever selected filters change (local state driven)
    // -------------------------------------------------------------------
    const dispatchFilter = useCallback((
        subIds: number[],
        levels: number[],
        ratings: number[],
        tags: number[],
        search: string
    ) => {
        dispatch(filterCoursesListParams({
            subcategory: subIds,
            name: search,
            level: levels,
            rating: ratings,
            tags: tags
        }));
    }, [dispatch]);

    // Sync courses from Redux to local state
    useEffect(() => {
        setFilteredCourses(courses);
    }, [courses]);

    // -------------------------------------------------------------------
    // Subcategory checkbox toggle — cross-category multi-select
    // -------------------------------------------------------------------
    const handleSubcategoryClick = (parentCat: any, sub: any) => {
        setExpandedCategories(prev =>
            prev.includes(parentCat.id) ? prev : [...prev, parentCat.id]
        );

        setSelectedSubcategories(prev =>
            prev.includes(sub.id)
                ? prev.filter(id => id !== sub.id)
                : [...prev, sub.id]
        );
    };

    // -------------------------------------------------------------------
    // Category row click — expand/collapse only, do NOT filter
    // -------------------------------------------------------------------
    const handleCategoryClick = (cat: any) => {
        setExpandedCategories(prev =>
            prev.includes(cat.id)
                ? prev.filter(id => id !== cat.id)
                : [...prev, cat.id]
        );
    };

    // -------------------------------------------------------------------
    // Dispatch API whenever filters or searchQuery changes
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!urlInitialized) return;
        dispatchFilter(selectedSubcategories, selectedLevels, selectedRatings, selectedTags, searchQuery);
    }, [urlInitialized, selectedSubcategories, selectedLevels, selectedRatings, selectedTags, searchQuery, dispatchFilter]);

    // -------------------------------------------------------------------
    // Clear all filters
    // -------------------------------------------------------------------
    const handleClearFilters = () => {
        setSelectedSubcategories([]);
        setSelectedLevels([]);
        setSelectedRatings([]);
        setSelectedTags([]);
        setExpandedCategories([]);
        setName("");
        setSearchQuery("");
        navigate("/courses");
    };

    // -------------------------------------------------------------------
    // Infinite scroll — callback ref pattern for dynamic sentinel
    // -------------------------------------------------------------------
    const handleLoadMore = useCallback(() => {
        if (!loadingRef.current && !isFetchingMoreRef.current && nextUrlRef.current) {
            dispatch(loadMoreCourses(nextUrlRef.current));
        }
    }, [dispatch]);

    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        if (node) {
            const observer = new IntersectionObserver(
                (entries) => { if (entries[0].isIntersecting) handleLoadMore(); },
                { rootMargin: "200px" }
            );
            observer.observe(node);
            observerRef.current = observer;
        }
    }, [handleLoadMore]);

    // -------------------------------------------------------------------
    // Derive highlight state for sidebar from selectedSubcategories IDs
    // -------------------------------------------------------------------
    const getActiveCategoryNames = (): string => {
        if (!categories || selectedSubcategories.length === 0) return "";
        const activeNames = new Set<string>();
        for (const cat of categories) {
            for (const sub of (cat.subcategory || [])) {
                if (selectedSubcategories.includes(sub.id)) {
                    activeNames.add(cat.name);
                }
            }
        }
        return Array.from(activeNames).join(",");
    };

    const activeCategoryNames = getActiveCategoryNames();

    // Matching subcategory chips for search query display
    const matchingSubcategories = searchQuery.trim()
        ? (categories || []).flatMap((cat: any) =>
            (cat.subcategory || [])
                .filter((sub: any) => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sub: any) => ({ sub, parent: cat }))
          )
        : [];

    return (
        <section className="bg-white px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto pt-8 pb-6 border-b border-[#E9EAF0]">
                {/* Top Row: Filter, Search, Sort */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

                    {/* Left: Filter & Search */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 h-[48px] px-5 border border-[#5624D0] bg-[#F5F4FF] text-[#5624D0] rounded-[4px] font-semibold text-[15px] transition-colors hover:bg-[#ebe6ff] shrink-0 w-full sm:w-auto"
                        >
                            <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={2.5} />
                            <span>Filter</span>
                            {(selectedSubcategories.length + selectedLevels.length + selectedRatings.length + selectedTags.length) > 0 && (
                                <span className="w-6 h-6 flex items-center justify-center bg-[#5624D0] text-white text-[12px] font-bold rounded ml-1">
                                    {selectedSubcategories.length + selectedLevels.length + selectedRatings.length + selectedTags.length}
                                </span>
                            )}
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

                    {/* Right: Sort By */}
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

                {/* Results count */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-6 gap-4">
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[14px]">
                        {selectedSubcategories.length > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="text-[#FF6636] font-medium hover:underline transition-all text-[13px]"
                            >
                                Clear all filters ✕
                            </button>
                        )}
                    </div>
                    <div className="text-[14px] text-[#8C94A3] shrink-0 lg:text-right">
                        Showing <span className="font-bold text-[#1D2026]">{filteredCourses.length}</span> of{" "}
                        <span className="font-bold text-[#1D2026]">{pagination?.total_results || filteredCourses.length}</span> results
                        {searchQuery && <> for "<span className="font-bold text-[#1D2026]">{searchQuery}</span>"</>}
                    </div>
                </div>
            </div>

            <div className="max-w-[1320px] mx-auto py-10 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                {isFilterOpen && (
                    <div className="w-full lg:w-[280px] xl:w-[312px] shrink-0 transition-all duration-300">
                        <Sidebar
                            selectedSubcategories={selectedSubcategories}
                            setSelectedSubcategories={setSelectedSubcategories}
                            selectedLevels={selectedLevels}
                            setSelectedLevels={setSelectedLevels}
                            selectedRatings={selectedRatings}
                            setSelectedRatings={setSelectedRatings}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            selectedCategory={activeCategoryNames}
                            handleCategoryClick={handleCategoryClick}
                            selectedSubcategory={""}
                            handleSubcategoryClick={handleSubcategoryClick}
                            expandedCategories={expandedCategories}
                            setExpandedCategories={setExpandedCategories}
                        />
                    </div>
                )}

                {/* Right Courses Grid */}
                <div className="flex-1 min-w-0 transition-all duration-300">

                    {/* Matching subcategory chips */}
                    {matchingSubcategories.length > 0 && (
                        <div className="mb-8 bg-white border border-[#E9EAF0] p-6 rounded-[6px]">
                            <h3 className="text-[16px] font-bold text-[#1D2026] mb-4">Matching Subcategories</h3>
                            <div className="flex flex-wrap gap-3">
                                {matchingSubcategories.map((item: any) => {
                                    const isActive = selectedSubcategories.includes(item.sub.id);
                                    return (
                                        <div
                                            key={item.sub.id}
                                            onClick={() => handleSubcategoryClick(item.parent, item.sub)}
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all hover:shadow-sm hover:border-[#5624D0] ${isActive ? 'border-[#5624D0] bg-[#F5F4FF] text-[#5624D0]' : 'border-[#E9EAF0] bg-white text-[#4E5566]'}`}
                                        >
                                            <span className="text-[13px] font-medium">{item.sub.name}</span>
                                            <span className="text-[11px] text-[#8C94A3]">in {item.parent.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="py-10">
                            <SkeltonLoader loaderType="course" />
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <CoursesCard
                            onCourseClick={handleCourseClick}
                            isSidebarOpen={isFilterOpen}
                            courses={filteredCourses}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <div className="py-16 text-center border border-dashed border-[#E9EAF0] rounded-[8px]">
                            <div className="w-16 h-16 bg-[#F5F4FF] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-[#5624D0]" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1D2026] mb-1">No results found</h3>
                            <p className="text-[14px] text-[#8C94A3] mb-6">We couldn't find any courses matching your filters.</p>
                            <button
                                onClick={handleClearFilters}
                                className="px-5 py-2.5 bg-[#5624D0] text-white text-[14px] font-bold rounded-[4px] hover:bg-[#461DA5] transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Infinite Scroll Sentinel — only mount after initial load */}
                    {!loading && filteredCourses.length > 0 && (
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
                            {!isFetchingMore && pagination && !pagination.next_page && (
                                <p className="text-sm text-[#8C94A3] font-medium">
                                    All courses loaded ({filteredCourses.length} of {pagination.total_results})
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CourseListFilter;