import { Star } from 'lucide-react';

const CourseHeader = () => {
    return (
        <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 font-medium">
                <span className="hover:text-amber-600 cursor-pointer">Home</span>
                <span>&gt;</span>
                <span className="hover:text-amber-600 cursor-pointer">Development</span>
                <span>&gt;</span>
                <span className="hover:text-amber-600 cursor-pointer">Web Development</span>
                <span>&gt;</span>
                <span className="text-gray-900 border-b border-gray-900">Webflow</span>
            </nav>

            {/* Course Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Complete Website Responsive Design: from Figma to Webflow to Website Design
            </h1>

            {/* Short Description */}
            <p className="text-lg text-gray-600 mb-6">
                3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.
            </p>

            {/* Instructor and Rating Section */}
            <div className="flex flex-wrap items-center gap-6">
                {/* Instructor Info */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
                            alt="Instructor 1" 
                            className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-100 object-cover"
                        />
                        <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
                            alt="Instructor 2" 
                            className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-100 object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Created by:</p>
                        <p className="text-sm font-semibold text-gray-900">
                            Dianne Russell <span className="text-gray-300 mx-1">•</span> Kristin Watson
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
