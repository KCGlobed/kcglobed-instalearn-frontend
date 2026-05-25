import React from 'react';
import { Settings } from 'lucide-react';

const PlaceholderTab = ({ title }: { title: string }) => (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <Settings className="w-16 h-16 text-[#E9EAF0] mx-auto mb-4" />
        <p className="text-[#6E7485] mt-2">This section is currently under development.</p>
    </div>
);

export default PlaceholderTab;
