import React from 'react';
import { Play } from 'lucide-react';

const CoursePreview = () => {
    return (
        <div className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Main Preview Image */}
            <img 
                src="https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2000&auto=format&fit=crop" 
                alt="Course Preview" 
                className="w-full h-auto object-cover border-4 border-white"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-rose-500 fill-rose-500 ml-1" />
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;
