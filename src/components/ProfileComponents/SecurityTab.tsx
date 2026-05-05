import React from 'react';

const SecurityTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-[#1D2026]">Account Security</h2>
            <p className="text-[#6E7485] mt-1">Manage your password and security settings.</p>
        </div>
        
        <div className="space-y-6 max-w-2xl">
            <div className="p-6 border border-[#E9EAF0] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-[#1D2026]">Password</h3>
                        <p className="text-[13px] text-[#6E7485]">Last changed 3 months ago</p>
                    </div>
                    <button className="text-[#5624D0] font-bold hover:underline">Change</button>
                </div>
            </div>

            <div className="p-6 border border-[#E9EAF0] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-[#1D2026]">Two-factor authentication</h3>
                        <p className="text-[13px] text-[#6E7485]">Keep your account extra secure with a second step.</p>
                    </div>
                    <button className="px-4 py-2 border border-[#E9EAF0] rounded font-bold hover:bg-[#F5F4FF]">Enable</button>
                </div>
            </div>
        </div>
    </div>
);

export default SecurityTab;
