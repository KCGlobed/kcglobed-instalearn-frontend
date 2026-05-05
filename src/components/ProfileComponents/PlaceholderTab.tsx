import React from 'react';
import { Settings } from 'lucide-react';

const PlaceholderTab = ({ title }: { title: string }) => (
    <div className="py-20 text-center animate-in fade-in duration-500">
        <Settings className="w-16 h-16 text-[#E9EAF0] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1D2026]">{title}</h2>
        <p className="text-[#6E7485] mt-2">This section is currently under development.</p>
    </div>
);

export default PlaceholderTab;
