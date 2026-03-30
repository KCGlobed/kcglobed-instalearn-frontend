import { useState } from "react";
import { GraduationCap, Award, TrendingUp, Settings2, ArrowRight } from "lucide-react";

const learningFocuses = [
    {
        id: 1,
        title: "Skill-Driven Training",
        description: "Enhance your finance & accounting expertise with professional guidance and expert advice.",
        icon: <GraduationCap />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Certification Prep Made Easy",
        description: "Get ready for industry-recognized certifications with structured learning and achievement badges.",
        icon: <Award />,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Data-Driven Growth (Enterprise Plan)",
        description: "Leverage advanced analytics to track progress and drive meaningful learning outcomes.",
        icon: <TrendingUp />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
        link: "Find out more",
    },
    {
        id: 4,
        title: "Enterprise Learning, Simplified (Enterprise Plan)",
        description: "Empower your team with expert-led courses and exclusive resources for professional growth.",
        icon: <Settings2 />,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
        link: "Find out more",
    },
];

const LearningFocus = () => {
    const [activeFocus, setActiveFocus] = useState(learningFocuses[0]);

    return (
        <section className="bg-[#FFFFFE] py-12 md:py-16 px-4 xl:px-0 overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-7 px-4">
                    <h2 className="text-[20px] md:text-[24px] lg:text-[26px] font-bold text-[#1D2026] mb-2.5 leading-tight">
                        Focused Learning for Your Success.
                    </h2>
                    <p className="text-[#6E7485] text-[12px] md:text-[13px] max-w-[600px] mx-auto leading-relaxed">
                        Our features are thoughtfully designed for more practical and productive
                        learning, making it easier for you, your team, or your organization to achieve outcomes and thrive.
                    </p>
                </div>

                {/* Body */}
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch">

                    {/* Left: Cards */}
                    <div className="w-full lg:w-[42%] flex flex-col gap-2">
                        {learningFocuses.map((focus) => {
                            const isActive = activeFocus.id === focus.id;
                            return (
                                <div
                                    key={focus.id}
                                    onClick={() => setActiveFocus(focus)}
                                    className={`group p-3 md:p-3.5 rounded-lg border-2 transition-all duration-300 cursor-pointer flex gap-3 items-start
                                        ${isActive
                                            ? "border-[#5624D0] bg-white shadow-md"
                                            : "border-[#E9EAF0] bg-white lg:bg-transparent hover:border-[#5624D0]/30 hover:shadow-md"
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                                        ${isActive ? "bg-[#EBEBFF]" : "bg-gray-100 group-hover:bg-[#EBEBFF]/50"}`}
                                    >
                                        <div className={`w-4 h-4 text-[#5624D0]`}>
                                            {focus.id === 1 && <GraduationCap className="w-4 h-4 text-[#5624D0]" />}
                                            {focus.id === 2 && <Award className="w-4 h-4 text-[#5624D0]" />}
                                            {focus.id === 3 && <TrendingUp className="w-4 h-4 text-[#5624D0]" />}
                                            {focus.id === 4 && <Settings2 className="w-4 h-4 text-[#5624D0]" />}
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <h3 className={`text-[13px] md:text-[13.5px] font-bold mb-1 leading-snug transition-colors
                                            ${isActive ? "text-[#5624D0]" : "text-[#1D2026]"}`}
                                        >
                                            {focus.title}
                                        </h3>
                                        <p className={`text-[11.5px] md:text-[12px] leading-snug transition-colors
                                            ${isActive ? "text-[#4E5566]" : "text-[#6E7485]"}`}
                                        >
                                            {focus.description}
                                        </p>
                                        <div className={`mt-2 flex items-center gap-1 text-[11px] font-semibold transition-all
                                            ${isActive ? "text-[#5624D0] opacity-100" : "text-[#5624D0] opacity-0 group-hover:opacity-100"}`}
                                        >
                                            {focus.link || "Learn more"}
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Image — stretches to match card column height */}
                    <div className="w-full lg:w-[58%] relative">
                        <div className="relative rounded-xl overflow-hidden shadow-xl bg-[#F5F7FA] h-full min-h-[280px] lg:min-h-0">
                            {/* Inner border overlay */}
                            <div className="absolute inset-0 border-[6px] md:border-[8px] border-[#1D2026]/5 rounded-xl pointer-events-none z-10" />

                            {/* Images */}
                            {learningFocuses.map((focus) => (
                                <img
                                    key={focus.id}
                                    src={focus.image}
                                    alt={focus.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out
                                        ${activeFocus.id === focus.id
                                            ? "opacity-100 scale-100 translate-x-0"
                                            : "opacity-0 scale-105 translate-x-4 pointer-events-none"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 right-4 md:right-6 bg-white px-3 py-2.5 rounded-lg shadow-xl hidden md:flex items-center gap-2.5 border border-[#E9EAF0] animate-bounce-subtle z-20">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-[#6E7485] font-medium leading-none mb-1">Monthly Increase</p>
                                <p className="text-[13px] font-bold text-[#1D2026] leading-none">+24.5%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default LearningFocus;