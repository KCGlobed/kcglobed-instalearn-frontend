import React from 'react';

export interface TabConfig {
    key: string;
    label: string;
    component: React.ReactNode;
}

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
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onChange(tab.key)}
                            className={`relative pb-3 text-[15px] font-bold transition-all whitespace-nowrap outline-none ${
                                isActive
                                    ? (isDark ? 'text-white' : 'text-gray-900')
                                    : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                            }`}
                        >
                            {tab.label}
                            {isActive && (
                                <div className={`absolute bottom-0 left-0 right-0 h-[4px] rounded-t-full ${
                                    isDark ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-gray-900'
                                }`} />
                            )}
                        </button>
                    );
                })}
            </div>
            <div className={`mt-10 ${contentClassName}`}>
                {tabs.find((tab) => tab.key === activeTab)?.component}
            </div>
        </div>
    );
};

export default Tabs;
