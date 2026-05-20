import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useModal } from './ModalContext';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchReview, createReview, updateReview, clearReviewStatus } from '../../store/slices/reviewSlice';

const RATING_LABELS: Record<number, string> = {
    1: "Awful, not what I expected",
    2: "Poor, pretty disappointing",
    3: "Poor / Average",
    4: "Good, what I expected",
    5: "Amazing, above expectations",
};

const StarRatingReview = ({ courseId }: { courseId: number }) => {
    const dispatch = useAppDispatch();
    const { review: existingReview, loading } = useAppSelector((state) => state.review);

    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const { hideModal } = useModal();
    const displayRating = hover || rating;

    // Determine if a valid review exists (has id or rating)
    const hasReview = existingReview && (
        Array.isArray(existingReview)
            ? existingReview.length > 0 && !!(existingReview[0].id || existingReview[0].rating)
            : !!(existingReview.id || existingReview.rating)
    );

    useEffect(() => {
        dispatch(fetchReview(courseId));
        return () => {
            dispatch(clearReviewStatus());
        };
    }, [dispatch, courseId]);

    useEffect(() => {
        if (existingReview) {
            const reviewObj = Array.isArray(existingReview) ? existingReview[0] : existingReview;
            if (reviewObj && (reviewObj.id || reviewObj.rating)) {
                setRating(Number(reviewObj.rating) || 0);
                setComment(reviewObj.review || "");
            }
        }
    }, [existingReview]);

    const addReviewRating = async () => {
        if (!comment.trim()) return;
        try {
            if (hasReview) {
                await dispatch(updateReview({
                    id: existingReview?.id,
                    data: {
                        rating,
                        review: comment
                    }
                })).unwrap();
                toast.success("Review updated successfully");
            } else {
                await dispatch(createReview({
                    course_id: courseId,
                    rating,
                    review: comment
                })).unwrap();
                toast.success("Review added successfully");
            }
            hideModal();
        } catch (error: any) {
            console.error(error);
            toast.error(error || "Failed to save review");
        }
    }; if (loading && !hasReview) {
        return (
            <div className="flex flex-col items-center justify-center py-12 w-full max-w-xl mx-auto min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#a435f0] mb-2" />
                <p className="text-sm text-[#6a6f73]">Loading review...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-6 px-4 w-full max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#2d2f31] mb-8 text-center">
                {rating === 0 ? "How would you rate this course?" : "Why did you leave this rating?"}
            </h2>

            {/* Feedback Label */}
            <div className="h-6 mb-4 transition-all duration-200">
                {displayRating > 0 && (
                    <span className="text-sm font-bold text-[#2d2f31] animate-in fade-in slide-in-from-bottom-2">
                        {RATING_LABELS[displayRating]}
                    </span>
                )}
            </div>

            {/* Star Container */}
            <div className="flex items-center gap-2 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="relative p-1 group transition-transform active:scale-90"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            size={44}
                            className={`transition-all duration-200 ${star <= displayRating
                                ? "fill-[#e59819] text-[#e59819]"
                                : "text-[#e59819] fill-none"
                                }`}
                            strokeWidth={2}
                        />
                        {/* Subtle glow effect on hover */}
                        {star <= hover && (
                            <div className="absolute inset-0 bg-[#e59819]/10 blur-xl rounded-full -z-10" />
                        )}
                    </button>
                ))}
            </div>

            {/* Comment Section (Appears after rating) */}
            {rating > 0 && (
                <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="relative group">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
                            className="w-full min-h-[160px] p-4 bg-white border-2 border-[#a435f0] rounded-sm text-[#2d2f31] text-sm leading-relaxed
                                     focus:outline-none focus:ring-[#a435f0] placeholder:text-[#6a6f73] transition-all"
                        />
                        {/* Shadow detail to match premium look */}
                        <div className="absolute inset-0 border border-transparent pointer-events-none rounded-sm" />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={addReviewRating}
                            className="px-6 py-3 bg-[#a435f0] text-white font-bold text-sm rounded-sm hover:bg-[#8710d8] 
                                     active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                            disabled={!comment.trim()}
                        >
                            Save and Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StarRatingReview;