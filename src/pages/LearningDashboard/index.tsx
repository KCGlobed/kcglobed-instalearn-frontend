import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import type { RootState } from "../../store/store";
import { fetchDashboardChapterBySlug, clearCourseDetail as clearDashboardChapters } from "../../store/slices/courseDashboardChapterSlice";
import { fetchChapterLectures, setActiveLesson, clearLectureCache } from "../../store/slices/courseDashboardLectureSlice";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

import Header from "../../components/MyLearningDashboard/LearningHeader";
import CourseSidebar from "../../components/MyLearningDashboard/LearningSidebar";
import MediaViewerSection from "../../components/MyLearningDashboard/MediaViewerSection";
import CourseTabs from "../../components/MyLearningDashboard/CourseTabs";
import { getCourseProgressApi } from "../../utils/service";
import OverviewPanel from "../../components/CourseDetail/tabs/OverviewPanel";
import { fetchCourseById, clearCourseDetail as clearCourseDetailInfo } from "../../store/slices/courseDetailSlice";
import { Loader2 } from "lucide-react";
import Notes from "../../components/MyLearningDashboard/Notes";
import Announcements from "../../components/MyLearningDashboard/Announcements";
import LearningReminder from "../../components/MyLearningDashboard/LearningReminder";
import ReviewsPanel from "../../components/CourseDetail/tabs/ReviewsPanel";
import Certificate from "../../components/MyLearningDashboard/Certificate";
import SkeltonLoader from "../../components/Loader/SkeltonLoader";

