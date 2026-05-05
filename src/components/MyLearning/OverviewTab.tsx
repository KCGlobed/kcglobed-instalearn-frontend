import React from 'react';
import { BookOpen, Clock, Award } from 'lucide-react';

const OverviewTab = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Courses in Progress</p>
                        <h4 className="text-xl font-bold text-gray-900">0</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Hours Spent Learning</p>
                        <h4 className="text-xl font-bold text-gray-900">0</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Certificates Earned</p>
                        <h4 className="text-xl font-bold text-gray-900">0</h4>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start your learning journey</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You haven't enrolled in any courses yet. Explore our library to find the perfect course for you.
                </p>
                <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    Explore Library
                </button>
            </div>
        </div>
    );
};

export default OverviewTab;
