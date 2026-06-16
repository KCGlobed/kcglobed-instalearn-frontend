import React from 'react';
import { Play } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { useModal } from '../Modals/ModalContext';
import SampleVideo from '../Modals/SampleVideo';

const CoursePreview = () => {
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    const { showModal, hideModal } = useModal();

    const handlePlayVideo = () => {
        showModal({
            content: <SampleVideo courseDetail={courseDetail} />,
            size: "lg",
            type: "custom",
        })
    }
    return (
        <div onClick={handlePlayVideo} className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 group cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
            {/* Main Preview Image */}
            <img
                src={courseDetail?.image || "/instalogo.png"}
                alt="Course Preview"
                className="w-full h-full object-cover"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors duration-300">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-5 h-5 text-indigo-600 fill-indigo-600 ml-0.5" />
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;
