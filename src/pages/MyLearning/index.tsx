import React, { useState } from 'react';
import { Flame, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopHeader from '../../layouts/TopHeader';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';

const MyLearning = () => {
    const [activeTab, setActiveTab] = useState('All courses');
    const tabs = ['All courses', 'My Lists', 'Wishlist', 'Learning paths', 'Archived', 'Learning tools'];

    return (
        <div className="min-h-screen bg-white font-inter">
            <TopHeader />
            <MainHeader />

            {/* My Learning Header */}
            <header className="bg-[#1c1d1f] pt-12 pb-2">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">My learning</h1>

                    {/* Navigation Tabs */}
                    <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === tab
                                        ? 'text-white border-white'
                                        : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
                {/* Streak Section */}
                <section className="border border-[#d1d7dc] rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-xl font-bold text-gray-900">Start a weekly streak</h2>
                        <p className="text-[#2d2f31] text-sm">One ring down! Now, watch your course(s).</p>
                    </div>

                    <div className="flex items-center gap-12">
                        {/* Streak Counter */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-full">
                                <Flame className="w-8 h-8 text-gray-300" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-2xl text-gray-400">0 <span className="text-sm font-medium text-gray-500">weeks</span></p>
                                <p className="text-gray-500 font-medium">Current streak</p>
                            </div>
                        </div>

                        {/* Progress Ring and Details */}
                        <div className="flex items-center gap-6 border-l border-gray-100 pl-8">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Simple Ring Placeholder */}
                                <div className="absolute inset-0 rounded-full border-[6px] border-gray-100"></div>
                                <div className="absolute inset-0 rounded-full border-[6px] border-green-600 border-t-transparent -rotate-45"></div>
                                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                            </div>

                            <div className="text-[13px] space-y-1">
                                <div className="flex items-center gap-2 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                    <span className="text-gray-600">0/30 course min</span>
                                </div>
                                <div className="flex items-center gap-2 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                    <span className="text-gray-600">2/1 visit</span>
                                </div>
                                <p className="text-gray-400 font-medium mt-1">Apr 26 - May 2</p>
                            </div>

                            <button className="text-gray-400 hover:text-gray-600 ml-4">
                                <Info className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Empty State / Content Section */}
                <section className="py-20 text-center space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Start learning today.</h3>
                    <p className="text-gray-600">
                        When you purchase a course, it will appear here. {' '}
                        <Link to="/" className="text-indigo-600 font-bold hover:underline">Browse now.</Link>
                    </p>
                </section>
            </main>

            <Footer />

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default MyLearning;