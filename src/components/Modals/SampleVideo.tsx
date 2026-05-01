import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { CourseDetail, SampleVideo as SampleVideoType } from '../../store/slices/courseDetailSlice';

interface SampleVideoProps {
    courseDetail: CourseDetail | null;
}

const SampleVideo = ({ courseDetail }: SampleVideoProps) => {
    const videos = courseDetail?.sample_videos ?? [];
    const [activeVideo, setActiveVideo] = useState<SampleVideoType | null>(
        videos.length > 0 ? videos[0] : null
    );
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleSelectVideo = (video: SampleVideoType) => {
        setActiveVideo(video);
        // Give React time to update the src then play
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {/* autoplay may be blocked */});
            }
        }, 50);
    };

    return (
        <div className="bg-[#1a1d2e] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-5 pb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Course Preview
                </p>
                <h2 className="text-lg font-bold text-white leading-snug line-clamp-2">
                    {courseDetail?.name ?? 'Course Preview'}
                </h2>
            </div>

            {/* Video Player */}
            <div className="relative w-full bg-black">
                {activeVideo ? (
                    <video
                        ref={videoRef}
                        key={activeVideo.id}
                        src={activeVideo.videos}
                        poster={activeVideo.thumbnail ?? courseDetail?.image ?? undefined}
                        controls
                        className="w-full max-h-[340px] object-contain"
                        style={{ display: 'block' }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                        No video available
                    </div>
                )}
            </div>

            {/* Free Sample Videos List */}
            {videos.length > 0 && (
                <div className="px-6 py-4">
                    <p className="text-sm font-bold text-white mb-3">
                        Free Sample Videos:
                    </p>
                    <ul className="divide-y divide-white/10">
                        {videos.map((video, idx) => {
                            const isActive = activeVideo?.id === video.id;
                            const durationSec = Number(video.duration);
                            const mins = Math.floor(durationSec / 60);
                            const secs = durationSec % 60;
                            const durationLabel = !isNaN(durationSec) && durationSec > 0
                                ? `${mins}:${String(secs).padStart(2, '0')}`
                                : video.duration ?? '';

                            return (
                                <li key={video.id}>
                                    <button
                                        onClick={() => handleSelectVideo(video)}
                                        className={`w-full flex items-center gap-3 py-3 text-left transition-colors rounded-lg px-2 group
                                            ${isActive
                                                ? 'bg-white/10'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0 bg-gray-800">
                                            {video.thumbnail ? (
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-900">
                                                    <Play className="w-5 h-5 text-white fill-white" />
                                                </div>
                                            )}
                                            {/* Play overlay */}
                                            <div className={`absolute inset-0 flex items-center justify-center bg-black/30
                                                ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                                transition-opacity duration-200`}>
                                                <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
                                                    <Play className="w-3.5 h-3.5 text-gray-800 fill-gray-800 ml-0.5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title & duration */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium leading-snug line-clamp-2
                                                ${isActive ? 'text-indigo-300' : 'text-gray-200 group-hover:text-white'}`}>
                                                {video.name}
                                            </p>
                                        </div>

                                        {/* Duration badge */}
                                        {durationLabel && (
                                            <span className="text-xs text-gray-400 shrink-0 font-mono ml-1">
                                                {durationLabel}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SampleVideo;