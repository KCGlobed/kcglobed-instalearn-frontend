import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { getDashboardPdfSignedUrlApi } from "../../utils/service";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

interface PdfViewerProps {
  activeLesson: Lecture;
}

export default function PdfViewer({ activeLesson }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setPdfUrl(null);
    setError(null);
    setLoading(true);

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

    return () => {
      isMounted = false;
    };
  }, [activeLesson]);

  return (
    <div
      className="relative bg-gray-900 w-full overflow-hidden"
      style={{ minHeight: "650px" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#1c1d1f] shrink-0">
        <div className="w-8 h-8 bg-violet-600/10 rounded flex items-center justify-center">
           <FileText size={16} className="text-violet-400" />
        </div>
        <div className="flex flex-col min-w-0">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">E-Book Viewer</span>
           <h3 className="text-sm font-bold text-gray-200 truncate leading-tight">
             {activeLesson?.ebook_info?.name || "Untitled Document"}
           </h3>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 top-[64px] flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm z-10 gap-3">
          <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading document...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 top-[64px] flex flex-col items-center justify-center bg-gray-950 z-10 p-10 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
             <FileText size={32} className="text-red-500/50" />
          </div>
          <p className="text-red-400 text-sm font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-gray-800 text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors">
            Reload Document
          </button>
        </div>
      )}

      {pdfUrl && !loading && !error && (
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full border-none bg-white/5"
          style={{ height: "calc(100% - 64px)", minHeight: "586px" }}
          title={activeLesson?.ebook_info?.name || "PDF Viewer"}
        />
      )}
    </div>
  );
}

