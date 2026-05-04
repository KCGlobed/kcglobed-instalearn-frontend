import React from 'react';

export interface TabConfig {
    key?: string;
    label: string;
    component?: React.ReactNode;
    count?: number; // Added for compatibility with CourseTabs
}

// Backward compatibility alias
export type Tab = TabConfig;

interface TabsProps {
    tabs: TabConfig[];
    activeTab: string;
    onChange: (key: string) => void;
    className?: string;
    containerClassName?: string;
    contentClassName?: string;
    variant?: 'dark' | 'light';
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className = "",
    containerClassName = "",
    contentClassName = "",
    variant = 'light'
}) => {
    const isDark = variant === 'dark';

    return (
        <div className={`w-full font-inter ${className}`}>
            <div className={`flex gap-6 md:gap-10 overflow-x-auto no-scrollbar border-b ${isDark ? 'border-white/10' : 'border-gray-200'} ${containerClassName}`}>
                {tabs.map((tab) => {
                    const key = tab.key || tab.label;
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onChange(key)}
                            className={`relative pb-3 text-[15px] font-bold transition-all whitespace-nowrap outline-none ${
                                isActive
                                    ? (isDark ? 'text-white' : 'text-gray-900')
                                    : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                                        isActive 
                                            ? (isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white') 
                                            : (isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500')
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                            {isActive && (
                                <div className={`absolute bottom-0 left-0 right-0 h-[4px] rounded-t-full ${
                                    isDark ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-gray-900'
                                }`} />
                            )}
                        </button>
                    );
                })}
            </div>
            {/* Render component only if it exists in the active tab */}
            {tabs.find((tab) => (tab.key || tab.label) === activeTab)?.component && (
                <div className={`mt-10 ${contentClassName}`}>
                    {tabs.find((tab) => (tab.key || tab.label) === activeTab)?.component}
                </div>
            )}
        </div>
    );
};

export default Tabs;
