import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchChapterLectures } from "../../store/slices/courseDashboardLectureSlice";
import type { RootState } from "../../store/store";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import LessonItem from "./LessonItem";

interface ChapterAccordionProps {
  chapter: Chapter;
  activeLesson: Lecture | null;
  setActiveLesson: (lesson: Lecture) => void;
  defaultOpen?: boolean;
}

export default function ChapterAccordion({
  chapter,
  activeLesson,
  setActiveLesson,
  defaultOpen = false,
}: ChapterAccordionProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const dispatch = useAppDispatch();
  const chapterId = chapter.chapter_info.id;

  const lectures = useAppSelector(
    (state: RootState) => state.courseDashboardLecture.lecturesByChapter[chapterId] ?? []
  );
  const isLoading = useAppSelector((state: RootState) =>
    state.courseDashboardLecture.loadingChapters.includes(chapterId)
  );

  // Fetch lectures when accordion is opened (caching prevents duplicate calls)
  useEffect(() => {
    if (open) {
      dispatch(fetchChapterLectures(chapterId));
    }
  }, [open, chapterId, dispatch]);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition text-left"
      >
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[13px] font-bold text-gray-800 leading-snug">
            {chapter.chapter_info.name}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {chapter.progress}% · {chapter.chapter_info.no_of_videos} lectures ·{" "}
            {chapter.chapter_info.no_of_videos_duration} min
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lectures.length === 0 ? (
            <p className="text-[12px] text-gray-400 px-4 py-3">No lectures found.</p>
          ) : (
            lectures.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isActive={activeLesson?.id === lesson.id}
                onClick={() => setActiveLesson(lesson)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
