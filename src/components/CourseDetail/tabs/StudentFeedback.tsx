import React from 'react';
import { Star } from 'lucide-react';
import { getUserCourseReviewComments } from '../../../utils/service';

// ── helpers ───────────────────────────────────────────────────────────────────

const getStarFills = (rating: number): Array<'full' | 'half' | 'empty'> =>
    [1, 2, 3, 4, 5].map((s) => {
        if (rating >= s) return 'full';
        if (rating >= s - 0.5) return 'half';
        return 'empty';
    });

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (first: string, last: string): string =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

// ── sub-components ────────────────────────────────────────────────────────────

const StarDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'md' }) => {
    const fills = getStarFills(rating);
    const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

    return (
        <div className="flex items-center gap-0.5">
            {fills.map((fill, i) => {
                if (fill === 'full')
                    return <Star key={i} className={`${cls} fill-amber-400 text-amber-400`} />;
                if (fill === 'empty')
                    return <Star key={i} className={`${cls} fill-gray-200 text-gray-200`} />;
                return (
                    <span key={i} className={`relative inline-block ${cls}`}>
                        <Star className={`absolute inset-0 ${cls} fill-gray-200 text-gray-200`} />
                        <span className="absolute inset-0 w-1/2 overflow-hidden">
                            <Star className={`${cls} fill-amber-400 text-amber-400`} />
                        </span>
                    </span>
                );
            })}
        </div>
    );
};

const Avatar: React.FC<{ image?: string; firstName: string; lastName: string }> = ({
    image,
    firstName,
    lastName,
}) => {
    const [imgError, setImgError] = React.useState(false);
    const initials = getInitials(firstName, lastName);

    if (image && !imgError) {
        return (
            <img
                src={image}
                alt={`${firstName} ${lastName}`}
                onError={() => setImgError(true)}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white"
            />
        );
    }

    return (
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-white">
            {initials}
        </div>
    );
};

// ── skeleton loader ───────────────────────────────────────────────────────────

const ReviewSkeleton: React.FC = () => (
    <div className="flex gap-4 py-5 border-b border-gray-100 animate-pulse">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />

        <div className="flex-1 space-y-2">
            {/* Name + date row */}
            <div className="flex justify-between">
                <div className="h-3.5 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            {/* Stars */}
            <div className="h-3 w-24 bg-gray-200 rounded" />
            {/* Review lines */}
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-4/5 bg-gray-200 rounded" />
        </div>
    </div>
);

// ── types ─────────────────────────────────────────────────────────────────────

interface Review {
    id: number;
    rating: number;
    review: string;
    status: boolean;
    approved: number;
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        image: string;
        email: string;
    };
}

interface StudentFeedbackProps {
    courseId: number;
}

// ── review card ───────────────────────────────────────────────────────────────

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const { user, rating, created_at, approved } = review;
    const fullName = `${user.first_name} ${user.last_name}`;

    return (
        <div className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0">
            <Avatar image={user.image} firstName={user.first_name} lastName={user.last_name} />

            <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                        {approved === 1 && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Verified
                            </span>
                        )}
                    </div>
                    <time className="text-xs text-gray-400">{formatDate(created_at)}</time>
                </div>

                {/* Stars + numeric rating */}
                <div className="flex items-center gap-2 mt-1">
                    <StarDisplay rating={rating} size="sm" />
                    <span className="text-xs font-medium text-amber-600">{rating.toFixed(1)}</span>
                </div>

                {/* Review text */}
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.review}</p>
            </div>
        </div>
    );
};

// ── main component ────────────────────────────────────────────────────────────

const REVIEWS_PER_PAGE = 5;

const StudentFeedback: React.FC<StudentFeedbackProps> = ({ courseId }) => {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [showMore, setShowMore] = React.useState(false);

    React.useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getUserCourseReviewComments(courseId);
                setReviews(res.data);
            } catch (err) {
                setError('Failed to fetch reviews');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [courseId]);

    // ── loading state ──
    if (loading) {
        return (
            <div className="divide-y divide-gray-100">
                {Array.from({ length: 3 }).map((_, i) => (
                    <ReviewSkeleton key={i} />
                ))}
            </div>
        );
    }

    // ── error state ──
    if (error) {
        return (
            <div className="text-center py-10 text-red-400 text-sm">
                {error}
            </div>
        );
    }

    const approvedReviews = reviews.filter((r) => r.approved === 1 && r.status);

    // ── empty state ──
    if (approvedReviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm italic">
                No student feedback yet.
            </div>
        );
    }

    const visibleReviews = showMore ? approvedReviews : approvedReviews.slice(0, REVIEWS_PER_PAGE);
    const hasMore = approvedReviews.length > REVIEWS_PER_PAGE;

    return (
        <div>
            <div className="divide-y divide-gray-100">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {/* Show more / Show less */}
            {hasMore && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setShowMore((prev) => !prev)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {showMore
                            ? 'Show less'
                            : `Show ${approvedReviews.length - REVIEWS_PER_PAGE} more review${approvedReviews.length - REVIEWS_PER_PAGE !== 1 ? 's' : ''}`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentFeedback;