import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopHeader from '../../layouts/TopHeader';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';
import Tabs, { type TabConfig } from '../../components/UI/Tabs';
import OverviewTab from '../../components/MyLearning/OverviewTab';
import MyCoursesTab from '../../components/MyLearning/MyCoursesTab';
import WishlistTab from '../../components/MyLearning/WishlistTab';
import MyAllReminderTab from '../../components/MyLearning/MyAllReminderTab';
import { useTranslation } from 'react-i18next';

const MyLearning = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTabKey = searchParams.get('tab') || 'courses';

    const tabConfig: TabConfig[] = useMemo(() => [
        { key: 'courses', label: t('myLearning.myCourses', 'My Courses'), component: <MyCoursesTab /> },
        { key: 'wishlist', label: t('myLearning.wishlist', 'Wishlist'), component: <WishlistTab /> },
        { key: 'reminder', label: t('myLearning.reminder', 'Reminder'), component: <MyAllReminderTab /> }
    ], [t]);

    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
    };


    return (
        <div className="min-h-screen bg-white font-inter">
            <TopHeader />
            <MainHeader />

            <div className="max-w-[1340px] mx-auto px-6 mt-12 mb-10">
                <h1 className="text-[40px] font-bold text-gray-900 tracking-tight font-inter">{t('myLearning.myLearning', 'My learning')}</h1>
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