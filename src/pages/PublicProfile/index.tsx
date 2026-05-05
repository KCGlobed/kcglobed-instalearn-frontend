import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import ProfileTab from '../../components/ProfileComponents/ProfileTab';
import PhotoTab from '../../components/ProfileComponents/PhotoTab';
import SecurityTab from '../../components/ProfileComponents/SecurityTab';
import NotificationTab from '../../components/ProfileComponents/NotificationTab';
import PlaceholderTab from '../../components/ProfileComponents/PlaceholderTab';
import {
    User,
    Camera,
    ShieldCheck,
    CreditCard,
    Bell,
    Lock,
    Users,
    Trash2,
    Settings,
    Layout,
    Globe
} from 'lucide-react';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const TAB_CONFIG = [
    { id: 'profile', label: 'Profile', icon: User, component: ProfileTab },
    { id: 'photo', label: 'Photo', icon: Camera, component: PhotoTab },
    { id: 'security', label: 'Account Security', icon: ShieldCheck, component: SecurityTab },
    { id: 'subscriptions', label: 'Subscriptions', icon: Layout, component: () => <PlaceholderTab title="Subscriptions" /> },
    { id: 'payment', label: 'Payment methods', icon: CreditCard, component: () => <PlaceholderTab title="Payment Methods" /> },
    { id: 'privacy', label: 'Privacy', icon: Lock, component: () => <PlaceholderTab title="Privacy" /> },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, component: NotificationTab },
    { id: 'api', label: 'API clients', icon: Globe, component: () => <PlaceholderTab title="API Clients" /> },
    { id: 'close', label: 'Close account', icon: Trash2, component: () => <PlaceholderTab title="Close Account" /> },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const PublicProfile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentTab = searchParams.get('tab') || 'profile';

    const userProfile = useMemo(() => {
        const profile = localStorage.getItem("userProfile");
        return profile ? JSON.parse(profile) : null;
    }, []);

    const initials = useMemo(() => {
        if (!userProfile) return 'U';
        return (userProfile.first_name?.[0] || '') + (userProfile.last_name?.[0] || '');
    }, [userProfile]);

    const activeTab = useMemo(() => {
        return TAB_CONFIG.find(t => t.id === currentTab) || TAB_CONFIG[0];
    }, [currentTab]);

    const handleTabChange = (id: string) => {
        setSearchParams({ tab: id });
    };

    return (
        <div className="min-h-screen bg-white">
            <MainHeader />
            <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar */}
                    <aside className="lg:w-[280px] shrink-0">
                        <div className="flex flex-col items-center mb-8 p-6 bg-[#F8F9FB] rounded-2xl border border-[#E9EAF0]">
                            <div className="w-24 h-24 bg-[#1D2026] text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white">
                                {initials.toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-[#1D2026] text-center">
                                {userProfile?.first_name} {userProfile?.last_name}
                            </h2>
                            <p className="text-[13px] text-[#6E7485] mt-1">Personal Account</p>

                            <button className="mt-6 w-full py-2 border border-[#1D2026] text-[#1D2026] font-bold text-[13px] rounded hover:bg-[#1D2026] hover:text-white transition-all">
                                View public profile
                            </button>
                        </div>

                        <nav className="space-y-1">
                            {TAB_CONFIG.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = currentTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-lg transition-all ${isActive
                                                ? 'bg-[#5624D0] text-white shadow-md'
                                                : 'text-[#4E5566] hover:bg-[#F5F4FF] hover:text-[#5624D0]'
                                            }`}
                                    >
                                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#8C94A3]'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <section className="flex-1 min-w-0 bg-white">
                        <div className="p-1 md:p-4">
                            <activeTab.component />
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicProfile;