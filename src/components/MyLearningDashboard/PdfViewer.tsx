import { useEffect, useState } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Settings,
} from "lucide-react";
import { getDashboardPdfSignedUrlApi } from "../../utils/service";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

interface PdfViewerProps {
  activeLesson: Lecture;
  isExpanded?: boolean;
  isFullscreen?: boolean;
  onToggleExpand?: () => void;
  onToggleFullscreen?: () => void;
}

const TOTAL_PAGES = 12;

export default function PdfViewer({
  activeLesson,
  isExpanded,
  isFullscreen,
}: PdfViewerProps) {
  const [pdfUrl, setPdfUrl]       = useState<string | null>(null);
  const [loading, setLoading]     = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom]           = useState(100);
  const [showSettings, setShowSettings] = useState(false);

  // ── Fetch signed URL ─────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    setPdfUrl(null);
    setError(null);
    setLoading(true);
    setCurrentPage(1);

    const fetchSignedUrl = async () => {
      try {
        const res = await getDashboardPdfSignedUrlApi(activeLesson?.id);
        if (res?.success && res?.data) {
          if (isMounted) setPdfUrl(res.data);
        } else {
          if (isMounted) setError("Unable to retrieve document. Please try again.");
        }
      } catch {
        if (isMounted) setError("Network error. Failed to fetch PDF URL.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (activeLesson?.id) {
      fetchSignedUrl();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [activeLesson]);

  const handleZoomIn  = () => setZoom(z => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 50));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, TOTAL_PAGES));

  const iframeSrc = pdfUrl
    ? `${pdfUrl}#toolbar=0&page=${currentPage}&zoom=${zoom}`
    : null;

  // Height fills parent
  const containerHeight = isFullscreen || isExpanded ? "100%" : "650px";

  return (
    <div
      className="relative flex flex-col w-full bg-[#1a1b1e] transition-all duration-300"
      style={{ height: containerHeight }}
    >
      {/* ── Consolidated Header (Title + Page Nav + Zoom) ───────────────────── */}
      <div className="flex items-center gap-4 px-5 h-12 bg-[#f7f9fa] border-b border-[#d1d7dc] shrink-0 z-20">
        <div className="w-6 h-6 bg-violet-600/15 rounded flex items-center justify-center shrink-0">
          <FileText size={13} className="text-violet-600" />
        </div>
        
        {/* Title */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[9px] font-black text-[#6a6f73] uppercase tracking-widest leading-none">E-Book Viewer</span>
          <h3 className="text-xs font-semibold text-[#2d2f31] truncate leading-tight">
            {activeLesson?.ebook_info?.name || "Untitled Document"}
          </h3>
        </div>

        {/* Page Nav (Moved to header) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#d1d7dc]">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="p-1 text-[#2d2f31] hover:text-[#a435f0] disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex items-center gap-1 px-1">
            <span className="text-[11px] font-bold text-[#2d2f31]">{currentPage}</span>
            <span className="text-[#6a6f73] text-[11px]">/</span>
            <span className="text-[#6a6f73] text-[11px] font-medium">{TOTAL_PAGES}</span>
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage >= TOTAL_PAGES}
            className="p-1 text-[#2d2f31] hover:text-[#a435f0] disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Zoom (Moved to header) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#d1d7dc]">
          <button onClick={handleZoomOut} className="p-1 text-[#2d2f31] hover:text-[#a435f0] transition-colors">
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-black text-[#2d2f31] min-w-[32px] text-center">{zoom}%</span>
          <button onClick={handleZoomIn} className="p-1 text-[#2d2f31] hover:text-[#a435f0] transition-colors">
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(s => !s)}
            className={`p-1.5 rounded-lg transition-all ${showSettings ? "text-[#a435f0] bg-[#a435f0]/10" : "text-[#2d2f31] hover:text-[#a435f0] hover:bg-white"}`}
          >
            <Settings size={14} />
          </button>
          {showSettings && (
            <div className="absolute top-10 right-0 w-44 bg-white border border-[#d1d7dc] rounded-xl shadow-2xl p-3 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-[9px] font-black text-[#6a6f73] uppercase tracking-widest">Reader Settings</p>
              <p className="text-xs text-[#2d2f31] hover:text-[#a435f0] cursor-pointer">Scroll mode: Page</p>
              <p className="text-xs text-[#2d2f31] hover:text-[#a435f0] cursor-pointer">Night mode: Off</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Main viewer (Fills remaining space) ────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden bg-[#2d2f31]">
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1b1e]/90 z-20 gap-3">
            <div className="w-8 h-8 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Loading...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1b1e] z-20 p-10 text-center gap-4">
            <p className="text-red-400 text-sm font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 bg-[#3e4143] text-gray-200 text-xs font-bold rounded-lg hover:bg-[#4e5153] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* PDF iframe - Height 100% */}
        {iframeSrc && !loading && !error && (
          <iframe
            src={iframeSrc}
            className="w-full h-full border-none"
            title={activeLesson?.ebook_info?.name || "PDF Viewer"}
          />
        )}
      </div>
    </div>
  );
}
