import { useState } from "react";
import {
    SlidersHorizontal, Search, ChevronDown, ChevronUp,
    Cpu, Handshake, CreditCard, Monitor, Briefcase, Book, PenTool,
    Megaphone, Box, Camera, Headphones, HeartPulse
} from "lucide-react";
import CoursesCard from "../Cards/CoursesCard";


const Sidebar = () => {
    // Accordion State
    const [openCategory, setOpenCategory] = useState(true);
    const [openDevelopment, setOpenDevelopment] = useState(true);
    const [openRating, setOpenRating] = useState(true);

    // Initial subcategories state for Development
    const [subcategories, setSubcategories] = useState([
        { name: "Web development", count: "574", checked: false },
        { name: "Data Science", count: "568", checked: false },
        { name: "Mobile Development", count: "1345", checked: true },
        { name: "Software Testing", count: "317", checked: false },
        { name: "Software Engineering", count: "31", checked: false },
        { name: "Software Development Tools", count: "558", checked: false },
        { name: "No-Code Development", count: "37", checked: false },
    ]);

    const toggleSubcategory = (index: number) => {
        const newSubs = [...subcategories];
        newSubs[index].checked = !newSubs[index].checked;
        setSubcategories(newSubs);
    };

    return (
        <div className="w-full bg-white flex flex-col select-none">
            {/* Category Section */}
            <div className="border border-[#E9EAF0] p-5 pb-2 transition-all">
                <div
                    className="flex justify-between items-center mb-5 cursor-pointer"
                    onClick={() => setOpenCategory(!openCategory)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Category</h3>
                    {openCategory ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>

                {openCategory && (
                    <div className="space-y-1">
                        {/* Development Dropdown */}
                        <div>
                            <div
                                className="flex justify-between items-center py-2.5 cursor-pointer group"
                                onClick={() => setOpenDevelopment(!openDevelopment)}
                            >
                                <div className={`flex items-center gap-3 ${openDevelopment ? "text-[#5624D0]" : "text-[#4E5566] group-hover:text-[#5624D0] transition-colors"}`}>
                                    <Cpu className="w-[18px] h-[18px]" strokeWidth={openDevelopment ? 2 : 1.5} />
                                    <span className="text-[14px] font-medium">Development</span>
                                </div>
                                {openDevelopment ? <ChevronUp className="w-4 h-4 text-[#5624D0]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                            </div>

                            {/* Subcategories */}
                            {openDevelopment && (
                                <div className="pl-7 flex flex-col gap-3.5 py-3 pb-5">
                                    {subcategories.map((sub, i) => (
                                        <label
                                            key={i}
                                            className="flex items-center justify-between cursor-pointer group"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSubcategory(i);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${sub.checked ? 'bg-[#5624D0] border-[#5624D0]' : 'border-[#E9EAF0] bg-white group-hover:border-[#8C94A3]'}`}>
                                                    {sub.checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                </div>
                                                <span className={`text-[13px] transition-colors ${sub.checked ? 'text-[#5624D0] font-medium' : 'text-[#4E5566]'}`}>{sub.name}</span>
                                            </div>
                                            <span className="text-[12px] text-[#8C94A3] ml-2">{sub.count}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-[#E9EAF0] my-1" />

                        {/* Other Categories */}
                        {[
                            { icon: Handshake, name: "Business" },
                            { icon: CreditCard, name: "Finance & Accounting" },
                            { icon: Monitor, name: "IT & Software" },
                            { icon: Briefcase, name: "Office Productivity" },
                            { icon: Book, name: "Personal Development" },
                            { icon: PenTool, name: "Design" },
                            { icon: Megaphone, name: "Marketing" },
                            { icon: Box, name: "Lifestyle" },
                            { icon: Camera, name: "Photography & Video" },
                            { icon: Headphones, name: "Music" },
                            { icon: HeartPulse, name: "Health & Fitness" },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center py-3.5 cursor-pointer group">
                                    <div className="flex items-center gap-3 text-[#4E5566] group-hover:text-[#5624D0] transition-colors">
                                        <cat.icon className="w-[18px] h-[18px] stroke-[1.5px]" />
                                        <span className="text-[14px]">{cat.name}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-[#8C94A3]" />
                                </div>
                                {i < 10 && <div className="h-px bg-[#E9EAF0] mt-1" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Section Stub */}
            <div className="border border-[#E9EAF0] border-t-0 p-5 bg-white transition-all">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setOpenRating(!openRating)}
                >
                    <h3 className="text-[#1D2026] font-bold text-[14px] uppercase tracking-wide">Rating</h3>
                    {openRating ? <ChevronUp className="w-4 h-4 text-[#1D2026]" /> : <ChevronDown className="w-4 h-4 text-[#8C94A3]" />}
                </div>
                {/* Content for rating would go here when openRating is true */}
                {openRating && (
                    <div className="mt-4 text-[13px] font-medium text-[#4E5566] pb-2">
                        {/* Placeholder for rating filters */}
                        More rating options...
                    </div>
                )}
            </div>

            {/* Additional filters can be added here following same boxed layout structure */}
        </div>
    );
};


const CourseListFilter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(true);

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
                                3
                            </span>
                        </button>

                        {/* Search Input */}
                        <div className="flex items-center gap-3 h-[48px] px-4 border border-[#E9EAF0] bg-white rounded-[4px] w-full sm:w-[380px] md:w-[480px] transition-colors focus-within:border-[#5624D0]">
                            <Search className="w-5 h-5 text-[#8C94A3]" />
                            <input
                                type="text"
                                defaultValue="UI/UX Design"
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

                    {/* Results Count */}
                    <div className="text-[14px] text-[#8C94A3] shrink-0 lg:text-right">
                        <span className="font-bold text-[#1D2026]">3,145,684</span> results find for "ui/ux design"
                    </div>

                </div>
            </div>

            {/* Main Content Area: Sidebar + Course Grid */}
            <div className="max-w-[1320px] mx-auto py-10 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                {isFilterOpen && (
                    <div className="w-full lg:w-[280px] xl:w-[312px] shrink-0 transition-all duration-300">
                        <Sidebar />
                    </div>
                )}

                {/* Right Courses Grid */}
                <div className="flex-1 min-w-0 transition-all duration-300">
                    <CoursesCard isSidebarOpen={isFilterOpen} />
                </div>
            </div>
        </section>
    );
};

export default CourseListFilter;