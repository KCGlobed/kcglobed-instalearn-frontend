import { Star } from "lucide-react"


const CourseCardOne = ({ course }: { course: any }) => {
    return (
        <div
            key={course.id}
            className="bg-white group cursor-pointer border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 rounded-[4px] overflow-hidden"
        >
            <div className="relative overflow-hidden aspect-[16/10]">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col min-h-[180px]">
                <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${course.categoryBg} ${course.categoryText}`}>
                        {course.category}
                    </span>
                    <span className="text-[#FF6636] font-bold text-[18px]">
                        {course.price}
                    </span>
                </div>

                <h3 className="text-[#1D2026] text-sm font-medium mb-4 line-clamp-2 h-10 group-hover:text-[#5624D0] transition-colors leading-[20px]">
                    {course.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FD8E1F] fill-[#FD8E1F]" />
                        <span className="text-[#1D2026] text-[13px] font-semibold">{course.rating}</span>
                    </div>
                    <div className="text-[12px] text-[#4E5566]">
                        <span className="font-semibold">{course.students}</span> students
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseCardOne