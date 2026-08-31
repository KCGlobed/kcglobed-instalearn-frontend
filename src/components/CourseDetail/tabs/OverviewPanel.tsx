import React from 'react';
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { useTranslation } from 'react-i18next';

const OverviewPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const { t } = useTranslation();
    return (
        <div id="tabpanel-Overview" role="tabpanel" aria-labelledby="tab-Overview" className="space-y-10 mb-12">

        {/* What you'll learn */}
        {courseDetail?.objectives_summary?.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
                <SectionTitle
                    icon={<CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    title={t('courseDetail.whatYouWillLearn', "What you'll learn")}
                    subtitle={t('courseDetail.skillsAndKnowledge', "Skills and knowledge you'll gain from this course")}
                />
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courseDetail.objectives_summary.map((obj: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-white/80 rounded-xl px-4 py-3 border border-indigo-100/60">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-700 leading-snug">{obj}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Description */}
        <div>
            <SectionTitle
                icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
                title={t('courseDetail.courseDescription', 'Course Description')}
            />
            <div
                className="text-gray-600 text-[15px] leading-relaxed space-y-4 [&_p]:mb-3"
                dangerouslySetInnerHTML={{
                    __html: courseDetail?.description || t('courseDetail.noDescriptionAvailable', 'No description available.'),
                }}
            />
        </div>

        {/* Requirements */}
        {courseDetail?.requirements && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <SectionTitle
                    icon={<ChevronRight className="w-5 h-5 text-amber-600" />}
                    title={t('courseDetail.requirements', 'Requirements')}
                    subtitle={t('courseDetail.whatYouNeedBeforeStarting', 'What you need before starting')}
                />
                <div
                    className="text-gray-700 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: courseDetail.requirements }}
                />
            </div>
        )}
    </div>
    );
};

export default OverviewPanel;
