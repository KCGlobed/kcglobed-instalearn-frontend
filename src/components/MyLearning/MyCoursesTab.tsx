import React, { useState, useRef, useEffect } from 'react';
import {
    PlayCircle,
    MoreVertical,
    Share2,
    ListPlus,
    Heart,
    Archive,
    Play,
    Plus,
    Star,
    Folder
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchMyCoursesAction } from '../../store/slices/myLearningSlice';
import type { RootState } from '../../store/store';

import CourseActionMenu from './CourseActionMenu';
import SkeltonLoader from '../Loader/SkeltonLoader';
import { useModal } from '../Modals/ModalContext';
import ListForm from '../Forms/ListForm';

// ─── MAIN TAB COMPONENT ──────────────────────────────────────────────────────

const MyCoursesTab = () => {
    const dispatch = useAppDispatch();
    const { enrolledCourses, loading, error } = useAppSelector((state: RootState) => state.myLearning);
    const { showModal, hideModal } = useModal();

    const handleCreateList = (id: any) => {
        console.log("====================== id is here ", id)
        showModal({
            content: <ListForm courseId={id} />,
            size: "md",
            // type: "custom",
        })
    }

    useEffect(() => {
        dispatch(fetchMyCoursesAction());
    }, [dispatch]);

    let actions = [
        { icon: Share2, label: 'Share', onClick: () => { } },
        { icon: Plus, label: 'Create New List', onClick: handleCreateList },
    ]

    if (loading && enrolledCourses.length === 0) {
        return (
            <SkeltonLoader loaderType='course' />
        );
    }
    if (!enrolledCourses || enrolledCourses.length === 0) {
        return (
            <div className="text-center py-24 border-2 border-dashed border-[#E9EAF0] rounded-[4px] bg-gray-50/30">
                <div className="w-20 h-20 bg-white rounded-[4px] shadow-sm border border-[#F1F2F4] flex items-center justify-center mx-auto mb-6">
                    <PlayCircle className="w-10 h-10 text-[#5624D0] opacity-20" />
                </div>
                <h3 className="text-xl font-black text-[#1D2026] mb-2 tracking-tight">No active enrollments</h3>
                <p className="text-[#6E7485] text-sm mb-8 max-w-xs mx-auto">It looks like you haven't started any learning paths yet. Let's find something inspiring!</p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1D2026] text-white font-bold rounded-[4px] hover:bg-[#5624D0] transition-all shadow-lg hover:shadow-[#5624D0]/20"
                >
                    Explore Courses
                </Link>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {enrolledCourses.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    type="enrolled"
                // menuContent={<CourseActionMenu isOpen={true} onClose={() => { }} actions={[]} courseId={course.id} />}
                />
            ))}
        </div>
    );
};

export default MyCoursesTab;
