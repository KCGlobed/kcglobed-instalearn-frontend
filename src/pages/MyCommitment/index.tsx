import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { markCourseStartedApi } from '../../utils/service';

const MyCommitment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const course = location.state?.course;

    const courseName = course?.name || "Introduction to Technical Writing";
    const courseId = course?.id || "";

    const [isCommitted, setIsCommitted] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartCourse = async () => {
        if (!isCommitted || isLoading) return;
        
        setIsLoading(true);
        try {
            await markCourseStartedApi({
                course_id: courseId,
            });
            
            // On successful API response, trigger transition and navigate
            setIsExiting(true);
            setTimeout(() => {
                if (courseId) {
                    navigate(`/learning/dashboard/${courseId}`);
                } else {
                    navigate('/my-learning');
                }
            }, 400); // matches transition duration
        } catch (error: any) {
            setIsLoading(false);
            const errorMessage = error?.message || "Failed to start the course. Please try again.";
            toast.error(errorMessage);
        }
    };

    const leftStrategies = ["Take a breath", "Break it down", "Ask for help"];
    const rightStrategies = ["Research", "Stay positive", "Talk through it"];

    return (
        <div className={`min-h-screen bg-[#f8f9fa] font-inter flex flex-col transition-all duration-400 ease-in-out ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center">
                    <img
                        src="/instalogo.png"
                        alt="KC Globed Insta Learn"
                        className="h-8 object-contain"
                    />
                </div>
                {/* No Cross icon/close text as requested */}
                <div />
            </header>

            {/* Main content container */}
            <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
                <div className="max-w-[680px] w-full bg-white border border-gray-200 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-8 md:p-14">
                    
                    <h1 className="text-[28px] md:text-[32px] font-semibold text-gray-900 leading-tight mb-8 tracking-tight font-sans">
                        My commitment
                    </h1>

                    <div className="space-y-6 text-[15px] md:text-[16px] text-gray-700 leading-relaxed">
                        <p className="text-gray-950 font-medium">
                            I'm beginning my learning in <span className="text-gray-900 font-bold underline decoration-gray-300 decoration-2 underline-offset-4">{courseName}</span>
                        </p>

                        <p className="text-gray-600">
                            I know learning can be hard, but I have the patience, determination, and discipline to reach my goals.
                        </p>

                        <p className="text-gray-950 font-medium pt-2">
                            When I'm stuck, I'll find a solution, like...
                        </p>
                    </div>

                    {/* Grid of strategies (Clean Minimalist List) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 mt-6 mb-10 text-[14px] md:text-[15px] text-gray-700 border-l-2 border-indigo-600 pl-6 py-1">
                        <ul className="space-y-3.5">
                            {leftStrategies.map((strategy, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                    <span>{strategy}</span>
                                </li>
                            ))}
                        </ul>
                        <ul className="space-y-3.5">
                            {rightStrategies.map((strategy, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                    <span>{strategy}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Commitment Checkbox */}
                    <div className="mb-10">
                        <label className="flex items-start gap-3.5 cursor-pointer group select-none">
                            <input
                                type="checkbox"
                                checked={isCommitted}
                                disabled={isLoading}
                                onChange={(e) => setIsCommitted(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5 accent-indigo-600 disabled:opacity-50"
                            />
                            <span className="text-indigo-600 font-semibold text-[15px] hover:underline leading-normal">
                                I commit to completing this course
                            </span>
                        </label>
                    </div>

                    {/* Start Button */}
                    <div className="flex justify-start">
                        <button
                            onClick={handleStartCourse}
                            disabled={!isCommitted || isLoading}
                            className={`px-8 py-3.5 rounded font-bold text-[14px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center min-w-[180px] ${
                                isCommitted && !isLoading
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-md' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Starting...</span>
                                </div>
                            ) : (
                                "Start the course"
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyCommitment;