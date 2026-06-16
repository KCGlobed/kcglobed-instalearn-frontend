import CourseHeader from '../../components/CourseDetail/CourseHeader';
import CoursePreview from '../../components/CourseDetail/CoursePreview';
import CourseTabs from '../../components/CourseDetail/CourseTabs';
import CourseSidebar from '../../components/CourseDetail/CourseSidebar';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import { fetchCourseById } from '../../store/slices/courseDetailSlice';
import _Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RecommendationCard from '../../components/Cart/RecommendationCard';
import SkeltonLoader from '../../components/Loader/SkeltonLoader';
// Vite ESM fix — same pattern as ToolSlider.tsx
const Slider = (_Slider as any).default || _Slider;


const CourseDetail = () => {
    const { id } = useParams();
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    const dispatch = useAppDispatch();
    const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
    const sliderRef = useRef<typeof Slider>(null);

    const sliderSettings = {
        dots: false,
        infinite: recommendedCourses.length > 5,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 560, settings: { slidesToShow: 2 } },
            { breakpoint: 400, settings: { slidesToShow: 1 } },
        ],
    };

    useEffect(() => {
        dispatch(fetchCourseById(Number(id)));
    }, [id]);

    useEffect(() => {
        if (courseDetail?.related_course && courseDetail.related_course.length > 0) {
            setRecommendedCourses(courseDetail.related_course);
        }
    }, [courseDetail]);

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="bg-[#f9fafb] min-h-screen py-8 md:py-12">
                    <div className="container mx-auto px-4 md:px-6 lg:max-w-7xl">
                        <SkeltonLoader loaderType="course_detail" />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="bg-[#f9fafb] min-h-screen py-8 md:py-12 selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
                <div className="container mx-auto px-4 md:px-6 lg:max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Left Column (Content Section) */}
                        <div className="flex-1 w-full lg:max-w-[calc(100%-420px)] animate-fade-in-up">
                            <CourseHeader />
                            <CoursePreview />
                            <CourseTabs />
                        </div>

                        {/* Right Sidebar (Sticky Sidebar) */}
                        <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 animate-fade-in-right">
                            <CourseSidebar />
                        </aside>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 pb-8 lg:max-w-7xl">
                {/* Recommendations Section */}
                {recommendedCourses.length > 0 && (
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[18px] font-bold tracking-tight">You might also like</h2>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => (sliderRef.current as any)?.slickPrev()}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => (sliderRef.current as any)?.slickNext()}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="-mx-2">
                            <Slider ref={sliderRef} {...sliderSettings}>
                                {recommendedCourses.map((course: any, index: number) => (
                                    <div key={course.id ?? index} className="px-2 outline-none">
                                        <RecommendationCard index={index} course={course} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </section>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CourseDetail;