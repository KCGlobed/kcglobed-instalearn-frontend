import { Star } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';

const CourseHeader = () => {
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    return (
        <div className="mb-8">
            {/* Breadcrumb */}
            {/* <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 font-medium">
                <span className="hover:text-amber-600 cursor-pointer">Home</span>
                <span>&gt;</span>
                <span className="hover:text-amber-600 cursor-pointer">Development</span>
                <span>&gt;</span>
                <span className="hover:text-amber-600 cursor-pointer">Web Development</span>
                <span>&gt;</span>
                <span className="text-gray-900 border-b border-gray-900">Webflow</span>
            </nav> */}

            {/* Category Badges */}
            {(courseDetail?.categories?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {courseDetail?.categories?.map((cat: any) => {
                        const info = cat.category_info;
                        if (!info?.name) return null;

                        return (
                            <span
                                key={cat.id}
                                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm"
                                style={{
                                    backgroundColor: info.bg_code || '#EBEBFF',
                                    color: info.text_code || '#5624D0'
                                }}
                            >
                                {info.name}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Course Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {courseDetail?.name}
                {/* Complete Website Responsive Design: from Figma to Webflow to Website Design */}
            </h1>

            {/* Short Description */}
            <p
                className="text-lg text-gray-600 mb-6"
                dangerouslySetInnerHTML={{
                    __html: courseDetail?.short_description ||
                        "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing."
                }}
            ></p>

            {/*tags only */}
            {
                (courseDetail?.tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {courseDetail?.tags?.map((tag: any) => {
                            const info = tag.tags;
                            if (!info?.name) return null;
                            return (
                                <span
                                    key={tag.id}
                                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm"
                                    style={{
                                        backgroundColor: info.bg_code || '#EBEBFF',
                                        color: info.text_code || '#5624D0'
                                    }}
                                >
                                    {info.name}
                                </span>
                            );
                        })}
                    </div>
                )
            }


            {/* Instructor and Rating Section */}
            <div className="flex flex-wrap items-center gap-6">
                {/* Instructor Info */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {
                            courseDetail?.instrcutor_info.map((avtar: any) => (
                                <img
                                    src={avtar.instructor_info?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"}
                                    alt="Instructor 1"
                                    className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-100 object-cover"
                                />

                            ))
                        }
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Created by:</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {courseDetail?.instrcutor_info.map((avtar: any, index: number) => (
                                <span key={index}>
                                    {avtar?.instructor_info?.text_1}
                                    {index !== courseDetail.instrcutor_info.length - 1 && (
                                        <span className="text-gray-300 mx-1">•</span>
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            />
                        ))}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">4.8</span>
                    <span className="text-gray-500 text-xs">(451,444 Rating)</span>
                </div>
            </div>
        </div>
    );
};

export default CourseHeader;
