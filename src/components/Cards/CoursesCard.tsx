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
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 rounded-[4px] overflow-hidden flex flex-col h-full"
                        onClick={() => onCourseClick?.(course)}
                    >
                        <div className="relative overflow-hidden aspect-[16/10] shrink-0">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-wrap gap-2 flex-1 mr-2">
                                    {course?.categories?.map((cat: any, index: number) => (
                                        <span key={index} style={{ backgroundColor: cat?.category_info?.bg_code, color: cat?.category_info?.text_code }} className="px-2 py-0.5 text-[10px] font-bold uppercase w-fit">
                                            {cat?.category_info?.name}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[#FF6636] font-bold text-[18px] shrink-0">
                                    ₹{course?.price}
                                </span>
                            </div>

                            <h3 className="text-[#1D2026] text-sm font-medium mb-4 line-clamp-2 min-h-[40px] group-hover:text-[#5624D0] transition-colors leading-[20px]">
                                {course.name}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                                    <span className="text-[#1D2026] text-[13px] font-semibold">5.0</span>
                                </div>
                                <div className="text-[12px] text-[#4E5566]">
                                    <span className="font-semibold">265.7K</span> students
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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