import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Expand, Shrink, Settings } from "lucide-react";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
import VideoViewer from "./VideoViewer";
import PdfViewer from "./PdfViewer";
import SkeltonLoader from "../Loader/SkeltonLoader";

interface MediaViewerSectionProps {
  activeLesson: Lecture | null;
  loading?: boolean;
  isEmpty?: boolean;
  prevLesson?: Lecture | null;
  nextLesson?: Lecture | null;
  onNavigate?: (lesson: Lecture) => void;
}

export default function MediaViewerSection({
  activeLesson,
  loading,
  isEmpty,
  prevLesson,
  nextLesson,
  onNavigate,
}: MediaViewerSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleExpand = () => setIsExpanded(e => !e);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return <SkeltonLoader loaderType="media_player" />;
  }

  if (isEmpty && !activeLesson) {
    return (
      <div className="relative bg-black flex flex-col items-center justify-center gap-4 text-gray-600" style={{ aspectRatio: "16/9" }}>
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-gray-700">
          <FileText size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-bold text-gray-400">No content available</h3>
          <p className="text-[11px] text-gray-600 mt-1">This course doesn't have any lectures yet.</p>
        </div>
      </div>
    );
  }

  if (!activeLesson) return null;

  // ── Container sizing ───────────────────────────────────────────────────────
  const containerHeight = isFullscreen
    ? "100vh"
    : isExpanded
      ? "calc(100vh - 56px)"
      : activeLesson.lecture_type === 1
        ? "auto"
        : "700px";

  const containerStyle = activeLesson.lecture_type === 1 && !isExpanded && !isFullscreen
    ? { aspectRatio: "16/9" }
    : { height: containerHeight };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black flex flex-col transition-all duration-300 overflow-hidden"
      style={containerStyle}
    >
      {/* ── Viewer Wrapper ─────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 bg-black">

        {/* Floating Arrows: Lecture Navigation */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-4 z-30">
          <button
            onClick={() => prevLesson && onNavigate?.(prevLesson)}
            disabled={!prevLesson}
            className={`pointer-events-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-2xl
                       ${prevLesson ? 'bg-[#a435f0] text-white hover:bg-[#8710d8] active:scale-90 opacity-100' : 'bg-white/5 text-transparent opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          <button
            onClick={() => nextLesson && onNavigate?.(nextLesson)}
            disabled={!nextLesson}
            className={`pointer-events-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-2xl
                       ${nextLesson ? 'bg-[#a435f0] text-white hover:bg-[#8710d8] active:scale-90 opacity-100' : 'bg-white/5 text-transparent opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Media Content */}
        <div className="w-full h-full">
          {activeLesson.lecture_type === 1 ? (
            <VideoViewer
              key={activeLesson.id}
              activeLesson={activeLesson}
              isExpanded={isExpanded}
              isFullscreen={isFullscreen}
              onNext={() => nextLesson && onNavigate?.(nextLesson)}
            />
          ) : (
            <PdfViewer
              key={activeLesson.id}
              activeLesson={activeLesson}
              isExpanded={isExpanded}
              isFullscreen={isFullscreen}
            />
          )}
        </div>
      </div>

      {/* ── Unified Dashboard Bottom Bar ────────────────────────────────────── */}
      <div className="h-12 bg-white border-t border-[#d1d7dc] flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">

        {/* Left: Previous/Next Lecture Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => prevLesson && onNavigate?.(prevLesson)}
            disabled={!prevLesson}
            className="flex items-center gap-2 text-xs font-bold text-[#2d2f31] hover:text-[#a435f0] disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous Lesson</span>
          </button>

          <div className="w-px h-4 bg-[#d1d7dc]" />

          <button
            onClick={() => nextLesson && onNavigate?.(nextLesson)}
            disabled={!nextLesson}
            className="flex items-center gap-2 text-xs font-bold text-[#2d2f31] hover:text-[#a435f0] disabled:opacity-20 transition-all"
          >
            <span className="hidden sm:inline">Next Lesson</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Center: Badge */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#f7f9fa] text-[#2d2f31] border border-[#d1d7dc]">
            {activeLesson.lecture_type === 1 ? "Video Lecture" : "E-Book Content"}
          </span>
        </div>

        {/* Right: Expand & Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleExpand}
            className="p-2.5 text-[#2d2f31] hover:text-[#a435f0] hover:bg-[#f7f9fa] rounded-lg transition-all"
            title={isExpanded ? "Standard view" : "Expanded view"}
          >
            {isExpanded ? <Shrink size={18} /> : <Expand size={18} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 text-[#2d2f31] hover:text-[#a435f0] hover:bg-[#f7f9fa] rounded-lg transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline helper icons since I can't import easily
function FileText({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
  );
}
