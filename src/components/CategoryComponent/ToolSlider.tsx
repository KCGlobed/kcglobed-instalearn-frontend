import { useRef } from "react";
import _Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Fix for Vite ESM resolving react-slick default export as an object instead of a function/class
const Slider = (_Slider as any).default || _Slider;

const toolsData = [
    { id: 1, name: "HTML 5", courses: "2,736 Courses", highlight: false },
    { id: 2, name: "CSS 3", courses: "13,932 Courses", highlight: false },
    { id: 3, name: "Javascript", courses: "52,822 Courses", highlight: false },
    { id: 4, name: "Saas", courses: "20,126 Courses", highlight: false },
    { id: 5, name: "Laravel", courses: "6,196 Courses", highlight: true },
    { id: 6, name: "Django", courses: "22,649 Courses", highlight: false },
    { id: 7, name: "React", courses: "41,200 Courses", highlight: false },
    { id: 8, name: "Vue.js", courses: "18,500 Courses", highlight: false },
];

export default function PopularToolsSlider() {
    const sliderRef = useRef<typeof Slider>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 640, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <section className="bg-white py-16 px-4 xl:px-0">
            <div className="container">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[24px] font-bold text-[#1D2026]">Popular tools</h2>

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
                        {toolsData.map((tool) => (
                            <div key={tool.id} className="px-3 py-4 outline-none">
                                <div className={`
                                    group flex flex-col items-center justify-center p-6 h-[100px] 
                                    transition-all duration-300 cursor-pointer rounded-[4px]
                                    ${tool.highlight
                                        ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-transparent scale-100'
                                        : 'bg-white border border-[#E9EAF0] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-transparent'}
                                `}>
                                    <h3 className={`font-semibold text-[15px] mb-1 transition-colors ${tool.highlight ? 'text-[#5624D0]' : 'text-[#1D2026] group-hover:text-[#5624D0]'}`}>
                                        {tool.name}
                                    </h3>
                                    <p className="text-[#8C94A3] text-[13px] font-normal tracking-wide">
                                        {tool.courses}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}