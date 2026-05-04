import CourseHeader from '../../components/CourseDetail/CourseHeader';
import CoursePreview from '../../components/CourseDetail/CoursePreview';
import CourseTabs from '../../components/CourseDetail/CourseTabs';
import CourseSidebar from '../../components/CourseDetail/CourseSidebar';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { useEffect } from 'react';
import { fetchCourseById } from '../../store/slices/courseDetailSlice';


const CourseDetail = () => {
    const { id } = useParams();
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);

    const dispatch = useAppDispatch();

    console.log(courseDetail, "courseDetail");

    useEffect(() => {
        dispatch(fetchCourseById(Number(id)));
    }, [id]);



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
            <Footer />
        </>
    );
};

export default CourseDetail;