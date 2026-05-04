import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyCoursesTab = () => {
    return (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No enrolled courses</h3>
            <p className="text-gray-500 mb-6">Start learning by enrolling in our top-rated courses.</p>
            <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
                Start Learning
            </Link>
        </div>
    );
};

export default MyCoursesTab;
