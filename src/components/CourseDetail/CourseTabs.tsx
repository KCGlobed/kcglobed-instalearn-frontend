import React, { useState } from 'react';
import Tabs from '../UI/Tabs';
import type { Tab } from '../UI/Tabs';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';

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
    const { courseDetail } = useAppSelector((state: RootState) => state.courseDetail);
    const [activeTab, setActiveTab] = useState<string>('Overview');

    const tabsWithCounts: Tab[] = TABS.map((t) => {
        if (t.label === 'Reviews')    return { ...t, count: courseDetail?.total_reviews ?? 0 };
        if (t.label === 'Curriculum') return { ...t, count: courseDetail?.sample_videos?.length ?? 0 };
        if (t.label === 'Featured')   return { ...t, count: courseDetail?.feature_json?.length ?? 0 };
        return t;
    });

    return (
        <div className="mb-8">
            <Tabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} />

            <div className="pt-8">
                {activeTab === 'Overview'   && <OverviewPanel   courseDetail={courseDetail} />}
                {activeTab === 'Curriculum' && <CurriculumPanel courseDetail={courseDetail} />}
                {activeTab === 'Featured'   && <FeaturedPanel   courseDetail={courseDetail} />}
                {activeTab === 'Instructor' && <InstructorPanel courseDetail={courseDetail} />}
                {activeTab === 'Reviews'    && <ReviewsPanel    courseDetail={courseDetail} />}
            </div>
        </div>
    );
};

export default CourseTabs;
