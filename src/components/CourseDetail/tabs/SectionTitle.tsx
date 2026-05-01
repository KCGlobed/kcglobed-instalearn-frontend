import React from 'react';

interface SectionTitleProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
            {icon}
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

export default SectionTitle;
