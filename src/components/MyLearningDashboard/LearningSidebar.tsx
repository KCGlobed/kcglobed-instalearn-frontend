import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import { fetchDashboardChapterBySlug } from "../../store/slices/courseDashboardChapterSlice";
import type { RootState } from "../../store/store";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import ChapterAccordion from "./ChapterAccordion";

interface CourseSidebarProps {}

export default function CourseSidebar({}: CourseSidebarProps) {
  const { chapters, loading, error } = useAppSelector(
    (state: RootState) => state.courseDashboardChapter
  );

  return (
    <aside className="w-[350px] bg-[#1c1d1f] border-l border-[#3e4143] flex flex-col shrink-0 h-full z-30 font-sans">
      {/* Sidebar Header */}
      <div className="px-4 py-3.5 border-b border-[#3e4143] bg-[#1c1d1f] shrink-0 flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-tight">Course content</h2>
        <button className="p-1 hover:bg-[#3e4143] rounded transition-colors text-white">
          <X size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#1c1d1f] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-[3px] border-[#a435f0] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-[#9b9da2] uppercase tracking-widest">Loading...</span>
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-10 text-center">
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && chapters.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-xs text-[#9b9da2] font-medium">No chapters found.</p>
          </div>
        )}

        {!loading &&
          chapters.map((chapter, index) => (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              defaultOpen={index === 0} // Open the first section by default
            />
          ))}
      </div>
    </aside>
  );
}



