import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import type { RootState } from "../../store/store";
import { fetchDashboardChapterBySlug } from "../../store/slices/courseDashboardChapterSlice";
import { fetchChapterLectures, setActiveLesson } from "../../store/slices/courseDashboardLectureSlice";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

import Header from "../../components/MyLearningDashboard/LearningHeader";
import CourseSidebar from "../../components/MyLearningDashboard/LearningSidebar";
import MediaViewerSection from "../../components/MyLearningDashboard/MediaViewerSection";
import CourseTabs from "../../components/MyLearningDashboard/CourseTabs";

export default function LMSCoursePage() {
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const { chapters, loading: chaptersLoading } = useAppSelector((state: RootState) => state.courseDashboardChapter);
  const { activeLesson, lecturesByChapter, loadingChapters } = useAppSelector((state: RootState) => state.courseDashboardLecture);

  // Fetch Chapters on Mount
  useEffect(() => {
    if (slug) {
      dispatch(setActiveLesson(null));
      dispatch(fetchDashboardChapterBySlug(Number(slug)));
    }
    return () => { dispatch(setActiveLesson(null)); };
  }, [dispatch, slug]);

  // Auto-select first lecture
  useEffect(() => {
    if (!activeLesson && chapters.length > 0) {
      const firstChapterId = chapters[0].chapter_info.id;
      const firstChapterLectures = lecturesByChapter[firstChapterId];
      if (firstChapterLectures && firstChapterLectures.length > 0) {
        dispatch(setActiveLesson(firstChapterLectures[0]));
      } else if (!loadingChapters.includes(firstChapterId)) {
        dispatch(fetchChapterLectures(firstChapterId));
      }
    }
  }, [dispatch, chapters, activeLesson, lecturesByChapter, loadingChapters]);

  // Build a flat ordered lecture list across all loaded chapters
  const flatLectures = useMemo(() => {
    return chapters.flatMap(ch => {
      const lectures = lecturesByChapter[ch.chapter_info.id];
      if (!lectures) return [];
      return [...lectures].sort((a, b) => a.order - b.order);
    });
  }, [chapters, lecturesByChapter]);

  const currentIndex = useMemo(
    () => flatLectures.findIndex(l => l.id === activeLesson?.id),
    [flatLectures, activeLesson]
  );

  const prevLesson = currentIndex > 0 ? flatLectures[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < flatLectures.length - 1
    ? flatLectures[currentIndex + 1]
    : null;

  const handleNavigate = useCallback((lesson: Lecture) => {
    if (!lecturesByChapter[lesson.chapter]) {
      dispatch(fetchChapterLectures(lesson.chapter));
    }
    dispatch(setActiveLesson(lesson));
  }, [dispatch, lecturesByChapter]);

  const courseTitle = activeLesson?.video_info?.name
    ?? activeLesson?.ebook_info?.name
    ?? "Course Learning";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f7f9fa] flex flex-col font-sans selection:bg-[#a435f0]/30 text-[#2d2f31]">
      <Header courseTitle={courseTitle} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 h-full overflow-y-auto bg-[#f7f9fa] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Player Section - Kept dark for cinematic focus */}
          <div className="w-full bg-[#1c1d1f] shrink-0 shadow-lg relative z-10">
            <MediaViewerSection
              activeLesson={activeLesson}
              loading={chaptersLoading}
              isEmpty={chapters.length === 0}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Bottom Tabs Section */}
          <div className="flex-1 w-full bg-white border-t border-[#d1d7dc]">
            <div className="max-w-[1200px] mx-auto px-6 py-10">
              <CourseTabs active={activeTab} setActive={setActiveTab} />
              
              <div className="mt-10 text-[#2d2f31] text-sm leading-relaxed max-w-[850px]">
                {activeTab === "Overview" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-[#2d2f31] tracking-tight">About this course</h2>
                        <p className="text-[#6a6f73] text-base leading-relaxed">
                          Master the curriculum with this comprehensive learning experience. 
                          Use the sidebar to navigate through sections and lectures. 
                          Track your progress as you complete each lesson.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#d1d7dc]">
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-[#2d2f31]">By the numbers</h3>
                          <div className="flex flex-col gap-3 text-sm text-[#6a6f73]">
                            <div className="flex justify-between border-b border-[#f7f9fa] pb-2">
                              <span className="font-medium">Skill level:</span>
                              <span className="text-[#2d2f31] font-semibold">All Levels</span>
                            </div>
                            <div className="flex justify-between border-b border-[#f7f9fa] pb-2">
                              <span className="font-medium">Students:</span>
                              <span className="text-[#2d2f31] font-semibold">1,068,702</span>
                            </div>
                            <div className="flex justify-between border-b border-[#f7f9fa] pb-2">
                              <span className="font-medium">Languages:</span>
                              <span className="text-[#2d2f31] font-semibold">English</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-[#2d2f31]">Certificates</h3>
                          <p className="text-sm text-[#6a6f73] leading-relaxed">
                            Get a certificate of completion by finishing the entire course. 
                            Showcase your expertise to potential employers or your professional network.
                          </p>
                          <div className="pt-2">
                             <button className="px-4 py-2 border-2 border-[#2d2f31] text-[#2d2f31] font-bold text-xs hover:bg-[#f7f9fa] transition-colors rounded">
                               View Sample Certificate
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab !== "Overview" && (
                  <div className="py-24 text-center border-2 border-dashed border-[#d1d7dc] rounded-xl bg-[#f7f9fa]/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#d1d7dc]">
                       <span className="text-2xl">⏳</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2d2f31] mb-2">{activeTab} coming soon</h3>
                    <p className="text-[#6a6f73] max-w-sm mx-auto">We're working hard to bring you the {activeTab} section. Stay tuned for updates!</p>
                  </div>
                )}
              </div>
            </div>
            <div className="h-24 shrink-0" />
          </div>
        </main>

        <CourseSidebar />
      </div>
    </div>
  );
}