import { useState } from "react";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

// ─── Components ──────────────────────────────────────────────────────────────
import Header from "../../components/MyLearningDashboard/LearningHeader";
import CourseSidebar from "../../components/MyLearningDashboard/LearningSidebar";
import MediaViewerSection from "../../components/MyLearningDashboard/MediaViewerSection";
import CourseTabs from "../../components/MyLearningDashboard/CourseTabs";

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LMSCoursePage() {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [activeLesson, setActiveLesson] = useState<Lecture | null>(null);

  const courseTitle = activeLesson?.video_info?.name
    ?? activeLesson?.ebook_info?.name
    ?? "Course Learning";

  return (
    <div className="h-screen overflow-hidden bg-gray-950 flex flex-col font-sans">
      {/* Fixed top header */}
      <Header courseTitle={courseTitle} />

      <div className="flex flex-1 overflow-hidden ">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto mr-[380px] bg-gray-900">
          <div className="p-4 space-y-4 max-w-[1400px] mx-auto">
            {/* Dynamic media viewer: Video or PDF */}
            <MediaViewerSection activeLesson={activeLesson} />

            {/* Course tabs: Overview / Notes / Announcements etc. */}
            <div className="bg-gray-900">
              <CourseTabs active={activeTab} setActive={setActiveTab} />

              <div className="pt-4 pb-6 text-gray-400 text-sm">
                {activeTab === "Overview" && (
                  <p className="leading-relaxed">
                    Welcome! Select a lecture from the sidebar to start learning.
                  </p>
                )}
                {activeTab !== "Overview" && (
                  <p className="text-center py-10 text-gray-500">
                    {activeTab} content coming soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Fixed right sidebar: chapters + lectures */}
        <CourseSidebar
          activeLesson={activeLesson}
          setActiveLesson={setActiveLesson}
        />
      </div>
    </div>
  );
}