import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tab {
    /** Unique identifier and display label */
    label: string;
    /** Optional count badge (e.g. number of reviews) */
    count?: number;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (label: string) => void;
    /** Extra className for the outer wrapper */
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Reusable horizontal tab bar.
 *
 * Usage:
 * ```tsx
 * const [active, setActive] = useState('Overview');
 * const tabs = [{ label: 'Overview' }, { label: 'Reviews', count: 12 }];
 *
 * <Tabs tabs={tabs} activeTab={active} onChange={setActive} />
 * ```
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
    return (
        <div
            role="tablist"
            aria-label="Content tabs"
            className={`flex border-b border-gray-200 sticky top-0 bg-white z-10 w-full overflow-x-auto scroll-smooth ${className}`}
            style={{ scrollbarWidth: 'none' }}
        >
            {tabs.map(({ label, count }) => {
                const isActive = activeTab === label;
                return (
                    <button
                        key={label}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${label}`}
                        id={`tab-${label}`}
                        onClick={() => onChange(label)}
                        className={`relative px-5 py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                            isActive
                                ? 'text-indigo-600'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        {label}
                        {count !== undefined && (
                            <span
                                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                    isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                                }`}
                            >
                                {count}
                            </span>
                        )}
                        {/* Active indicator bar */}
                        <span
                            className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-sm transition-all duration-300 ${
                                isActive ? 'bg-indigo-600 opacity-100' : 'opacity-0'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
