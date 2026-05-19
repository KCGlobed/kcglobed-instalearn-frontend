import React, { useState } from 'react';
import { ChevronLeft, Share2, Star, Trophy, ChevronDown, MoreVertical, Award, Search, HelpCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../Modals/ModalContext';
import StarRatingReview from '../Modals/StarReview';
import ShareCourse from '../Modals/ShareCourse';

interface HeaderProps {
    courseTitle?: string;
    progress?: number;
    courseName?: string;
}

const Header: React.FC<HeaderProps> = ({
    courseTitle = "Advanced React Patterns & Architecture",
    progress = 68,
    courseName
}) => {
    const [showProgress, setShowProgress] = useState(false);
    const navigate = useNavigate();
    const { showModal, hideModal } = useModal();
    const handleStarRatingModal = () => {
        showModal({
            content: <StarRatingReview />,
            size: "lg",
        })
    }
    const handleShareModal = () => {
        showModal({
            content: <ShareCourse courseId={2} />,
            size: "md",
        })
    }

    const circumference = 81.68;
    const offset = circumference - (circumference * progress) / 100;

    return (
        <header className="h-14 w-full bg-white border-b border-[#d1d7dc] flex items-center justify-between px-4 gap-4 sticky top-0 z-[100] shrink-0 font-sans shadow-sm">

            {/* Left Section: Back Button + Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 p-1.5 hover:bg-[#f7f9fa] rounded transition-colors text-[#2d2f31]"
                    title="Back"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="w-px h-6 bg-[#d1d7dc]" />

                <h1 className="text-sm font-bold text-[#2d2f31] truncate leading-tight cursor-default">
                    {courseName && `${courseName} `}
                </h1>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 shrink-0">

                {/* Rating Link */}
                <button onClick={handleStarRatingModal} className="hidden lg:flex items-center gap-1.5 text-[#2d2f31] hover:text-[#a435f0] transition-colors text-xs font-bold mr-2">
                    <Star size={14} fill="#2d2f31" className="text-[#2d2f31]" />
                    <span>Leave a rating</span>
                </button>

                {/* Progress Circle */}
                <div className="relative group">
                    <button
                        onClick={() => setShowProgress(p => !p)}
                        className="flex items-center gap-2.5 px-2 py-1 rounded hover:bg-[#f7f9fa] transition-all"
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                            <svg className="w-8 h-8 -rotate-90">
                                <circle
                                    cx="16" cy="16" r="13"
                                    className="stroke-[#d1d7dc] fill-none"
                                    strokeWidth="2.5"
                                />
                                <circle
                                    cx="16" cy="16" r="13"
                                    className="stroke-[#a435f0] fill-none"
                                    strokeWidth="2.5"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start leading-none gap-0.5">
                            <div className="flex items-center gap-1">
                                <span className="text-[13px] text-[#2d2f31] font-bold">Your progress</span>
                                <ChevronDown size={14} className={`text-[#2d2f31] transition-transform ${showProgress ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </button>

                    {showProgress && (
                        <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white border border-[#d1d7dc] rounded p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-[#2d2f31]">Course Progress</span>
                                <Award size={18} className="text-[#a435f0]" />
                            </div>
                            <div className="h-2 bg-[#f7f9fa] rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-[#a435f0]" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-[12px] text-[#6a6f73] leading-relaxed">
                                {progress}% complete. Keep going to get your certificate!
                            </p>
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <button onClick={handleShareModal} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border border-[#2d2f31] text-[#2d2f31] hover:bg-[#f7f9fa] transition-all text-sm font-bold">
                    <Share2 size={16} />
                    <span>Share</span>
                </button>

                {/* Overflow Button */}
                {/* <button className="p-2 rounded border border-[#2d2f31] text-[#2d2f31] hover:bg-[#f7f9fa] transition-colors">
                    <MoreVertical size={18} />
                </button> */}
            </div>
        </header>
    );
};

export default Header;

