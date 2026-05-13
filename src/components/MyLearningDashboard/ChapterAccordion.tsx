import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import { fetchChapterLectures, setActiveLesson } from "../../store/slices/courseDashboardLectureSlice";
import type { RootState } from "../../store/store";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";
import LessonItem from "./LessonItem";

interface ChapterAccordionProps {
  chapter: Chapter;
  defaultOpen?: boolean;
}

export default function ChapterAccordion({
  chapter,
  defaultOpen = false,
}: ChapterAccordionProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const dispatch = useAppDispatch();
  const chapterId = chapter.chapter_info.id;

  const { lecturesByChapter, loadingChapters, activeLesson } = useAppSelector(
    (state: RootState) => state.courseDashboardLecture
  );

  const lectures = lecturesByChapter[chapterId] ?? [];
  const isLoading = loadingChapters.includes(chapterId);

  useEffect(() => {
    if (open) {
      dispatch(fetchChapterLectures(chapterId));
    }
  }, [open, chapterId, dispatch]);

  // Mock progress for UI matching: completed / total | duration
  const totalLectures = chapter.chapter_info.no_of_videos;
  const totalDuration = chapter.chapter_info.no_of_videos_duration;
  const completedLectures = 1; // Example

  function formatDuration(seconds: number): string {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}min ${s}s` : `${m}min`;
  }

  return (
    <div className="border-b border-[#d1d7dc] bg-white">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-4 text-left transition-all ${
          open ? "bg-[#f7f9fa]" : "hover:bg-[#f7f9fa]/80"
        }`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-[14px] font-bold text-[#2d2f31] leading-snug tracking-tight">
            Section {chapterId}: {chapter.chapter_info.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-[#6a6f73]">
            <span>{completedLectures} / {totalLectures} | {formatDuration(totalDuration)}</span>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-[#2d2f31] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="bg-white border-t border-[#f7f9fa]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="w-5 h-5 border-2 border-[#a435f0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lectures.length === 0 ? (
            <p className="text-[11px] text-[#6a6f73] px-6 py-4 italic">No lectures available in this section.</p>
          ) : (
            <div className="flex flex-col">
              {lectures.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isActive={activeLesson?.id === lesson.id}
                  onClick={() => dispatch(setActiveLesson(lesson))}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


