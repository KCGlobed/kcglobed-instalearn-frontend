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
          if (isMounted) setError("Could not load PDF. Please try again.");
        }
      } catch {
        if (isMounted) setError("Failed to fetch PDF URL.");
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
      className="relative bg-gray-100 rounded-lg overflow-hidden w-full"
      style={{ minHeight: "600px" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
        <FileText size={14} className="text-violet-400" />
        <span className="text-[13px] text-gray-200 font-medium truncate">
          {activeLesson?.ebook_info?.name || "PDF Document"}
        </span>
      </div>

      {loading && (
        <div className="absolute inset-0 top-[40px] flex items-center justify-center bg-white/80 z-10">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 top-[40px] flex flex-col items-center justify-center bg-white z-10 gap-3">
          <FileText size={40} className="text-gray-300" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {pdfUrl && !loading && !error && (
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full border-none"
          style={{ height: "calc(100% - 40px)", minHeight: "560px" }}
          title={activeLesson?.ebook_info?.name || "PDF Viewer"}
        />
      )}
    </div>
  );
}
