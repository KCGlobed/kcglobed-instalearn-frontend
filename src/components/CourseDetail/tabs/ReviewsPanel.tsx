import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import SectionTitle from './SectionTitle';
import StudentFeedback from './StudentFeedback';

const StarIcon: React.FC<{ fill: 'full' | 'half' | 'empty' }> = ({ fill }) => {
    if (fill === 'full') {
        return <Star className="w-5 h-5 fill-amber-400 text-amber-400" />;
    }
    if (fill === 'empty') {
        return <Star className="w-5 h-5 fill-gray-200 text-gray-200" />;
    }
    // Half star: clip a filled star to 50% width
    return (
        <span className="relative inline-block w-5 h-5">
            <Star className="absolute inset-0 w-5 h-5 fill-gray-200 text-gray-200" />
            <span className="absolute inset-0 w-1/2 overflow-hidden">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
        </span>
    );
};

const getStarFills = (avg: number): Array<'full' | 'half' | 'empty'> => {
    return [1, 2, 3, 4, 5].map((s) => {
        if (avg >= s) return 'full';
        if (avg >= s - 0.5) return 'half';
        return 'empty';
    });
};

const ReviewsPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const avg = courseDetail?.avg_rating ?? 0;
    const total = courseDetail?.course_review_counts?.total_reviews ?? 0;
    const five_star = courseDetail?.course_review_counts?.five_star_count ?? 0;
    const four_star = courseDetail?.course_review_counts?.four_star_count ?? 0;
    const three_star = courseDetail?.course_review_counts?.three_star_count ?? 0;
    const two_star = courseDetail?.course_review_counts?.two_star_count ?? 0;
    const one_star = courseDetail?.course_review_counts?.one_star_count ?? 0;

    const starCounts: Record<number, number> = {
        5: five_star,
        4: four_star,
        3: three_star,
        2: two_star,
        1: one_star,
    };

    const starFills = getStarFills(avg);

    return (
        <div id="tabpanel-Reviews" role="tabpanel" aria-labelledby="tab-Reviews" className="mb-12">
            <SectionTitle
                icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
                title="Student Reviews"
                subtitle={`${total.toLocaleString()} ${total === 1 ? 'review' : 'reviews'} from verified students`}
            />

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                {/* Big rating number */}
                <div className="text-center shrink-0">
                    <p className="text-6xl font-black text-indigo-600 leading-none">{avg.toFixed(1)}</p>
                    <div className="flex justify-center gap-0.5 mt-2">
                        {starFills.map((fill, i) => (
                            <StarIcon key={i} fill={fill} />
                        ))}
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wide">Course Rating</p>
                </div>

                <div className="hidden sm:block w-px h-20 bg-indigo-200" />

                {/* Stats */}
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Based on{' '}
                        <span className="font-bold text-gray-900 text-base">{total.toLocaleString()}</span>{' '}
                        {total === 1 ? 'review' : 'reviews'}
                    </p>
                    {total === 0 ? (
                        <p className="mt-2 text-sm text-gray-400 italic">
                            No reviews yet — be the first to share your experience!
                        </p>
                    ) : (
                        <div className="mt-3 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const pct = total > 0 ? (starCounts[star] / total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-3">{star}</span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 w-6 text-right">
                                            {starCounts[star]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className='mt-4'>
                <StudentFeedback courseId={courseDetail.id} />
            </div>
        </div>
    );
};

export default ReviewsPanel;