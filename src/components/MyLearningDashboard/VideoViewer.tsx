import { useEffect, useRef, useState } from "react";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";

const BASE_VIDEO_URL = "https://storage.googleapis.com/instalearn-public-bucket/";

interface VideoViewerProps {
  activeLesson: Lecture;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export default function VideoViewer({ activeLesson }: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeLesson?.video_info?.transcoded_video) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const videoUrl = BASE_VIDEO_URL + activeLesson.video_info.transcoded_video;
    const video = videoRef.current;
    if (!video) return;

    let hls: any = null;

    const initPlayer = async () => {
      if (videoUrl.endsWith(".m3u8")) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoUrl;
          video.addEventListener("loadedmetadata", () => {
            setLoading(false);
            video.play().catch(console.error);
          });
        } else {
          try {
            // @ts-ignore
            const HlsModule = await import("hls.js");
            const Hls = HlsModule.default || HlsModule;
            if (Hls.isSupported()) {
              hls = new Hls();
              hls.loadSource(videoUrl);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setLoading(false);
                video.play().catch(console.error);
              });
              hls.on(Hls.Events.ERROR, (_: any, data: any) => {
                if (data.fatal) {
                  setError("Fatal error loading video stream.");
                  setLoading(false);
                }
              });
            } else {
              setError("HLS is not supported.");
              setLoading(false);
            }
          } catch {
            setError("Failed to load player.");
            setLoading(false);
          }
        }
      } else {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", () => {
          setLoading(false);
          video.play().catch(console.error);
        });
        video.addEventListener("error", () => {
          setError("Error loading video.");
          setLoading(false);
        });
      }
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      } else if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [activeLesson]);

  const title = activeLesson?.video_info?.name || "Video Lecture";
  const duration = formatDuration(activeLesson?.video_info?.video_duration);

  return (
    <div className="relative bg-black w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain bg-black"
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
      />

      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm z-10 pointer-events-none gap-3">
          <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optimizing stream...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 p-6 text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
             <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <p className="text-red-400 text-sm font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors">
            Retry Player
          </button>
        </div>
      )}

      {!error && (
        <div className="absolute top-4 left-4 bg-gray-900/60 backdrop-blur-md rounded-lg px-3 py-1.5 text-[11px] text-gray-300 font-bold border border-white/5 z-10 pointer-events-none flex items-center gap-2">
          <span className="text-violet-400 shrink-0">●</span>
          <span className="truncate max-w-[200px] md:max-w-md">{title}</span>
          {duration && <span className="text-gray-500 border-l border-gray-700 pl-2 ml-1">{duration}</span>}
        </div>
      )}
    </div>
  );
}

