import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import SectionTitle from './SectionTitle';

const ReviewsPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const avg = courseDetail?.avg_rating ?? 0;
    const total = courseDetail?.total_reviews ?? 0;
    const filled = Math.round(avg);

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
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-5 h-5 ${s <= filled ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                            />
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
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 w-3">{star}</span>
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full"
                                            style={{ width: star <= filled ? '70%' : '10%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPanel;
