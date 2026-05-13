import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import VideoViewer from "./VideoViewer";
import PdfViewer from "./PdfViewer";

interface MediaViewerSectionProps {
  activeLesson: Lecture | null;
}

export default function MediaViewerSection({ activeLesson }: MediaViewerSectionProps) {
  if (!activeLesson) {
    return (
      <div
        className="relative bg-gray-900 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center gap-3 text-gray-500"
        style={{ aspectRatio: "16/9" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="20,16 20,32 34,24" fill="currentColor" opacity="0.5" />
        </svg>
        <p className="text-sm font-medium">Select a lecture to start learning</p>
      </div>
    );
  }

  // lecture_type === 1 → Video
  if (activeLesson.lecture_type === 1) {
    return <VideoViewer activeLesson={activeLesson} />;
  }

  // lecture_type === 2 → PDF / Ebook
  if (activeLesson.lecture_type === 2) {
    return <PdfViewer activeLesson={activeLesson} />;
  }

  return (
    <div
      className="relative bg-gray-900 rounded-lg flex items-center justify-center text-gray-500 text-sm"
      style={{ aspectRatio: "16/9" }}
    >
      Unsupported lecture type
    </div>
  );
}
