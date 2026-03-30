import React, { useState } from 'react';

const CourseTabs = () => {
    const tabs = ['Overview', 'Curriculum', 'Instructor', 'Review'];
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="flex border-b border-gray-200 mb-8 sticky top-0 bg-white z-10 w-full overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap
                        ${activeTab === tab 
                            ? 'text-indigo-600' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                >
                    {tab}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-[tab-slide_0.3s_ease-out]" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default CourseTabs;
