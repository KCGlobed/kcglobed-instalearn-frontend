import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import SectionTitle from './SectionTitle';

const FeaturedPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const features: string[] = courseDetail?.feature_json ?? [];

    return (
        <div id="tabpanel-Featured" role="tabpanel" aria-labelledby="tab-Featured" className="mb-12">
            <SectionTitle
                icon={<Sparkles className="w-5 h-5 text-indigo-600" />}
                title="Course Features"
                subtitle="Everything included in this course"
            />

            {features.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
                        >
                            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </span>
                            <span className="text-sm text-gray-700 leading-snug">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">No features listed yet.</p>
                </div>
            )}
        </div>
    );
};

export default FeaturedPanel;
