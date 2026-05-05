import React from 'react';

const ProfileTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-[#1D2026]">Public profile</h2>
            <p className="text-[#6E7485] mt-1">Add information about yourself</p>
        </div>
        <div className="space-y-4 max-w-2xl">
            <div className="grid gap-2">
                <label className="text-[14px] font-bold text-[#1D2026]">First Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all" placeholder="Enter first name" />
            </div>
            <div className="grid gap-2">
                <label className="text-[14px] font-bold text-[#1D2026]">Last Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all" placeholder="Enter last name" />
            </div>
            <div className="grid gap-2">
                <label className="text-[14px] font-bold text-[#1D2026]">Headline</label>
                <input type="text" className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all" placeholder="Instructor at InstaLearn" />
            </div>
            <div className="grid gap-2">
                <label className="text-[14px] font-bold text-[#1D2026]">Biography</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all" placeholder="Tell us about yourself..."></textarea>
            </div>
            <button className="px-6 py-2.5 bg-[#5624D0] text-white font-bold rounded-md hover:bg-[#461DA5] transition-colors">Save Changes</button>
        </div>
    </div>
);

export default ProfileTab;
