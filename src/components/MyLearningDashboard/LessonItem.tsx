import { FileText, Video } from "lucide-react";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

interface LessonItemProps {
  lesson: Lecture;
  isActive: boolean;
  onClick: () => void;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export default function LessonItem({ lesson, isActive, onClick }: LessonItemProps) {
  const isVideo = lesson.lecture_type === 1;
  const title = isVideo ? lesson?.video_info?.name : lesson?.ebook_info?.name;
  const duration = isVideo ? formatDuration(lesson?.video_info?.video_duration) : "";

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition group ${
        isActive
          ? "bg-violet-50 border-l-2 border-violet-500"
          : "hover:bg-gray-50 border-l-2 border-transparent"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {isVideo ? (
            <Video size={13} className={isActive ? "text-violet-500" : "text-gray-400"} />
          ) : (
            <FileText size={13} className={isActive ? "text-violet-500" : "text-gray-400"} />
          )}

          <span
            className={`text-[13px] leading-snug ${
              isActive ? "text-violet-700 font-semibold" : "text-gray-700"
            }`}
          >
            {title || "Lecture"}
          </span>
        </div>

        {duration && (
          <div className="ml-5 mt-1">
            <span className="text-[11px] text-gray-400">{duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}
