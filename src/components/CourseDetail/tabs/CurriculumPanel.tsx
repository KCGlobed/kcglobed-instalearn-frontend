import React, { useState } from 'react';
import { BookOpen, Clock, PlayCircle, Lock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { useModal } from '../../Modals/ModalContext';
import SampleVideo from '../../Modals/SampleVideo';
import { useAppSelector } from '../../../hooks/useRedux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

const CurriculumPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const videos = courseDetail?.sample_videos ?? [];
    const chapters = courseDetail?.course_chapters ?? courseDetail?.chapters ?? [];
    const { showModal } = useModal();
    const [openChapterId, setOpenChapterId] = useState<number | null>(chapters.length > 0 ? chapters[0].id : null);
    const navigate = useNavigate();

    const { enrolledCourses } = useAppSelector((state: RootState) => state.myLearning);
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    const purchasedCourse = isAuthenticated && enrolledCourses?.find(
        (course: any) => course.id === courseDetail?.id
    );

    const isUnlockAll = purchasedCourse && purchasedCourse.progress > 0;

    const handlePlayVideo = (videoId: number) => {
        showModal({
            content: <SampleVideo courseDetail={courseDetail} initialVideoId={videoId} />,
            size: "lg",
            type: "custom",
        });
    };

    const toggleChapter = (id: number) => {
        setOpenChapterId(prev => (prev === id ? null : id));
    };

    const handleLectureClick = (chapter: any, lecture: any) => {
        if (isUnlockAll && courseDetail?.id) {
            const courseId = courseDetail.id;
            const chapterId = chapter.chapter_info?.id || chapter.id;
            // Store in localStorage as backup
            localStorage.setItem(`course_last_lecture_${courseId}`, lecture.id.toString());
            localStorage.setItem(`course_last_chapter_${courseId}`, chapterId.toString());
            // Pass via router state for reliable direct navigation
            navigate(`/learning/dashboard/${courseId}`, {
                state: { targetLectureId: lecture.id, targetChapterId: chapterId }
            });
        }
    };

    return (
        <div id="tabpanel-Curriculum" role="tabpanel" aria-labelledby="tab-Curriculum" className="mb-12">
            <SectionTitle
                icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
                title="Course Curriculum"
                subtitle={`${chapters.length} sections • ${videos.length} free preview${videos.length === 1 ? '' : 's'}`}
            />

            {/* Free Sample Videos */}
            {videos.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Free Previews</h3>
                    <ul className="space-y-2">
                        {videos.map((video: any, idx: number) => {
                            const durationSec = Number(video.duration);
                            const mins = Math.floor(durationSec / 60);
                            const secs = durationSec % 60;
                            const durationLabel = !isNaN(durationSec) && durationSec > 0
                                ? `${mins}:${String(secs).padStart(2, '0')}`
                                : video.duration ?? '';

                            return (
                                <li key={video.id}>
                                    <button
                                        onClick={() => handlePlayVideo(video.id)}
                                        className="group w-full flex items-center gap-4 px-5 py-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-pointer text-left"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 transition-colors shrink-0">
                                            {idx + 1}
                                        </span>
                                        <PlayCircle className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors shrink-0" />
                                        <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                            {video.name}
                                        </span>
                                        {durationLabel && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                                                <Clock className="w-3.5 h-3.5" />
                                                {durationLabel}
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                                            Preview
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Chapters Accordion */}
            {chapters.length > 0 ? (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
                    <div className="space-y-3">
                        {chapters.map((chapter: any) => {
                            const isOpen = openChapterId === chapter.id;
                            const lectures = chapter.chapter_lectures || [];

                            return (
                                <div key={chapter.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
                                    <button
                                        onClick={() => toggleChapter(chapter.id)}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/50 hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                                            )}
                                            <span className="font-bold text-gray-900 text-[15px]">
                                                {chapter.chapter_info?.name || "Section"}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium bg-white border border-gray-200 px-3 py-1 rounded-full">
                                            {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="divide-y divide-gray-100 px-2 pb-2 pt-1 bg-white">
                                            {lectures.map((lecture: any) => {
                                                // Identify if it's a video or ebook by checking if the info object has keys
                                                const isVideo = lecture.video_info && Object.keys(lecture.video_info).length > 0;
                                                const isEbook = lecture.ebook_info && Object.keys(lecture.ebook_info).length > 0;

                                                const name = isVideo ? lecture.video_info.name : (isEbook ? lecture.ebook_info.name : "Lecture");

                                                const durationSec = Number(lecture.video_info?.video_duration || 0);
                                                const mins = Math.ceil(durationSec / 60);
                                                return (
                                                    <div
                                                        key={lecture.id}
                                                        onClick={() => handleLectureClick(chapter, lecture)}
                                                        className={`flex items-start gap-3 px-6 py-4 text-gray-700 rounded-lg mx-2 transition-colors group ${isUnlockAll
                                                                ? 'cursor-pointer hover:bg-indigo-50/70 hover:text-indigo-900'
                                                                : 'cursor-default hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {/* Type Icon */}
                                                        <div className="mt-0.5 shrink-0">
                                                            {isVideo ? (
                                                                <PlayCircle className={`w-4 h-4 transition-colors ${isUnlockAll
                                                                        ? 'text-indigo-500 group-hover:text-indigo-700'
                                                                        : 'text-indigo-300 group-hover:text-indigo-500'
                                                                    }`} />
                                                            ) : isEbook ? (
                                                                <FileText className={`w-4 h-4 transition-colors ${isUnlockAll
                                                                        ? 'text-orange-500 group-hover:text-orange-700'
                                                                        : 'text-orange-300 group-hover:text-orange-500'
                                                                    }`} />
                                                            ) : (
                                                                <Lock className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                                            )}
                                                        </div>

                                                        {/* Title & Lock */}
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <p className="text-[14px] font-medium leading-snug group-hover:text-gray-900 transition-colors">
                                                                {name}
                                                            </p>
                                                            {!isUnlockAll && <Lock className="w-3 h-3 text-gray-300" />}
                                                        </div>

                                                        {/* Meta */}
                                                        {isVideo && mins > 0 && (
                                                            <span className="text-xs text-gray-500 font-mono whitespace-nowrap bg-gray-100 px-2 py-1 rounded-md">
                                                                {mins} min
                                                            </span>
                                                        )}
                                                        {isEbook && (
                                                            <span className="text-xs text-gray-500 font-mono whitespace-nowrap bg-gray-100 px-2 py-1 rounded-md">
                                                                PDF
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                !videos.length && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-medium">Curriculum details are coming soon.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default CurriculumPanel;
