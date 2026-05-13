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
                  setError("Error loading video stream.");
                  setLoading(false);
                }
              });
            } else {
              setError("HLS is not supported in this browser.");
              setLoading(false);
            }
          } catch {
            setError("Failed to load HLS player.");
            setLoading(false);
          }
        }
      } else {
        // MP4 or other native format
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
    <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain bg-black"
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
      />

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 pointer-events-none">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <p className="text-red-400 text-sm text-center px-4">{error}</p>
        </div>
      )}

      {!error && (
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2.5 py-1 text-xs text-gray-300 font-medium z-10 pointer-events-none">
          {title}{duration ? ` · ${duration}` : ""}
        </div>
      )}
    </div>
  );
}
