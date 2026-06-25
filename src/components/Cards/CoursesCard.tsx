import { Star } from 'lucide-react'
import React from 'react'
import SkeltonLoader from '../Loader/SkeltonLoader';

interface CoursesCardProps {
    isSidebarOpen?: boolean;
    courses?: any[];
    loading?: boolean;
    error?: string;
    onCourseClick?: (course: any) => void;
}

const CoursesCard: React.FC<CoursesCardProps> = ({ isSidebarOpen = true, courses, loading, error, onCourseClick }) => {

    if (loading) {
        return (
            <SkeltonLoader loaderType='course' />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-lg">Error loading courses: {error}</p>
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">No courses found</p>
            </div>
        );
    }



    return (
        <div className="w-full">
            {/* Course Grid - Dynamic columns based on Sidebar State */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarOpen ? 'lg:grid-cols-3 xl:grid-cols-3' : 'lg:grid-cols-4'} gap-6 transition-all duration-300`}>
                {courses.map((course) => {
                    const instructor =
                        course.instrcutor_info?.[0]?.instructor_info ||
                        course.instructors?.[0]?.instructor_info ||
                        course.instructor_info ||
                        course.course_instructor?.[0]?.instructor ||
                        null;

                    const instructorName =
                        instructor?.text_1 ||
                        (course.created_by ? `${course.created_by.first_name} ${course.created_by.last_name}`.trim() : "") ||
                        "Super Admin";

                    const rating = Number.parseFloat(course?.avg_rating);

                    return (
                        <div
                            key={course.id}
                            className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 rounded-[4px] overflow-hidden flex flex-col h-full"
                            onClick={() => onCourseClick?.(course)}
                        >
                            <div className="relative overflow-hidden aspect-[16/10] shrink-0">
                                <img
                                    src={course.image}
                                    alt={course.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span style={{ backgroundColor: course?.categories?.[0]?.category_info?.bg_code, color: course?.categories?.[0]?.category_info?.text_code }} className={`px-2 py-0.5 text-[10px] font-bold uppercase`}>
                                        {course?.categories?.[0]?.category_info?.name}
                                    </span>
                                    <span className="text-[#FF6636] font-bold text-[18px]">
                                        ₹{course?.price}
                                    </span>
                                </div>

                                <h3 className="text-[#1D2026] text-sm font-medium mb-1 line-clamp-2 group-hover:text-[#5624D0] transition-colors leading-[20px]">
                                    {course.name}
                                </h3>

                                {instructorName && (
                                    <span className="text-[12px] text-[#8C94A3] font-normal truncate block mb-3">
                                        {instructorName}
                                    </span>
                                )}

                                <div className="mt-auto pt-3 border-t border-[#E9EAF0] flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                        <span className="text-[#1D2026] text-[13px] font-semibold">{Number.isNaN(rating) ? "0.0" : rating.toFixed(1)}</span>
                                    </div>
                                    <div className="text-[12px] text-[#4E5566]">
                                        <span className="font-semibold">180K</span> students
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
        </div>
    )
}

export default CoursesCard
