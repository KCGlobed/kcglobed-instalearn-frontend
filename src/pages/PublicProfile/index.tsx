import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import ProfileTab from '../../components/ProfileComponents/ProfileTab';
import PhotoTab from '../../components/ProfileComponents/PhotoTab';
import SecurityTab from '../../components/ProfileComponents/SecurityTab';
import NotificationTab from '../../components/ProfileComponents/NotificationTab';
import PlaceholderTab from '../../components/ProfileComponents/PlaceholderTab';
import { getUserProfileApi } from '../../utils/service';
import toast from 'react-hot-toast';
import { Loader2, User, Camera, Bell, ShieldCheck, ChevronRight, Settings, ReceiptText } from 'lucide-react';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const TAB_CONFIG = [
    { id: 'profile', label: 'Profile', icon: User, component: ProfileTab, description: 'Manage your personal details and public presence' },
    { id: 'photo', label: 'Photo', icon: Camera, component: PhotoTab, description: 'Update your profile picture for better identification' },
    // { id: 'security', label: 'Security', icon: ShieldCheck, component: SecurityTab, description: 'Manage your account password and security settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationTab, description: 'Configure how you receive platform updates' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const PublicProfile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentTab = searchParams.get('tab') || 'profile';
    const [profileData, setProfileData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getUserProfileApi();
            if (response && response.data) {
                setProfileData(response.data);
                localStorage.setItem("userProfile", JSON.stringify(response.data));
            } else {
                toast.error(response.message || "Failed to fetch profile");
            }
        } catch (error: any) {
            console.error("Error fetching profile:", error);
            toast.error(error.message || "An error occurred while fetching profile");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProfile();
    }, []);

    const initials = useMemo(() => {
        if (!profileData) return 'U';
        return (profileData.first_name?.[0] || '') + (profileData.last_name?.[0] || '');
    }, [profileData]);

    const activeTab = useMemo(() => {
        return TAB_CONFIG.find(t => t.id === currentTab) || TAB_CONFIG[0];
    }, [currentTab]);

    const handleTabChange = (id: string) => {
        setSearchParams({ tab: id });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            <MainHeader />

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div className="mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1D2026]">Account Settings</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">

                    {/* Sidebar / Mobile Nav */}
                    <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-xl border border-[#E9EAF0] shadow-sm overflow-hidden">
                            {/* Profile Info - Desktop Only Header Look */}
                            <div className="p-6 border-b border-[#E9EAF0] flex lg:flex-col items-center gap-4 lg:text-center">
                                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-[#1D2026] text-white rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold shrink-0 shadow-lg ring-4 ring-white">
                                    {profileData?.image ? (
                                        <img src={profileData.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        initials.toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 lg:mt-2">
                                    <h3 className="font-bold text-[#1D2026] truncate lg:text-lg">
                                        {profileData ? `${profileData.first_name} ${profileData.last_name}` : 'User Name'}
                                    </h3>
                                    <p className="text-[12px] text-[#6E7485] truncate">{profileData?.email}</p>
                                </div>
                            </div>

                            {/* Nav Items - Horizontal Scroll on Mobile, Vertical on Desktop */}
                            <nav className="flex lg:flex-col p-2 lg:p-3 overflow-x-auto no-scrollbar lg:overflow-visible gap-1 md:gap-2">
                                {TAB_CONFIG.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = currentTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] md:text-[14px] font-medium transition-all shrink-0 lg:shrink ${isActive
                                                ? 'bg-[#5624D0] text-white shadow-md'
                                                : 'text-[#4E5566] hover:bg-[#F8F9FB] hover:text-[#5624D0]'
                                                }`}
                                        >
                                            <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#8C94A3]'}`} />
                                            <span className="whitespace-nowrap">{tab.label}</span>
                                            {isActive && <ChevronRight className="hidden lg:block ml-auto w-4 h-4 opacity-50" />}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => navigate('/purchase-history')}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] md:text-[14px] font-medium transition-all shrink-0 lg:shrink text-[#4E5566] hover:bg-[#F8F9FB] hover:text-[#5624D0]"
                                >
                                    <ReceiptText className="w-4.5 h-4.5 text-[#8C94A3]" />
                                    <span className="whitespace-nowrap">Purchase History</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <section className="flex-1 w-full bg-white rounded-xl border border-[#E9EAF0] shadow-sm overflow-hidden min-h-[500px] md:min-h-[600px]">
                        <div className="px-6 py-6 md:px-8 md:py-6 border-b border-[#E9EAF0]">
                            <h2 className="text-xl font-bold text-[#1D2026]">{activeTab.label}</h2>
                            <p className="text-[#6E7485] text-sm mt-1">{activeTab.description}</p>
                        </div>
                        <div className="p-6 md:p-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] space-y-4">
                                    <Loader2 className="w-10 h-10 text-[#5624D0] animate-spin" />
                                    <p className="text-[#6E7485] text-sm animate-pulse">Loading settings...</p>
                                </div>
                            ) : (
                                <activeTab.component profileData={profileData} refreshProfile={fetchProfile} />
                            )}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicProfile;