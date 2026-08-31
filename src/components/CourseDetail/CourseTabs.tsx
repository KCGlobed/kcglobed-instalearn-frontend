import React, { useState } from 'react';
import Tabs from '../UI/Tabs';
import type { Tab } from '../UI/Tabs';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';

import OverviewPanel    from './tabs/OverviewPanel';
import CurriculumPanel  from './tabs/CurriculumPanel';
import FeaturedPanel    from './tabs/FeaturedPanel';
import InstructorPanel  from './tabs/InstructorPanel';
import ReviewsPanel     from './tabs/ReviewsPanel';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS: Tab[] = [
    { label: 'Overview' },
    { label: 'Curriculum' },
    { label: 'Featured' },
    { label: 'Instructor' },
    { label: 'Reviews' },
];

// ─── CourseTabs ───────────────────────────────────────────────────────────────

const CourseTabs: React.FC = () => {
    const { t } = useTranslation();
    const { courseDetail } = useAppSelector((state: RootState) => state.courseDetail);
    
    // We get localized labels dynamically
    const localizedTabs: Tab[] = [
        { label: t('courseDetail.overview', 'Overview') },
        { label: t('courseDetail.curriculum', 'Curriculum') },
        { label: t('courseDetail.featured', 'Featured') },
        { label: t('courseDetail.instructor', 'Instructor') },
        { label: t('courseDetail.reviews', 'Reviews') },
    ];

    const [activeTab, setActiveTab] = useState<string>(localizedTabs[0].label);

    const tabsWithCounts: Tab[] = localizedTabs.map((tItem) => {
        if (tItem.label === t('courseDetail.reviews', 'Reviews'))    return { ...tItem, count: courseDetail?.total_reviews ?? 0 };
        if (tItem.label === t('courseDetail.curriculum', 'Curriculum')) return { ...tItem, count: courseDetail?.sample_videos?.length ?? 0 };
        if (tItem.label === t('courseDetail.featured', 'Featured'))   return { ...tItem, count: courseDetail?.feature_json?.length ?? 0 };
        return tItem;
    });

    return (
        <div className="mb-8">
            <Tabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} />

            <div className="pt-8">
                {activeTab === t('courseDetail.overview', 'Overview')   && <OverviewPanel   courseDetail={courseDetail} />}
                {activeTab === t('courseDetail.curriculum', 'Curriculum') && <CurriculumPanel courseDetail={courseDetail} />}
                {activeTab === t('courseDetail.featured', 'Featured')   && <FeaturedPanel   courseDetail={courseDetail} />}
                {activeTab === t('courseDetail.instructor', 'Instructor') && <InstructorPanel courseDetail={courseDetail} />}
                {activeTab === t('courseDetail.reviews', 'Reviews')    && <ReviewsPanel    courseDetail={courseDetail} />}
            </div>
        </div>
    );
};

export default CourseTabs;
