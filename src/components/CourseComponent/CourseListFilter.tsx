import { useEffect, useState, useRef, useCallback } from "react";
import {
    SlidersHorizontal, Search, ChevronDown,
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
    const [ordering, setOrdering] = useState<string>("");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement | null>(null);

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
    // Hydrate sort dropdown click-outside behavior
    // -------------------------------------------------------------------
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        const orderingVal = searchParams.get("ordering") || "";

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
        if (orderingVal) setOrdering(orderingVal);

        if (initialSubIds.length > 0) {
            setSelectedSubcategories(initialSubIds);
        }

        setUrlInitialized(true);
    }, [categories]);

    // -------------------------------------------------------------------
    // Sync filters and expanded categories with URL params post-initialization
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!urlInitialized || !categories || categories.length === 0) return;

        const searchParams = new URLSearchParams(location.search);
        const searchVal = searchParams.get("search") || "";
        const catVal = searchParams.get("category") || "";
        const subVal = searchParams.get("subcategory") || "";
        const orderingVal = searchParams.get("ordering") || "";

        setSearchQuery(searchVal);
        setOrdering(orderingVal);

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
            // Case 2: Pure search query — auto-expand matching categories
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
            // Case 3: Empty query (cleared filters or navigated back to /courses)
            setSelectedSubcategories([]);
            setSelectedLevels([]);
            setSelectedRatings([]);
            setSelectedTags([]);
            setExpandedCategories([]);
        }
    }, [location.search, urlInitialized, categories]);

    // -------------------------------------------------------------------
    // Dispatch API whenever selected filters change (local state driven)
    // -------------------------------------------------------------------
    const dispatchFilter = useCallback((
        subIds: number[],
        levels: number[],
        ratings: number[],
        tags: number[],
        search: string,
        order: string
    ) => {
        dispatch(filterCoursesListParams({
            subcategory: subIds,
            name: search,
            level: levels,
            rating: ratings,
            tags: tags,
            ordering: order
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
        dispatchFilter(selectedSubcategories, selectedLevels, selectedRatings, selectedTags, searchQuery, ordering);
    }, [urlInitialized, selectedSubcategories, selectedLevels, selectedRatings, selectedTags, searchQuery, ordering, dispatchFilter]);

    // -------------------------------------------------------------------
    // Clear all filters
    // -------------------------------------------------------------------
    const handleClearFilters = () => {
        setSelectedSubcategories([]);
        setSelectedLevels([]);
        setSelectedRatings([]);
        setSelectedTags([]);
        setExpandedCategories([]);
        setSearchQuery("");
        setOrdering("");
        navigate("/courses");
    };

    // -------------------------------------------------------------------
    // Sort dropdown change handler — updates URL query params
    // -------------------------------------------------------------------
    const handleSortChange = (value: string) => {
        const searchParams = new URLSearchParams(location.search);
        if (value) {
            searchParams.set("ordering", value);
        } else {
            searchParams.delete("ordering");
        }
        navigate(`/courses?${searchParams.toString()}`);
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

    const sortOptions = [
        { label: "Trending", value: "" },
        { label: "Newest", value: "-created_at" },
        { label: "Most Reviewed", value: "-total_reviews" },
        { label: "Most Rated", value: "-avg_rating" }
    ];

    const currentOption = sortOptions.find(opt => opt.value === ordering) || sortOptions[0];

    const activeFilterCount = selectedSubcategories.length + selectedLevels.length + selectedRatings.length + selectedTags.length;

    return (
        <section className="bg-white px-4 xl:px-0">
            <div className="max-w-[1320px] mx-auto">

                {/* ── Toolbar: single unified row ── */}
                <div className="flex items-center justify-between gap-4 py-4 border-b border-[#E9EAF0]">

                    {/* LEFT: Filter button + divider + results count */}
                    <div className="flex items-center gap-0 min-w-0">

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 h-[42px] px-4 border rounded-[4px] font-semibold text-[14px] transition-all shrink-0 ${
                                isFilterOpen
                                    ? "border-[#5624D0] bg-[#F5F4FF] text-[#5624D0] hover:bg-[#ebe6ff]"
                                    : "border-[#E9EAF0] bg-white text-[#4E5566] hover:border-[#5624D0] hover:text-[#5624D0] hover:bg-[#F5F4FF]"
                            }`}
                        >
                            <SlidersHorizontal className="w-[16px] h-[16px]" strokeWidth={2.5} />
                            <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 flex items-center justify-center bg-[#5624D0] text-white text-[11px] font-bold rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Vertical divider */}
                        <div className="w-px h-6 bg-[#E9EAF0] mx-4 shrink-0" />

                        {/* Results count */}
                        <p className="text-[14px] text-[#6E7485] truncate">
                            <span className="font-semibold text-[#1D2026]">
                                {pagination?.total_results || filteredCourses.length}
                            </span>{" "}
                            results
                            {searchQuery && (
                                <> for{" "}
                                    <span className="font-semibold text-[#5624D0]">"{searchQuery}"</span>
                                </>
                            )}
                        </p>

                        {/* Clear filters pill (only when active) */}
                        {activeFilterCount > 0 && (
                            <>
                                <div className="w-px h-6 bg-[#E9EAF0] mx-4 shrink-0" />
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-1.5 text-[13px] text-[#FF6636] font-medium hover:underline whitespace-nowrap shrink-0"
                                >
                                    Clear filters
                                    <span className="text-[11px]">✕</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* RIGHT: Sort By */}
                    <div className="flex items-center gap-2.5 shrink-0 z-20">
                        <span className="text-[#6E7485] text-[13px] whitespace-nowrap hidden sm:block">Sort by</span>
                        <div ref={sortDropdownRef} className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 h-[42px] px-4 border border-[#E9EAF0] bg-white rounded-[4px] min-w-[160px] text-[#1D2026] text-[14px] font-medium transition-colors hover:border-[#5624D0] hover:bg-[#F5F4FF]"
                            >
                                <span className="flex-1 text-left">{currentOption?.label || "Trending"}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#8C94A3] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                                    strokeWidth={2}
                                />
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-full min-w-[160px] bg-white border border-[#E9EAF0] rounded-[6px] shadow-xl py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleSortChange(option.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors flex items-center justify-between gap-2 ${
                                                ordering === option.value
                                                    ? "bg-[#F5F4FF] text-[#5624D0] font-semibold"
                                                    : "text-[#1D2026] hover:bg-[#F5F4FF] hover:text-[#5624D0]"
                                            }`}
                                        >
                                            {option.label}
                                            {ordering === option.value && (
                                                <span className="w-2 h-2 rounded-full bg-[#5624D0] shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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