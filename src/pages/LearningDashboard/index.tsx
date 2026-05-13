import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import type { RootState } from "../../store/store";
import { fetchDashboardChapterBySlug } from "../../store/slices/courseDashboardChapterSlice";
import { fetchChapterLectures, setActiveLesson } from "../../store/slices/courseDashboardLectureSlice";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

// ─── Components ──────────────────────────────────────────────────────────────
import Header from "../../components/MyLearningDashboard/LearningHeader";
import CourseSidebar from "../../components/MyLearningDashboard/LearningSidebar";
import MediaViewerSection from "../../components/MyLearningDashboard/MediaViewerSection";
import CourseTabs from "../../components/MyLearningDashboard/CourseTabs";

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LMSCoursePage() {
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Redux state
  const { chapters, loading: chaptersLoading } = useAppSelector((state: RootState) => state.courseDashboardChapter);
  const { activeLesson, lecturesByChapter, loadingChapters } = useAppSelector((state: RootState) => state.courseDashboardLecture);

  // 1. Fetch Chapters on Mount & Cleanup stale state
  useEffect(() => {
    if (slug) {
      // Clear previous state before fetching new data
      dispatch(setActiveLesson(null));
      dispatch(fetchDashboardChapterBySlug(Number(slug)));
    }
    
    return () => {
      dispatch(setActiveLesson(null));
    };
  }, [dispatch, slug]);

  // 2. Auto-select logic
  useEffect(() => {
    if (!activeLesson && chapters.length > 0) {
      const firstChapterId = chapters[0].chapter_info.id;
      
      // Check if we have lectures for the first chapter
      const firstChapterLectures = lecturesByChapter[firstChapterId];
      
      if (firstChapterLectures && firstChapterLectures.length > 0) {
        // Auto-select the first lesson
        dispatch(setActiveLesson(firstChapterLectures[0]));
      } else if (!loadingChapters.includes(firstChapterId)) {
        // Fetch lectures for the first chapter if not already loading
        dispatch(fetchChapterLectures(firstChapterId));
      }
    }
  }, [dispatch, chapters, activeLesson, lecturesByChapter, loadingChapters]);

  const courseTitle = activeLesson?.video_info?.name
    ?? activeLesson?.ebook_info?.name
    ?? "Course Learning";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1c1d1f] flex flex-col font-sans selection:bg-[#a435f0]/30 text-[#e8e8f0]">
      {/* Fixed Header: 56px */}
      <Header courseTitle={courseTitle} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area: Player + Tabs */}
        <main className="flex-1 h-full overflow-y-auto bg-black flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Player Section: Cinema Mode */}
          <div className="w-full bg-black shrink-0 flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-[1340px]">
              <MediaViewerSection 
                activeLesson={activeLesson} 
                loading={chaptersLoading}
                isEmpty={chapters.length === 0}
              />
            </div>
          </div>

          {/* Bottom Section: Tabs and Info */}
          <div className="flex-1 w-full bg-[#1c1d1f] border-t border-[#3e4143]">
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              <CourseTabs active={activeTab} setActive={setActiveTab} />

              <div className="mt-8 text-[#e8e8f0] text-sm leading-relaxed max-w-[800px]">
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-white tracking-tight">About this course</h2>
                      <p className="text-[#9b9da2] text-base leading-relaxed">
                        Master the curriculum with this comprehensive learning experience.
                        Use the sidebar to navigate through sections and lectures.
                        Track your progress as you complete each lesson.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#3e4143]">
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-white">By the numbers</h3>
                        <div className="flex flex-col gap-2 text-sm text-[#9b9da2]">
                          <div className="flex justify-between">
                            <span>Skill level:</span>
                            <span className="text-white">All Levels</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students:</span>
                            <span className="text-white">1,068,702</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Languages:</span>
                            <span className="text-white">English</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-white">Certificates</h3>
                        <p className="text-sm text-[#9b9da2]">
                          Get a certificate of completion by finishing the entire course.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab !== "Overview" && (
                  <div className="py-20 text-center border border-dashed border-[#3e4143] rounded-lg bg-black/20">
                    <p className="text-[#9b9da2] italic">
                      The {activeTab} section is currently under development.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scroll space */}
            <div className="h-20 shrink-0" />
          </div>
        </main>

        {/* Sidebar: Fixed Curriculum */}
        <CourseSidebar />
      </div>
    </div>
  );
}