import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import { fetchCategoryFilter } from "../../store/slices/filterCategorySlice";
import { ChevronDown, ChevronUp } from "lucide-react";
import SkeltonLoader from "../Loader/SkeltonLoader";

const Sidebar = ({
    selectedSubcategories,
    setSelectedSubcategories,
    selectedLevels,
    setSelectedLevels,
    selectedRatings,
    setSelectedRatings,
    selectedTags,
    setSelectedTags,
    selectedCategory,
    handleCategoryClick,
    selectedSubcategory,
    handleSubcategoryClick,
    expandedCategories,
    setExpandedCategories
}: any) => {
    const dispatch = useAppDispatch();
    const { category: categories, tags, levels, ratings, loading } = useAppSelector((state: any) => state.filterCategory);

    const [openCategory, setOpenCategory] = useState(true);
    const [openLevel, setOpenLevel] = useState(true);
    const [openRating, setOpenRating] = useState(true);
    const [openTags, setOpenTags] = useState(true);

    useEffect(() => {
        dispatch(fetchCategoryFilter());
    }, []);

    const toggleFilter = (id: number, setSelected: any) => {
        setSelected((prev: number[]) => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            return [...prev, id];
        });
    };

    return (
        <div className="w-full bg-white flex flex-col select-none border border-[#E9EAF0] rounded-sm overflow-hidden">
            {/* Category Section */}
            <div className="p-5 pb-2 transition-all">
                <div
                    className="flex justify-between items-center mb-5 cursor-pointer"
                    onClick={() => setOpenCategory(!openCategory)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Category</h3>
                    {openCategory ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>

                {loading && (
                    <SkeltonLoader loaderType="sidebar" />
                )}

                {openCategory && !loading && (
                    <div className="space-y-1">
                        {categories?.filter((cat: any) => cat.subcategory && cat.subcategory.length > 0).map((cat: any, i: number, filteredArr: any[]) => {
                            const isOpen = expandedCategories.includes(cat.id);
                            // Category is highlighted if ANY of its subcategories are in selectedSubcategories
                            const isSelected = (cat.subcategory || []).some((sub: any) => selectedSubcategories.includes(sub.id));
                            const hasSubcategories = cat.subcategory && cat.subcategory.length > 0;

                            return (
                                <div key={cat.id}>
                                    <div
                                        className={`flex justify-between items-center cursor-pointer group rounded px-2 transition-colors ${i === 0 ? "py-2.5" : "py-3.5"} ${isSelected ? "bg-[#F5F4FF]" : "hover:bg-[#FAFAFA]"}`}
                                        onClick={() => handleCategoryClick(cat)}
                                    >
                                        <div className={`flex items-center gap-3 ${isOpen || isSelected ? "text-[#5624D0]" : "text-[#4E5566] group-hover:text-[#5624D0] transition-colors"}`}>
                                            {cat.icon && <img src={cat.icon} alt={cat.name} className="w-[18px] h-[18px]" />}
                                            <span className={`text-[14px] ${i === 0 || isOpen || isSelected ? "font-semibold" : ""}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                        {hasSubcategories && (
                                            <div
                                                className="p-1 hover:bg-[#E9EAF0] rounded transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const isExpanded = expandedCategories.includes(cat.id);
                                                    setExpandedCategories(isExpanded
                                                        ? expandedCategories.filter((id: number) => id !== cat.id)
                                                        : [...expandedCategories, cat.id]
                                                    );
                                                }}
                                            >
                                                {isOpen ? <ChevronUp className="w-4 h-4 text-[#5624D0]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subcategories Container with Smooth Max-Height and Opacity Transition */}
                                    <div
                                        className="overflow-hidden transition-all duration-300 ease-in-out pl-7 flex flex-col gap-3"
                                        style={{
                                            maxHeight: isOpen && hasSubcategories ? "500px" : "0px",
                                            opacity: isOpen && hasSubcategories ? 1 : 0,
                                            paddingTop: isOpen && hasSubcategories ? "8px" : "0px",
                                            paddingBottom: isOpen && hasSubcategories ? "12px" : "0px",
                                            pointerEvents: isOpen ? "auto" : "none"
                                        }}
                                    >
                                        {(cat.subcategory || []).map((sub: any) => {
                                            // Checkbox state purely from selectedSubcategories IDs
                                            const isChecked = selectedSubcategories.includes(sub.id);
                                            return (
                                                <label
                                                    key={sub.id}
                                                    className="flex items-center justify-between cursor-pointer group"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleSubcategoryClick(cat, sub);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-[#5624D0] border-[#5624D0]' : 'border-[#E9EAF0] bg-white group-hover:border-[#8C94A3]'}`}>
                                                            {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                        </div>
                                                        <span className={`text-[13px] transition-colors ${isChecked ? 'text-[#5624D0] font-medium' : 'text-[#4E5566]'}`}>{sub.name}</span>
                                                    </div>
                                                    <span className="text-[12px] text-[#8C94A3] ml-2">{(sub as any).count || ""}</span>
                                                </label>
                                            )
                                        })}
                                    </div>

                                    {i < filteredArr.length - 1 && <div className="h-px bg-[#E9EAF0] my-1" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Level Section */}
            <div className="border-t border-[#E9EAF0] p-5 pb-2 transition-all">
                <div
                    className="flex justify-between items-center mb-5 cursor-pointer"
                    onClick={() => setOpenLevel(!openLevel)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Course Level</h3>
                    {openLevel ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>
                {openLevel && (
                    <div className="flex flex-col gap-3.5 pb-3">
                        {levels?.filter((level: any) => level.name.toLowerCase() !== "all").map((level: any) => {
                            const isChecked = selectedLevels.includes(level.id);
                            return (
                                <label
                                    key={level.id}
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFilter(level.id, setSelectedLevels);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-[#5624D0] border-[#5624D0]' : 'border-[#E9EAF0] bg-white group-hover:border-[#8C94A3]'}`}>
                                            {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                        </div>
                                        <span className={`text-[13px] transition-colors ${isChecked ? 'text-[#5624D0] font-medium' : 'text-[#4E5566]'}`}>{level.name}</span>
                                    </div>
                                    <span className="text-[12px] text-[#8C94A3] ml-2">{level.count || ""}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rating Section */}
            <div className="border-t border-[#E9EAF0] p-5 pb-2 transition-all">
                <div
                    className="flex justify-between items-center mb-5 cursor-pointer"
                    onClick={() => setOpenRating(!openRating)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Rating</h3>
                    {openRating ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>
                {openRating && (
                    <div className="flex flex-col gap-3.5 pb-3">
                        {ratings?.map((rateObj: any) => {
                            const star = Object.keys(rateObj)[0];
                            const count = rateObj[star];
                            const starValue = parseInt(star);
                            const isSelected = selectedRatings.includes(starValue);
                            return (
                                <label
                                    key={star}
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Radio behavior: select only this one, or deselect if already selected
                                        setSelectedRatings((prev: number[]) =>
                                            prev.includes(starValue) ? [] : [starValue]
                                        );
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Radio circle indicator */}
                                        <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[#5624D0]' : 'border-[#8C94A3] group-hover:border-[#5624D0]'}`}>
                                            {isSelected && (
                                                <div className="w-[8px] h-[8px] rounded-full bg-[#5624D0]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    fill={i < starValue ? "#FD8E1F" : "#E9EAF0"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M7 0L8.57154 4.83688H13.6548L9.54163 7.82624L11.1132 12.6631L7 9.67376L2.88683 12.6631L4.45837 7.82624L0.345201 4.83688H5.42846L7 0Z" />
                                                </svg>
                                            ))}
                                            <span className={`text-[13px] ml-1 transition-colors ${isSelected ? 'text-[#5624D0] font-medium' : 'text-[#4E5566]'}`}>
                                                {starValue} & up
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[12px] text-[#8C94A3] ml-2">{count || ""}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Popular Tags Section */}
            <div className="border-t border-[#E9EAF0] p-5 pb-5 transition-all">
                <div
                    className="flex justify-between items-center mb-5 cursor-pointer"
                    onClick={() => setOpenTags(!openTags)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Popular Tags</h3>
                    {openTags ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>
                {openTags && (
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag: any) => {
                            const isChecked = selectedTags.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleFilter(tag.id, setSelectedTags)}
                                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${isChecked
                                        ? "bg-[#5624D0] text-white border-[#5624D0]"
                                        : "bg-white text-[#4E5566] border-[#E9EAF0] hover:border-[#8C94A3]"
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;