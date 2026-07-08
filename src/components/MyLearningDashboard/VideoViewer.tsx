import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useWatchVideoMutation } from "../../store/api/videoApi";
import type { Lecture } from "../../store/slices/courseDashboardLectureSlice";
const BASE_VIDEO_URL = "https://storage.googleapis.com/instalearn-public-bucket/";

interface VideoViewerProps {
  activeLesson: Lecture;
  isExpanded?: boolean;
  isFullscreen?: boolean;
  onToggleExpand?: () => void;
  onToggleFullscreen?: () => void;
  onNext?: () => void;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export default function VideoViewer({
  activeLesson,
  isExpanded,
  isFullscreen,
  onNext,
}: VideoViewerProps) {
  const { slug } = useParams();
  const [watchVideo] = useWatchVideoMutation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Ref to track last synced duration to avoid redundant calls
  const lastSyncedDurationRef = useRef<number>(-1);
  const trackingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const courseId = Number(slug);

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

    const restoreProgress = () => {
      setLoading(false);
      const savedProgress = localStorage.getItem(`lecture_progress_${activeLesson.id}`);
      if (savedProgress && video) {
        const seekTo = parseFloat(savedProgress);
        if (seekTo < (activeLesson.video_info?.video_duration || 0) - 1) {
          video.currentTime = seekTo;
          lastSyncedDurationRef.current = Math.floor(seekTo);
        }
      }
    };

    const handleError = () => {
      setError("Error loading video.");
      setLoading(false);
    };

    if (videoUrl.endsWith(".m3u8")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", restoreProgress);
        video.addEventListener("error", handleError);
      } else {
        const initHls = async () => {
          try {
            // @ts-ignore
            const HlsModule = await import("hls.js");
            const Hls = HlsModule.default || HlsModule;
            if (Hls.isSupported()) {
              hls = new Hls();
              hls.loadSource(videoUrl);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, restoreProgress);
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
          } catch (err) {
            setError("Failed to load player.");
            setLoading(false);
          }
        };
        initHls();
      }
    } else {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", restoreProgress);
      video.addEventListener("error", handleError);
    }

    // ── Watch Progress Tracking ──────────────────────────────────────────────
    const syncProgress = async () => {
      const currentVideo = videoRef.current;
      if (!currentVideo || !activeLesson?.id || !courseId) return;

      const currentDuration = Math.floor(currentVideo.currentTime);
      
      // Only sync if duration has changed since last sync
      if (currentDuration !== lastSyncedDurationRef.current) {
        try {
          await watchVideo({
            course_id: courseId,
            lecture_id: activeLesson.id,
            duration: currentDuration,
          }).unwrap();
          
          lastSyncedDurationRef.current = currentDuration;
          
          // Local persistence for immediate restore on refresh
          localStorage.setItem(`lecture_progress_${activeLesson.id}`, currentDuration.toString());
        } catch (err) {
          // Silent error handling for background tracking
          console.debug("Failed to sync video progress:", err);
        }
      }
    };

    let lastSavedSecond = -1;
    const handleTimeUpdate = () => {
      if (!video || !activeLesson?.id || !courseId) return;
      const currentSecond = Math.floor(video.currentTime);
      if (currentSecond !== lastSavedSecond) {
        localStorage.setItem(`lecture_progress_${activeLesson.id}`, currentSecond.toString());
        localStorage.setItem(`course_last_lecture_${courseId}`, activeLesson.id.toString());
        localStorage.setItem(`course_last_chapter_${courseId}`, activeLesson.chapter.toString());
        lastSavedSecond = currentSecond;
      }
    };

    const startTracking = () => {
      if (!trackingIntervalRef.current) {
        // Sync every 8 seconds as per requirements (5-10s range)
        trackingIntervalRef.current = setInterval(syncProgress, 8000);
      }
    };

    const stopTracking = () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
      // Sync one final time when pausing
      syncProgress();
    };

    const handlePlayState = () => setIsPlaying(true);
    const handlePauseState = () => setIsPlaying(false);

    video.addEventListener("play", startTracking);
    video.addEventListener("pause", stopTracking);
    video.addEventListener("play", handlePlayState);
    video.addEventListener("pause", handlePauseState);
    video.addEventListener("ended", stopTracking);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }

      if (video) {
        video.removeEventListener("play", startTracking);
        video.removeEventListener("pause", stopTracking);
        video.removeEventListener("play", handlePlayState);
        video.removeEventListener("pause", handlePauseState);
        video.removeEventListener("ended", stopTracking);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", restoreProgress);
        video.removeEventListener("error", handleError);
        
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {
          console.debug("Error resetting video properties on unmount:", e);
        }
      }

      if (hls) {
        hls.destroy();
      } else if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [activeLesson, courseId, watchVideo]);

  const title = activeLesson?.video_info?.name || "Video Lecture";
  const duration = formatDuration(activeLesson?.video_info?.video_duration);

  // Sizing: fill 100% when expanded/fullscreen; 16/9 aspect ratio otherwise
  const containerStyle: React.CSSProperties =
    isFullscreen || isExpanded
      ? { width: "100%", height: "100%", minHeight: 0 }
      : { aspectRatio: "16/9", width: "100%", maxWidth: "1380px", margin: "0 auto" };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((e) => console.debug("Error playing video:", e));
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative bg-black overflow-hidden w-full h-full flex items-center justify-center" style={containerStyle}>
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain bg-black"
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onEnded={onNext}
      />

      {/* Clickable video overlay (does not block bottom native controls) */}
      {!loading && !error && (
        <div
          onClick={handleTogglePlay}
          className="absolute inset-x-0 top-0 bottom-14 z-20 flex items-center justify-center cursor-pointer group"
        >
          {isPlaying ? (
            /* Pause icon overlay on hover when playing */
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
              <Pause className="h-8 w-8 fill-white text-white" />
            </div>
          ) : (
            /* Play icon overlay when paused */
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white shadow-2xl transition-all duration-300 transform scale-100 hover:scale-110">
              <Play className="h-8 w-8 fill-white text-white ml-1" />
            </div>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm z-10 pointer-events-none gap-3">
          <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optimizing stream...</span>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 p-6 text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <p className="text-red-400 text-sm font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry Player
          </button>
        </div>
      )}

      {/* Title badge — top-left, non-interactive */}
      {!error && (
        <div className="absolute top-4 left-4 bg-gray-900/60 backdrop-blur-md rounded-lg px-3 py-1.5
                        text-[11px] text-gray-300 font-bold border border-white/5 z-10 pointer-events-none flex items-center gap-2">
          <span className="text-violet-400 shrink-0">●</span>
          <span className="truncate max-w-[200px] md:max-w-md">{title}</span>
          {duration && <span className="text-gray-500 border-l border-gray-700 pl-2 ml-1">{duration}</span>}
        </div>
      )}
    </div>
  );
}
