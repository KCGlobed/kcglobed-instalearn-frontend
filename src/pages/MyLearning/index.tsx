import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopHeader from '../../layouts/TopHeader';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import Tabs, { type TabConfig } from '../../components/UI/Tabs';
import OverviewTab from '../../components/MyLearning/OverviewTab';
import MyCoursesTab from '../../components/MyLearning/MyCoursesTab';
import WishlistTab from '../../components/MyLearning/WishlistTab';

const MyLearning = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTabKey = searchParams.get('tab') || 'overview';

    const tabConfig: TabConfig[] = useMemo(() => [
        { key: 'courses', label: 'My Courses', component: <MyCoursesTab /> },
        { key: 'wishlist', label: 'Wishlist', component: <WishlistTab /> },
        { key: 'overview', label: 'Overview', component: <OverviewTab /> },
        { key: 'learning-paths', label: 'Learning paths', component: <div className="text-center py-24 text-gray-500 bg-gray-50 rounded-3xl border border-gray-100">Learning paths feature is coming soon!</div> },
        { key: 'archived', label: 'Archived', component: <div className="text-center py-24 text-gray-500 bg-gray-50 rounded-3xl border border-gray-100">You have no archived courses.</div> },
    ], []);

    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
    };


    return (
        <div className="min-h-screen bg-white font-inter">
            <TopHeader />
            <MainHeader />

            <div className="max-w-[1340px] mx-auto px-6 mt-12 mb-10">
                <h1 className="text-[40px] font-bold text-gray-900 tracking-tight font-inter">My learning</h1>
            </div>

            <div className="max-w-[1340px] mx-auto px-6">
                <Tabs
                    tabs={tabConfig}
                    activeTab={activeTabKey}
                    onChange={handleTabChange}
                    variant="light"
                />
            </div>

            <main className="max-w-[1340px] mx-auto px-6 pb-20">
                {/* Content is rendered within the Tabs component */}
            </main>

            <Footer />

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default MyLearning;