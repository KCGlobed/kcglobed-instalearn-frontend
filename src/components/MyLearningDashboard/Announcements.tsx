import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import {
    MessageSquare,
    Heart,
    Search,
    ChevronDown,
    ChevronUp,
    Loader2,
    VolumeX
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import {
    fetchAnnouncements,
    addLocalComment,
    toggleLocalLike,
    addCommentOnAnnouncements
} from '../../store/slices/announcementSlice';

// --- Helper for Dynamic Relative Time ---
const formatRelativeTime = (dateStr: string) => {
    try {
        const date = new Date(dateStr.replace(' ', 'T'));
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        if (diffSec < 60) return "just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDays === 1) return "yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

// --- Check if string contains HTML tags ---
const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

const Announcements = () => {
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    const courseId = Number(slug) || 1;

    // Redux Selectors
    const { announcements, loading, error } = useAppSelector((state: RootState) => state.announcement);

    // Local States
    const [searchTerm, setSearchTerm] = useState("");
    const [userProfile, setUserProfile] = useState<any>(null);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState<Record<number, boolean>>({});
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    const [commentFocus, setCommentFocus] = useState<Record<number, boolean>>({});

    // Fetch user profile on mount
    useEffect(() => {
        try {
            const profileStr = localStorage.getItem("userProfile");
            if (profileStr) {
                setUserProfile(JSON.parse(profileStr));
            }
        } catch (e) {
            console.error("Failed to parse user profile from localStorage", e);
        }
    }, []);

    // Fetch announcements on mount/courseId change
    useEffect(() => {
        if (courseId) {
            dispatch(fetchAnnouncements(courseId));
        }
    }, [dispatch, courseId]);

    // Filter announcements by search term
    const filteredAnnouncements = useMemo(() => {
        if (!searchTerm.trim()) return announcements;
        const term = searchTerm.toLowerCase();
        return announcements.filter(ann =>
            ann.title.toLowerCase().includes(term) ||
            ann.description.toLowerCase().includes(term) ||
            ann.instructor.text_1.toLowerCase().includes(term)
        );
    }, [announcements, searchTerm]);

    // Handle liking
    const handleLikeToggle = (announcementId: number) => {
        dispatch(toggleLocalLike(announcementId));
    };

    // Handle Commenting
    const handlePostComment = (announcementId: number) => {
        const content = commentInputs[announcementId]?.trim();
        if (!content) return;

        const newComment = {
            id: Date.now(),
            user: {
                id: userProfile?.user_id || 999,
                first_name: userProfile?.first_name || "Guest",
                last_name: userProfile?.last_name || "User",
                image: userProfile?.image || null,
                email: userProfile?.email || ""
            },
            content: content,
            created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
        dispatch(addCommentOnAnnouncements({
            announcement_id: announcementId,
            content: content,
        }))

        dispatch(addLocalComment({ announcementId, comment: newComment }));

        // Clear input and blur
        setCommentInputs(prev => ({ ...prev, [announcementId]: "" }));
        setCommentFocus(prev => ({ ...prev, [announcementId]: false }));
    };

    // Render description safely based on format (HTML vs plain text)
    const renderDescription = (text: string) => {
        if (isHtml(text)) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: text }}
                    className="text-[14.5px] text-[#2d2f31] leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>a]:text-[#a435f0] [&>a]:hover:underline [&>a]:font-bold"
                />
            );
        }
        return (
            <p className="text-[14.5px] text-[#2d2f31] leading-relaxed whitespace-pre-wrap">
                {text}
            </p>
        );
    };

    // Get avatar initials for current user
    const getUserInitials = () => {
        if (!userProfile) return "?";
        const first = userProfile.first_name?.charAt(0).toUpperCase() || "";
        const last = userProfile.last_name?.charAt(0).toUpperCase() || "";
        return `${first}${last}` || userProfile.email?.charAt(0).toUpperCase() || "?";
    };

    return (
        <div className="w-full max-w-[850px] mx-auto py-2 font-sans text-[#2d2f31]">
            {/* Pop animation for heart button */}
            <style>{`
                @keyframes heartPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .heart-animate-active {
                    animation: heartPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>

            {/* Header controls (Search & Info) */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6f73]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search course announcements"
                        className="w-full pl-10 pr-4 py-2.5 border border-[#2d2f31] rounded-sm focus:outline-none focus:border-[#a435f0] text-sm placeholder-[#6a6f73] transition-all bg-white"
                    />
                </div>
                <div className="text-xs font-bold text-[#6a6f73] shrink-0 self-center">
                    {filteredAnnouncements.length === 1
                        ? "1 announcement"
                        : `${filteredAnnouncements.length} announcements`}
                </div>
            </div>

            {/* Loading State */}
            {loading && announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-9 h-9 animate-spin text-[#a435f0] mb-3" />
                    <p className="text-xs text-[#6a6f73] font-semibold">Loading announcements...</p>
                </div>
            ) : error ? (
                /* Error State */
                <div className="py-16 text-center border border-red-200 bg-red-50/30 rounded-sm">
                    <p className="text-sm font-semibold text-red-600">Failed to load announcements: {error}</p>
                </div>
            ) : filteredAnnouncements.length === 0 ? (
                /* Empty Feed State */
                <div className="py-20 text-center border border-[#d1d7dc] rounded-sm bg-[#f7f9fa]/50 max-w-[600px] mx-auto shadow-xs">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs border border-[#d1d7dc]">
                        <VolumeX className="w-6 h-6 text-[#6a6f73]" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#2d2f31] mb-2">No announcements yet</h3>
                    <p className="text-[#6a6f73] max-w-sm mx-auto text-xs leading-relaxed px-4">
                        The instructor hasn't posted any announcements for this course yet. This feed will compile major news, resources, and updates from the instructor.
                    </p>
                </div>
            ) : (
                /* Announcements Feed List */
                <div className="flex flex-col gap-8">
                    {filteredAnnouncements.map((ann) => {
                        const isCommentsExpanded = !!expandedAnnouncements[ann.id];
                        const isDescLong = ann.description.length > 350;
                        const isDescExpanded = !!expandedDescriptions[ann.id];
                        const displayDescription = isDescLong && !isDescExpanded
                            ? ann.description.slice(0, 350) + "..."
                            : ann.description;

                        return (
                            <div
                                key={ann.id}
                                className="bg-white border border-[#d1d7dc] rounded-sm p-6 hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Instructor Meta Row */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="shrink-0">
                                        {ann.instructor.image ? (
                                            <img
                                                src={ann.instructor.image}
                                                alt={ann.instructor.text_1}
                                                className="w-11 h-11 rounded-full object-cover border border-[#d1d7dc] transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5624d0] to-[#a435f0] text-white flex items-center justify-center font-extrabold text-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
                                                {ann.instructor.text_1.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                            <h4 className="font-extrabold text-[#2d2f31] text-[15px] hover:text-[#a435f0] cursor-pointer transition-colors leading-tight">
                                                {ann.instructor.text_1}
                                            </h4>
                                            <span className="inline-flex items-center px-1.5 py-0.5 bg-[#f7f9fa] text-[#6a6f73] text-[9px] font-extrabold rounded-sm border border-[#d1d7dc] tracking-wider uppercase">
                                                INSTRUCTOR
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-[#6a6f73] font-semibold mt-0.5 truncate max-w-full">
                                            {ann.instructor.text_2} {ann.instructor.text_3 ? `• ${ann.instructor.text_3}` : ''} {ann.instructor.experience ? `• ${ann.instructor.experience} experience` : ''}
                                        </p>
                                        <p className="text-[11px] text-[#6a6f73] font-medium mt-0.5">
                                            posted an announcement • {formatRelativeTime(ann.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Body Section */}
                                <div className="mb-5">
                                    <h3 className="font-extrabold text-[#2d2f31] text-[17px] md:text-[19px] mb-3 leading-snug">
                                        {ann.title}
                                    </h3>
                                    <div className="transition-all duration-300">
                                        {renderDescription(displayDescription)}
                                    </div>
                                    {isDescLong && (
                                        <button
                                            onClick={() => setExpandedDescriptions(prev => ({ ...prev, [ann.id]: !prev[ann.id] }))}
                                            className="mt-2 text-xs font-bold text-[#a435f0] hover:text-[#8712d3] transition-colors inline-flex items-center gap-0.5"
                                        >
                                            {isDescExpanded ? "Show less" : "Show more"}
                                        </button>
                                    )}
                                </div>

                                <div className="h-px bg-[#d1d7dc] w-full mb-4" />

                                {/* Action Buttons Row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Like Interaction */}
                                    <button
                                        onClick={() => handleLikeToggle(ann.id)}
                                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200 text-xs font-bold ${ann.likedByMe
                                                ? "bg-pink-50/50 border-pink-200 text-pink-600 shadow-xs"
                                                : "border-[#d1d7dc] text-[#2d2f31] hover:bg-[#f7f9fa] hover:border-[#2d2f31]"
                                            }`}
                                    >
                                        <Heart
                                            size={14}
                                            className={`transition-all ${ann.likedByMe
                                                    ? "fill-pink-600 stroke-pink-600 heart-animate-active"
                                                    : "stroke-[2.5px]"
                                                }`}
                                        />
                                        <span>{ann.likesCount || 0}</span>
                                    </button>

                                    {/* Comments Toggle */}
                                    <button
                                        onClick={() => setExpandedAnnouncements(prev => ({ ...prev, [ann.id]: !prev[ann.id] }))}
                                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200 text-xs font-bold ${isCommentsExpanded
                                                ? "bg-purple-50/50 border-[#a435f0]/30 text-[#a435f0]"
                                                : "border-[#d1d7dc] text-[#2d2f31] hover:bg-[#f7f9fa] hover:border-[#2d2f31]"
                                            }`}
                                    >
                                        <MessageSquare size={14} className="stroke-[2.5px]" />
                                        <span>
                                            {ann.announcement_comments.length === 1
                                                ? "1 comment"
                                                : `${ann.announcement_comments.length} comments`}
                                        </span>
                                        {isCommentsExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                </div>

                                {/* Comments Thread sliding block */}
                                {isCommentsExpanded && (
                                    <div className="mt-5 pt-5 border-t border-[#e9eaf0] bg-[#f7f9fa] -mx-6 -mb-6 p-6 rounded-b-sm transition-all duration-300">
                                        {/* Comments Feed */}
                                        <div className="flex flex-col gap-4 mb-5">
                                            {ann.announcement_comments.length === 0 ? (
                                                <p className="text-xs text-[#6a6f73] italic py-2 pl-1">
                                                    No comments yet. Start the conversation!
                                                </p>
                                            ) : (
                                                ann.announcement_comments.map((comment) => (
                                                    <div key={comment.id} className="flex gap-3 items-start group/comment">
                                                        <div className="shrink-0">
                                                            {comment.user.image ? (
                                                                <img
                                                                    src={comment.user.image}
                                                                    alt={`${comment.user.first_name}`}
                                                                    className="w-8 h-8 rounded-full object-cover border border-[#d1d7dc] transition-transform duration-200 group-hover/comment:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-[#2d2f31] text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm shrink-0 transition-transform duration-200 group-hover/comment:scale-105">
                                                                    {comment.user.first_name.charAt(0).toUpperCase()}{comment.user.last_name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 bg-white p-3 rounded-sm border border-[#d1d7dc] shadow-xs">
                                                            <div className="flex justify-between items-center gap-2 mb-1.5">
                                                                <span className="font-extrabold text-[#2d2f31] text-[12px] leading-tight">
                                                                    {comment.user.first_name} {comment.user.last_name}
                                                                </span>
                                                                <span className="text-[10px] text-[#6a6f73] font-semibold">
                                                                    {formatRelativeTime(comment.created_at)}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12.5px] text-[#2d2f31] leading-relaxed whitespace-pre-wrap">
                                                                {comment.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Composer Box */}
                                        <div className="flex gap-3 items-start pt-2">
                                            <div className="shrink-0">
                                                {userProfile?.image ? (
                                                    <img
                                                        src={userProfile.image}
                                                        alt="User Avatar"
                                                        className="w-8 h-8 rounded-full object-cover border border-[#d1d7dc]"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2d2f31] to-[#4b5563] text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm">
                                                        {getUserInitials()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={commentInputs[ann.id] || ""}
                                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [ann.id]: e.target.value }))}
                                                    onFocus={() => setCommentFocus(prev => ({ ...prev, [ann.id]: true }))}
                                                    placeholder="Add a comment..."
                                                    rows={commentFocus[ann.id] ? 3 : 1}
                                                    className="w-full text-xs text-[#2d2f31] placeholder-[#6a6f73] border border-[#d1d7dc] rounded-sm px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#2d2f31] resize-none transition-all duration-200 shadow-inner"
                                                />
                                                {commentFocus[ann.id] && (
                                                    <div className="flex justify-end gap-2 mt-2.5">
                                                        <button
                                                            onClick={() => {
                                                                setCommentInputs(prev => ({ ...prev, [ann.id]: "" }));
                                                                setCommentFocus(prev => ({ ...prev, [ann.id]: false }));
                                                            }}
                                                            className="px-3.5 py-2 text-xs font-bold text-[#2d2f31] hover:bg-[#eaeaea] transition-colors rounded-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handlePostComment(ann.id)}
                                                            disabled={!(commentInputs[ann.id]?.trim())}
                                                            className="px-4 py-2 text-xs font-bold bg-[#a435f0] text-white rounded-sm hover:bg-[#8712d3] disabled:opacity-50 transition-colors shadow-xs"
                                                        >
                                                            Post Comment
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Announcements;
