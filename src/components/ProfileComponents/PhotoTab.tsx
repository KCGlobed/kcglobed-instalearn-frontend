import React from 'react';
import { Camera } from 'lucide-react';

const PhotoTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-[#1D2026]">Photo</h2>
            <p className="text-[#6E7485] mt-1">Add a nice photo of yourself for your profile.</p>
        </div>
        <div className="p-8 border-2 border-dashed border-[#E9EAF0] rounded-xl flex flex-col items-center justify-center space-y-4 bg-[#F8F9FB]">
            <div className="w-32 h-32 bg-[#E9EAF0] rounded-full flex items-center justify-center text-[#8C94A3]">
                <Camera className="w-10 h-10" />
            </div>
            <div className="text-center">
                <button className="px-6 py-2.5 bg-white border border-[#E9EAF0] text-[#1D2026] font-bold rounded-md hover:bg-[#F5F4FF] transition-colors">Upload Photo</button>
                <p className="text-[12px] text-[#8C94A3] mt-2">Maximum file size: 1MB. Allowed: JPG, PNG.</p>
            </div>
        </div>
    </div>
);

export default PhotoTab;
