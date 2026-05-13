import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import { fetchDashboardChapterBySlug } from "../../store/slices/courseDashboardChapterSlice";
import type { RootState } from "../../store/store";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import ChapterAccordion from "./ChapterAccordion";

interface CourseSidebarProps {
  activeLesson: Lecture | null;
  setActiveLesson: (lesson: Lecture) => void;
}

export default function CourseSidebar({ activeLesson, setActiveLesson }: CourseSidebarProps) {
  const dispatch = useAppDispatch();
  const { slug } = useParams();

  const { chapters, loading, error } = useAppSelector(
    (state: RootState) => state.courseDashboardChapter
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchDashboardChapterBySlug(Number(slug)));
    }
  }, [dispatch, slug]);

  return (
    <aside className="w-[380px] fixed right-0 top-[60px] bottom-0 bg-white border-l border-gray-200 flex flex-col z-30">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Course content</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-7 h-7 border-[3px] border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-[12px] text-red-500 px-4 py-4">{error}</p>
        )}

        {!loading && !error && chapters.length === 0 && (
          <p className="text-[12px] text-gray-400 px-4 py-4">No chapters found.</p>
        )}

        {!loading &&
          chapters.map((chapter) => (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              activeLesson={activeLesson}
              setActiveLesson={setActiveLesson}
            />
          ))}
      </div>
    </aside>
  );
}
