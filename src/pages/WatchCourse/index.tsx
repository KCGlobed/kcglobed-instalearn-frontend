import { useState } from "react";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Download,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Settings,
    Maximize,
    Monitor,
    MessageCircle,
    Copy,
    CheckCircle,
} from "lucide-react";
import MainHeader from "../../layouts/MainHeader";
import Footer from "../../layouts/Footer";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const VideoPlayer = ({ thumbnail }: { thumbnail: string }) => {
    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black group">
            {/* Thumbnail */}
            <img
                src={thumbnail}
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />

            {/* Play Overlay (Initial state) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#5624D0] text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(86,36,208,0.5)] transform scale-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <Play className="w-8 h-8 fill-current ml-1" />
                </div>
            </div>

            {/* Control Bar (Simplified Simulation) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-0 opacity-100 transition-all duration-300 group-hover:pointer-events-auto">
                {/* Progress bar */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress">
                    <div className="absolute left-0 top-0 h-full w-[40%] bg-[#FF4B2B] rounded-full" />
                    <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-[#FF4B2B] scale-0 group-hover/progress:scale-100 transition-transform" />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4 md:gap-5">
                        <button className="hover:text-[#5624D0] transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                        <button className="hover:text-[#5624D0] transition-colors"><Play className="w-6 h-6 fill-current" /></button>
                        <button className="hover:text-[#5624D0] transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
                        <span className="text-[13px] font-medium ml-2 tabular-nums">1:25 / 9:15</span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-5">
                        <button className="hover:text-[#5624D0] transition-colors"><Volume2 className="w-5 h-5" /></button>
                        <button className="hover:text-[#5624D0] transition-colors"><Monitor className="w-5 h-5" /></button>
                        <button className="hover:text-[#5624D0] transition-colors"><Settings className="w-5 h-5" /></button>
                        <button className="hover:text-[#5624D0] transition-colors"><Maximize className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseSidebar = () => {
    const [openSections, setOpenSections] = useState<number[]>([1]);

    const toggleSection = (id: number) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    const sections = [
        {
            id: 1,
            title: "Getting Started",
            lectures: 4,
            duration: "51m",
            progress: "25% finish (1/4)",
            items: [
                { title: "1. What is Webflow?", duration: "07:31", completed: true, active: false },
                { title: "2. Sign up in Webflow", duration: "07:31", completed: false, active: true },
                { title: "3. Teaser of Webflow", duration: "07:31", completed: false, active: false },
                { title: "4. Figma Introduction", duration: "07:31", completed: false, active: false },
            ]
        },
        { id: 2, title: "Secret of Good Design", lectures: 52, duration: "5h 49m", progress: "0% finish (0/52)", items: [] },
        { id: 3, title: "Practice Design Like an Artist", lectures: 43, duration: "51m", progress: "0% finish (0/43)", items: [] },
        { id: 4, title: "Web Development (webflow)", lectures: 137, duration: "10h 6m", progress: "0% finish (0/137)", items: [] },
        { id: 5, title: "Secrets of Making Money Freelancing", lectures: 21, duration: "38m", progress: "0% finish (0/21)", items: [] },
        { id: 6, title: "Advanced", lectures: 39, duration: "1h 31m", progress: "0% finish (0/39)", items: [] },
        { id: 7, title: "What's Next", lectures: 7, duration: "1h 17m", progress: "0% finish (0/7)", items: [] },
    ];

    return (
        <div className="bg-white border border-[#E9EAF0] shadow-[0_12px_48px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden h-fit sticky top-24">
            <div className="p-6 border-b border-[#E9EAF0] bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#1D2026]">Course Contents</h3>
                    <span className="text-[14px] font-bold text-[#20B486]">15% Completed</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#E9EAF0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#20B486] transition-all duration-700" style={{ width: "15%" }} />
                </div>
            </div>

            <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                {sections.map(section => (
                    <div key={section.id} className="border-b border-[#E9EAF0] last:border-0">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className={`w-full flex items-center justify-between px-6 py-5 transition-all outline-none ${openSections.includes(section.id) ? 'bg-[#fcfcff]' : 'bg-white hover:bg-[#F9FAFB]'}`}
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <span className={`flex items-center gap-2 mb-2 font-bold text-[14px] transition-colors ${openSections.includes(section.id) ? 'text-[#5624D0]' : 'text-[#1D2026]'}`}>
                                    {openSections.includes(section.id) ? <ChevronUp className="w-4 h-4 stroke-[3px]" /> : <ChevronDown className="w-4 h-4 stroke-[3px]" />}
                                    <span className="truncate">{section.title}</span>
                                </span>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6E7485] font-semibold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><Play className="w-3 h-3 text-[#5624D0]" /> {section.lectures} lectures</span>
                                    <span className="flex items-center gap-1.5"><Settings className="w-3 h-3 text-[#5624D0]" /> {section.duration}</span>
                                    <span className="flex items-center gap-1.5 text-[#20B486]"><CheckCircle className="w-3 h-3" /> {section.progress}</span>
                                </div>
                            </div>
                        </button>

                        {openSections.includes(section.id) && section.items.length > 0 && (
                            <div className="bg-[#f3f4ff]/20 border-t border-[#E9EAF0] py-1">
                                {section.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-3 px-6 py-4 hover:bg-white transition-all cursor-pointer group ${item.active ? 'bg-white shadow-[0_2px_15px_rgba(86,36,208,0.06)]' : ''}`}
                                    >
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <input
                                                type="checkbox"
                                                readOnly
                                                checked={item.completed}
                                                className="w-5 h-5 border-2 border-[#E9EAF0] rounded-sm checked:bg-[#5624D0] checked:border-[#5624D0] focus:ring-0 transition-all cursor-pointer appearance-none checked:after:content-['✓'] after:text-white after:font-bold after:text-[12px] after:flex after:items-center after:justify-center"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] font-bold leading-tight truncate ${item.active ? 'text-[#5624D0]' : 'text-[#1D2026] group-hover:text-[#5624D0]'}`}>
                                                {item.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {item.active ? (
                                                <div className="flex gap-0.5">
                                                    <div className="w-0.5 h-3 bg-[#5624D0] rounded-full animate-bounce" />
                                                    <div className="w-0.5 h-3 bg-[#5624D0] rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <div className="w-0.5 h-3 bg-[#5624D0] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                </div>
                                            ) : (
                                                <Play className="w-3.5 h-3.5 text-[#8C94A3] group-hover:text-[#5624D0] transition-colors" />
                                            )}
                                            <span className="text-[12px] font-bold text-[#8C94A3] tabular-nums">{item.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TabContent = () => {
    const [activeTab, setActiveTab] = useState("Description");

    const tabs = ["Description", "Lectures Notes", "Attach File", "Comments"];

    return (
        <div className="mt-8">
            <div className="flex items-center gap-8 border-b border-[#E9EAF0] mb-8 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-[15px] font-bold transition-all relative whitespace-nowrap outline-none ${activeTab === tab ? 'text-[#5624D0]' : 'text-[#6E7485] hover:text-[#1D2026]'}`}
                    >
                        {tab}
                        {tab === "Attach File" && <span className="ml-2 px-2 py-0.5 bg-[#F5F4FF] text-[#5624D0] text-[10px] rounded-full font-extrabold border border-[#5624D0]/10 italic">01</span>}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#5624D0] rounded-t-full shadow-[0_-2px_10px_rgba(86,36,208,0.3)] animate-fadeIn" />
                        )}
                    </button>
                ))}
            </div>

            <div className="transition-all duration-300">
                {activeTab === "Description" && (
                    <div className="space-y-12 animate-fadeIn">
                        <section>
                            <h2 className="text-2xl font-bold text-[#1D2026] mb-5">Lectures Description</h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-[16px] leading-[1.8] text-[#4E5566]">
                                    We cover everything you need to build your first website. From creating your first page through to uploading your website to the internet. 
                                    We'll use the world's most popular (and free) web design tool called Visual Studio Code. There are exercise files you can download and then 
                                    work along with me. At the end of each video I have a downloadable version of where we are in the process so that you can compare your 
                                    project with mine. This will enable you to see easily where you might have a problem. We will delve into all the good stuff such as how to 
                                    create your very own mobile burger menu from scratch learning some basic JavaScript and jQuery.
                                </p>
                                <p className="text-[16px] leading-[1.8] text-[#4E5566] mt-5">
                                    If that all sounds a little too fancy - don't worry, this course is aimed at people new to web design and who have never coded before. We'll 
                                    start right at the beginning and work our way through step by step.
                                </p>
                            </div>
                        </section>

                        <section className="bg-[#F5F7FA] p-8 rounded-2xl border border-[#E9EAF0]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-[#1D2026]">Lecture Notes</h2>
                                    <p className="text-[14px] text-[#6E7485] mt-1">Downloadable materials for this lecture</p>
                                </div>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5624D0] text-white rounded-xl text-[14px] font-bold hover:bg-[#461DA5] shadow-lg shadow-[#5624D0]/20 transition-all active:scale-95">
                                    <Download className="w-4.5 h-4.5" />
                                    Download Notes
                                </button>
                            </div>
                            <div className="p-5 bg-white rounded-xl border border-[#E9EAF0] text-[15px] italic text-[#6E7485] leading-relaxed">
                                "In ut aliquet ante. Curabitur mollis tincidunt turpis, sed aliquam mauris finibus vel. Praesent eget mi in mi maximus egestas. Mauris eget ipsum in justo bibendum pellentesque. Sed id arcu in arcu ullamcorper eleifend condimentum quis diam. Phasellus tempus, urna ut auctor mattis."
                            </div>
                        </section>
                    </div>
                )}
                {activeTab !== "Description" && (
                    <div className="py-20 text-center bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#E9EAF0]">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Monitor className="w-8 h-8 text-[#E9EAF0]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D2026] mb-2">{activeTab}</h3>
                        <p className="text-[#6E7485] font-medium max-w-xs mx-auto">This section is currently being updated with fresh content. Please check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main WatchCourse Component ──────────────────────────────────────────────

const WatchCourse = () => {
    return (
        <div className="bg-[#FCFCFD] min-h-screen">
            <MainHeader />

            {/* ── Top Header (Sticky on scroll if needed, but following layout) ── */}
            <div className="bg-white border-b border-[#E9EAF0] sticky top-0 z-[100]">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[74px] md:h-[84px] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <button className="p-2.5 bg-[#F5F7FA] text-[#1D2026] rounded-xl hover:bg-[#5624D0] hover:text-white transition-all group shrink-0 shadow-sm">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform stroke-[2.5px]" />
                        </button>
                        <div className="min-w-0 hidden sm:block">
                            <h1 className="text-[17px] lg:text-[19px] font-bold text-[#1D2026] leading-tight truncate tracking-tight">
                                Complete Website Responsive Design: From Figma to Webflow to Website Design
                            </h1>
                            <div className="flex items-center gap-5 mt-1.5 overflow-x-auto scrollbar-hide">
                                <span className="flex items-center gap-2 text-[12px] text-[#6E7485] font-bold uppercase tracking-wider">
                                    <Copy className="w-3.5 h-3.5 text-[#5624D0]" /> 6 Sections
                                </span>
                                <span className="flex items-center gap-2 text-[12px] text-[#6E7485] font-bold uppercase tracking-wider">
                                    <Play className="w-3.5 h-3.5 text-[#5624D0]" /> 202 lectures
                                </span>
                                <span className="flex items-center gap-2 text-[12px] text-[#6E7485] font-bold uppercase tracking-wider">
                                    <Volume2 className="w-3.5 h-3.5 text-[#5624D0]" /> 19h 37m
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button className="hidden lg:flex px-7 h-[46px] items-center text-[14px] font-bold text-[#1D2026] border-2 border-[#E9EAF0] rounded-xl hover:border-[#5624D0] hover:text-[#5624D0] transition-all bg-white">
                            Write A Review
                        </button>
                        <button className="flex px-7 h-[46px] items-center text-[14px] font-bold text-white bg-[#5624D0] rounded-xl hover:bg-[#461DA5] shadow-[0_8px_20px_rgba(86,36,208,0.25)] transition-all active:scale-95">
                            Next Lecture
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 lg:py-10">
                <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                    
                    {/* Left Column (Content area) */}
                    <div className="flex-1 min-w-0">
                        <VideoPlayer thumbnail="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" />

                        <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#E9EAF0]">
                            <div className="flex-1 min-w-0 pr-4">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1D2026] mb-6 tracking-tight">2. Sign up in Webflow</h2>
                                <div className="flex items-center gap-5">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4, 5].map(idx => (
                                            <img
                                                key={idx}
                                                src={`https://i.pravatar.cc/150?u=${idx + 22}`}
                                                className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-sm bg-gray-100"
                                                alt="User"
                                            />
                                        ))}
                                    </div>
                                    <div className="pl-2 border-l-2 border-[#E9EAF0]">
                                        <p className="text-[16px] font-extrabold text-[#1D2026] leading-none mb-1">512</p>
                                        <p className="text-[13px] text-[#6E7485] font-bold uppercase tracking-tighter">Students watching</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[13px] font-bold tracking-tight">
                                <div className="flex flex-col">
                                    <span className="text-[#8C94A3] text-[11px] uppercase tracking-wider mb-1">Last updated</span>
                                    <span className="text-[#1D2026]">Oct 26, 2020</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#8C94A3] text-[11px] uppercase tracking-wider mb-1">Total Comments</span>
                                    <span className="flex items-center gap-1.5 text-[#5624D0]">
                                        <MessageCircle className="w-4 h-4 fill-[#5624D0]/10" />
                                        154
                                    </span>
                                </div>
                            </div>
                        </div>

                        <TabContent />
                    </div>

                    {/* Right Column (Sidebar contents) */}
                    <div className="w-full xl:w-[400px] shrink-0">
                        <CourseSidebar />
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E9EAF0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #5624D0;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WatchCourse;