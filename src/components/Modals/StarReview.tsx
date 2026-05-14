import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RATING_LABELS: Record<number, string> = {
    1: "Awful, not what I expected",
    2: "Poor, pretty disappointing",
    3: "Poor / Average",
    4: "Good, what I expected",
    5: "Amazing, above expectations",
};

const StarRatingReview = () => {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    const displayRating = hover || rating;

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
                            className={`transition-all duration-200 ${
                                star <= displayRating
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