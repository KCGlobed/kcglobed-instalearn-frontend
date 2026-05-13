import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import VideoViewer from "./VideoViewer";
import PdfViewer from "./PdfViewer";

interface MediaViewerSectionProps {
  activeLesson: Lecture | null;
  loading?: boolean;
  isEmpty?: boolean;
}

export default function MediaViewerSection({ activeLesson, loading, isEmpty }: MediaViewerSectionProps) {
  if (loading) {
    return (
      <div
        className="relative bg-black flex flex-col items-center justify-center gap-4 text-gray-600"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#a435f0]/20 border-t-[#a435f0] rounded-full animate-spin" />
          <span className="text-[11px] font-bold text-[#9b9da2] uppercase tracking-[0.2em]">Loading Course Content</span>
        </div>
      </div>
    );
  }

  if (isEmpty && !activeLesson) {
    return (
      <div
        className="relative bg-black flex flex-col items-center justify-center gap-4 text-gray-600"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-700">
               <path d="M21 12L3 21V3L21 12Z" fill="currentColor" />
             </svg>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-gray-400">No content available</h3>
            <p className="text-[11px] text-gray-600 mt-1">This course doesn't have any lectures yet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeLesson) {
    return (
      <div
        className="relative bg-black flex flex-col items-center justify-center gap-4 text-gray-600"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#a435f0]/20 border-t-[#a435f0] rounded-full animate-spin" />
          <span className="text-[11px] font-bold text-[#9b9da2] uppercase tracking-[0.2em]">Initializing Player</span>
        </div>
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
      className="relative bg-gray-950 flex items-center justify-center text-gray-500 text-xs font-bold uppercase tracking-widest border border-gray-800"
      style={{ aspectRatio: "16/9" }}
    >
      Unsupported Content Type
    </div>
  );
}

