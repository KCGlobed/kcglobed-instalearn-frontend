import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import _Slider from "react-slick";
import { 
    ArrowLeft, 
    ArrowRight, 
    Cpu, 
    Briefcase, 
    CreditCard, 
    PenTool, 
    Activity, 
    Camera, 
    BookOpen 
} from "lucide-react";
import { getTopCategoriesApi } from "../../utils/service";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Fix for Vite ESM resolving react-slick default export as an object instead of a function/class
const Slider = (_Slider as any).default || _Slider;

const ToolSkeleton = () => (
    <div className="animate-pulse flex items-center gap-6 py-4">
        {[...Array(4)].map((_, i) => (
            <div 
                key={i} 
                className="flex-grow flex-shrink-0 w-[240px] p-5 h-[110px] bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-4 animate-pulse"
            >
                <div className="w-14 h-14 bg-gray-200/80 rounded-sm animate-pulse shrink-0" />
                <div className="flex flex-col flex-1 space-y-2">
                    <div className="h-5 bg-gray-200/80 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-200/80 rounded w-1/2 animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

const fallbackCategories = [
    { id: 3, name: "Development", total_courses: 2736, bg_code: "#EBEBFF", text_code: "#5624D0" },
    { id: 2, name: "Finance & Accounting", total_courses: 13932, bg_code: "#FFF2E5", text_code: "#FF6636" },
    { id: 26, name: "Design", total_courses: 52822, bg_code: "#FFEEE8", text_code: "#E1306C" },
    { id: 17, name: "Business", total_courses: 20126, bg_code: "#E1F7E3", text_code: "#23BD33" },
    { id: 15, name: "Health & Fitness", total_courses: 6196, bg_code: "#E1F7E3", text_code: "#1D2026" },
    { id: 23, name: "Lifestyle", total_courses: 22649, bg_code: "#FFF2E5", text_code: "#1D2026" },
];

export default function PopularToolsSlider() {
    const sliderRef = useRef<typeof Slider>(null);
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        getTopCategoriesApi()
            .then((res: any) => {
                if (!isMounted) return;
                const data = res?.data || res;
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    setCategories([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching categories in ToolSlider:", err);
                if (isMounted) setCategories([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    const categoriesToRender = categories.length > 0 ? categories : fallbackCategories;

    const getFallbackIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("business")) return <Briefcase className="w-6 h-6 text-[#23BD33]" />;
        if (lowerName.includes("finance") || lowerName.includes("account")) return <CreditCard className="w-6 h-6 text-[#FF6636]" />;
        if (lowerName.includes("design")) return <PenTool className="w-6 h-6 text-[#FD8E1F]" />;
        if (lowerName.includes("health") || lowerName.includes("fitness")) return <Activity className="w-6 h-6 text-[#23BD33]" />;
        if (lowerName.includes("camera") || lowerName.includes("photography")) return <Camera className="w-6 h-6 text-[#5624D0]" />;
        if (lowerName.includes("code") || lowerName.includes("software") || lowerName.includes("develop") || lowerName.includes("it")) return <BookOpen className="w-6 h-6 text-[#5624D0]" />;
        return <Cpu className="w-6 h-6 text-[#5624D0]" />;
    };

    if (loading) {
        return (
            <section className="bg-white py-16 px-4 xl:px-0">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[24px] font-bold text-[#1D2026]">Popular categories</h2>
                    </div>
                    <ToolSkeleton />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-16 px-4 xl:px-0">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[24px] font-bold text-[#1D2026]">Popular categories</h2>
 
                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => sliderRef.current?.slickPrev()}
                            className="bg-transparent border-none text-[#FF6636] hover:text-[#ff4e1a] transition-colors p-2 cursor-pointer focus:outline-none"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                        <button
                            onClick={() => sliderRef.current?.slickNext()}
                            className="bg-transparent border-none text-[#8C94A3] hover:text-[#1D2026] transition-colors p-2 cursor-pointer focus:outline-none"
                            aria-label="Next slide"
                        >
                            <ArrowRight className="w-5 h-5 stroke-[1.5px]" />
                        </button>
                    </div>
                </div>

                {/* Slider Component */}
                <div className="-mx-3"> {/* Negative margin to offset inner padding of react-slick items */}
                    <Slider ref={sliderRef} {...settings}>
                        {categoriesToRender.map((cat) => (
                            <div key={cat.id} className="px-3 py-4 outline-none">
                                <div 
                                    onClick={() => navigate(`/categories/${cat.id}`, { state: { categoryName: cat.name } })}
                                    className="group flex items-center gap-4 p-5 h-[110px] transition-all duration-300 cursor-pointer rounded-sm hover:shadow-md border border-[#E9EAF0]/40"
                                    style={{
                                        backgroundColor: cat.bg_code || '#F5F4FF',
                                    }}
                                >
                                    {/* Icon Container */}
                                    <div className="w-14 h-14 min-w-[56px] rounded-sm bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm shrink-0">
                                        {cat.icon ? (
                                            <img
                                                src={cat.icon}
                                                alt={cat.name}
                                                className="w-7 h-7 object-contain"
                                            />
                                        ) : (
                                            getFallbackIcon(cat.name)
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex flex-col min-w-0 pr-1">
                                        <h3 
                                            className="font-bold text-[16px] leading-tight mb-1.5 capitalize whitespace-normal"
                                            style={{
                                                color: cat.text_code || '#1D2026'
                                            }}
                                        >
                                            {cat.name}
                                        </h3>
                                        <p className="text-[#8C94A3] text-[13px] font-medium leading-none">
                                            {(cat.total_courses || 0).toLocaleString()} Courses
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}