export default function LMSCoursePage() {
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [courseProgress, setCourseProgress] = useState<{ percentage: number, name: string } | null>(null);
  const { courseDetail, loading: CourseDetailLoading, error: CourseDetailError } = useAppSelector((state: RootState) => state.courseDetail);
  const { chapters, loading: chaptersLoading } = useAppSelector((state: RootState) => state.courseDashboardChapter);
  const { activeLesson, lecturesByChapter, loadingChapters } = useAppSelector((state: RootState) => state.courseDashboardLecture);

  // Fetch Chapters on Mount
  useEffect(() => {
    if (slug) {
      dispatch(clearDashboardChapters());
      dispatch(clearCourseDetailInfo());
      dispatch(clearLectureCache());
      dispatch(setActiveLesson(null));
      dispatch(fetchDashboardChapterBySlug(Number(slug)));
    }
    return () => {
      dispatch(clearDashboardChapters());
      dispatch(clearCourseDetailInfo());
      dispatch(clearLectureCache());
      dispatch(setActiveLesson(null));
    };
  }, [dispatch, slug]);

  // Auto-select target lecture from router state (direct nav) or localStorage (last watched)
  useEffect(() => {
    if (!activeLesson && chapters.length > 0) {
      const courseId = Number(slug);

      // Priority 1: Router state (set by CurriculumPanel direct navigation)
      const routerTargetLectureId: number | undefined = location.state?.targetLectureId;
      const routerTargetChapterId: number | undefined = location.state?.targetChapterId;

      // Priority 2: localStorage (last watched session)
      const lastChapterIdStr = localStorage.getItem(`course_last_chapter_${courseId}`);
      const lastLectureIdStr = localStorage.getItem(`course_last_lecture_${courseId}`);

      const targetLectureId = routerTargetLectureId ?? (lastLectureIdStr ? Number(lastLectureIdStr) : undefined);
      const targetChapterId = routerTargetChapterId ?? (lastChapterIdStr ? Number(lastChapterIdStr) : undefined);

      if (targetLectureId && targetChapterId) {
        // First, try to find the lecture in already-loaded chapters
        // Search across ALL loaded lectures (not just the stored chapter) in case IDs differ
        for (const ch of chapters) {
          const chId = ch.chapter_info.id;
          const chLectures = lecturesByChapter[chId];
          if (chLectures) {
            const found = chLectures.find(l => l.id === targetLectureId);
            if (found) {
              dispatch(setActiveLesson(found));
              return;
            }
          }
        }

        // Not found yet — fetch the target chapter's lectures
        // Try the stored chapter ID first, then try all unloaded chapters
        const chapterExists = chapters.some(ch => ch.chapter_info.id === targetChapterId);
        if (chapterExists) {
          if (!loadingChapters.includes(targetChapterId)) {
            dispatch(fetchChapterLectures(targetChapterId));
          }
          return; // wait for lectures to load, then effect re-runs
        }

        // If chapter ID from storage doesn't match dashboard chapters (ID mismatch between APIs)
        // fetch lectures for ALL unloaded chapters so we can find the lecture by its ID
        let fetchedAny = false;
        for (const ch of chapters) {
          const chId = ch.chapter_info.id;
          if (!lecturesByChapter[chId] && !loadingChapters.includes(chId)) {
            dispatch(fetchChapterLectures(chId));
            fetchedAny = true;
          }
        }
        if (fetchedAny) return; // wait for lectures to load
      }

      // Default fallback: Auto-select first lecture of first chapter
      const firstChapterId = chapters[0].chapter_info.id;
      const firstChapterLectures = lecturesByChapter[firstChapterId];
      if (firstChapterLectures && firstChapterLectures.length > 0) {
        dispatch(setActiveLesson(firstChapterLectures[0]));
      } else if (!loadingChapters.includes(firstChapterId)) {
        dispatch(fetchChapterLectures(firstChapterId));
      }
    }
  }, [dispatch, chapters, activeLesson, lecturesByChapter, loadingChapters, slug, location.state]);

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


  const handleGetCourseProgress = useCallback(async (courseSlug: number) => {
    try {
      const result = await getCourseProgressApi(courseSlug);
      setCourseProgress({ percentage: result.data.progress, name: result.data.name });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      handleGetCourseProgress(Number(slug));
    }
  }, [slug, handleGetCourseProgress]);


  useEffect(() => {
    dispatch(fetchCourseById(Number(slug)));
  }, [slug]);





  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f7f9fa] flex flex-col font-sans selection:bg-[#a435f0]/30 text-[#2d2f31]">
      <Header courseName={courseProgress?.name ?? ""} progress={courseProgress?.percentage ?? 0} courseTitle={courseTitle} />

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

              <div className="mt-10 text-[#2d2f31] text-sm leading-relaxed ">
                {activeTab === "Overview" && (
                  CourseDetailLoading ? (
                    <SkeltonLoader loaderType="course_overview" />
                  ) : CourseDetailError ? (
                    <div className="py-24 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50">
                      <p className="text-red-600">Failed to load course details</p>
                    </div>
                  ) : (
                    <OverviewPanel courseDetail={courseDetail} />
                  )
                )}
                {
                  activeTab === "Notes" && (
                    <Notes />
                  )
                }
                {
                  activeTab === "Announcements" && (
                    <Announcements />
                  )
                }
                {
                  activeTab === "Reviews" && (
                    <ReviewsPanel courseDetail={courseDetail} />
                  )
                }
                {
                  activeTab === "Learning tools" && (
                    <LearningReminder />
                  )
                }
                {
                  activeTab === "Certificate" && (
                    <Certificate courseId={Number(slug)} progress={courseProgress?.percentage ?? 0} courseName={courseProgress?.name ?? ""} />
                  )
                }

                {/* {activeTab !== "Overview" && (
                  <div className="py-24 text-center border-2 border-dashed border-[#d1d7dc] rounded-xl bg-[#f7f9fa]/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#d1d7dc]">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2d2f31] mb-2">{activeTab} coming soon</h3>
                    <p className="text-[#6a6f73] max-w-sm mx-auto">We're working hard to bring you the {activeTab} section. Stay tuned for updates!</p>
                  </div>
                )} */}
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