import { FileText, PlayCircle, CheckCircle2, ChevronDown } from "lucide-react";
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
  const isCompleted = lesson.id % 3 === 0; // Mocked for UI matching
  const title = isVideo ? lesson?.video_info?.name : lesson?.ebook_info?.name;
  const duration = isVideo ? formatDuration(lesson?.video_info?.video_duration) : "";

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 px-4 py-4 cursor-pointer transition-all border-b border-[#f7f9fa] group ${
        isActive
          ? "bg-[#f7f9fa]"
          : "bg-white hover:bg-[#f7f9fa]/60"
      }`}
    >
      <div className="flex-1 min-w-0">
        <h4
          className={`text-[13px] font-bold leading-snug break-words mb-1.5 transition-colors ${
            isActive ? "text-[#a435f0]" : "text-[#2d2f31] group-hover:text-[#a435f0]"
          }`}
        >
          {lesson.id}. {title || "Untitled Lecture"}
        </h4>

        <div className="flex items-center gap-1.5">
           {isVideo ? (
              <PlayCircle size={12} className={isActive ? "text-[#a435f0]" : "text-[#6a6f73]"} />
           ) : (
              <FileText size={12} className={isActive ? "text-[#a435f0]" : "text-[#6a6f73]"} />
           )}
           <span className={`text-[11px] font-medium ${isActive ? "text-[#a435f0]" : "text-[#6a6f73]"}`}>
             {duration || "1min"}
           </span>
        </div>
      </div>
    </div>
  );
}



