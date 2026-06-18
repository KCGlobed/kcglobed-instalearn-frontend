import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Clock,
    BarChart,
    Users,
    Globe,
    Subtitles,
    Heart,
    Gift,
    CheckCircle2,
    Infinity,
    Smartphone,
    FileText,
    Award,
    PlayCircle
} from 'lucide-react';


import type { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks/useRedux';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addToCartAction, viewCartDetails } from '../../store/slices/courseCartSlice';
import SkeltonLoader from '../Loader/SkeltonLoader';
import { useNavigate } from 'react-router-dom';
import SocialShare from '../UI/SocialShare';
import { toggleWishlistAction } from '../../store/slices/courseWishList';
import { toggleCourseWishlistStatus } from '../../store/slices/courseDetailSlice';
import { getCourseCertificate } from '../../utils/service';

const CourseSidebar = () => {
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    const { cartItems, loading: cartLoading, error: cartError } = useAppSelector((state: RootState) => state.cart);
    const { wishListItems, loading: wishlistLoading } = useAppSelector((state: RootState) => state.wishList);
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    const { enrolledCourses } = useAppSelector((state: RootState) => state.myLearning);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const purchasedCourse = useMemo(() => {
        if (!isAuthenticated || !courseDetail?.id || !enrolledCourses?.length) return null;
        return enrolledCourses.find((course: any) => course.id === courseDetail.id);
    }, [isAuthenticated, courseDetail?.id, enrolledCourses]);

    const [downloadingCert, setDownloadingCert] = useState(false);

    const getGcsDownloadUrl = (url: string) => {
        if (url.includes("storage.googleapis.com")) {
            try {
                const parts = url.split("storage.googleapis.com/");
                if (parts.length > 1) {
                    const subParts = parts[1].split("/");
                    const bucket = subParts[0];
                    const objectPath = subParts.slice(1).join("/");
                    return `https://storage.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`;
                }
            } catch (e) {
                console.error("Error formatting GCS download URL", e);
            }
        }
        return url;
    };

    const handleDownloadCertificate = async () => {
        if (downloadingCert || !courseDetail?.id) return;
        setDownloadingCert(true);
        const loadToast = toast.loading("Downloading certificate...");
        try {
            const response = await getCourseCertificate(courseDetail.id);
            const certificateUrl = response?.data;

            if (!certificateUrl) {
                throw new Error("Certificate URL not found");
            }

            const apiDownloadUrl = getGcsDownloadUrl(certificateUrl);
            const fileResponse = await fetch(apiDownloadUrl);
            const blob = await fileResponse.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const extension = certificateUrl.split("?")[0].split(".").pop() || "svg";
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `Certificate_${courseDetail.name.replace(/\s+/g, "_")}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            toast.success("Downloaded successfully!", { id: loadToast });
        } catch (error: any) {
            console.error("Failed to download directly:", error);
            toast.error("Direct download failed. Opening in a new tab.", { id: loadToast });
            try {
                const response = await getCourseCertificate(courseDetail.id);
                if (response?.data) {
                    window.open(response.data, "_blank");
                }
            } catch (e) {
                console.error("Fallback failed:", e);
            }
        } finally {
            setDownloadingCert(false);
        }
    };

    const handleStartOrContinue = () => {
        if (!purchasedCourse) return;
        if (!purchasedCourse.course_started) {
            navigate(`/my-commitment`, {
                state: {
                    course: purchasedCourse,
                }
            });
        } else {
            navigate(`/learning/dashboard/${purchasedCourse.id}`);
        }
    };

    const lastWatched = useMemo(() => {
        if (!courseDetail || !purchasedCourse) return null;
        const courseId = courseDetail.id;
        const lastChapterIdStr = localStorage.getItem(`course_last_chapter_${courseId}`);
        const lastLectureIdStr = localStorage.getItem(`course_last_lecture_${courseId}`);
        
        const chapters = courseDetail.chapters ?? (courseDetail as any).course_chapters ?? [];
        
        if (lastLectureIdStr) {
            const lastLectureId = Number(lastLectureIdStr);
            for (const chapter of chapters) {
                const lectures = chapter.chapter_lectures || [];
                const foundLecture = lectures.find((l: any) => l.id === lastLectureId);
                if (foundLecture) {
                    const isVideo = foundLecture.video_info && Object.keys(foundLecture.video_info).length > 0;
                    const isEbook = foundLecture.ebook_info && Object.keys(foundLecture.ebook_info).length > 0;
                    const lectureName = isVideo ? foundLecture.video_info.name : (isEbook ? foundLecture.ebook_info.name : "Lecture");
                    const chapterName = chapter.chapter_info?.name || "Section";
                    return { lectureName, chapterName };
                }
            }
        }
        
        // Fallback to first lecture of first chapter if none in localStorage
        if (chapters.length > 0) {
            const firstChapter = chapters[0];
            const lectures = firstChapter.chapter_lectures || [];
            if (lectures.length > 0) {
                const firstLecture = lectures[0];
                const isVideo = firstLecture.video_info && Object.keys(firstLecture.video_info).length > 0;
                const isEbook = firstLecture.ebook_info && Object.keys(firstLecture.ebook_info).length > 0;
                const lectureName = isVideo ? firstLecture.video_info.name : (isEbook ? firstLecture.ebook_info.name : "Lecture");
                const chapterName = firstChapter.chapter_info?.name || "Section";
                return { lectureName, chapterName };
            }
        }
        
        return null;
    }, [courseDetail, purchasedCourse]);
    // Safely compute prices — price and discount default to 0 while courseDetail is null
    const price = courseDetail?.price ?? 0;
    const discountPct = courseDetail?.discount ?? 0;
    const discountedPrice = price - (price * discountPct) / 100;


    const addCourseToCart = () => {
        if (!courseDetail?.id) return;
        const data = {
            course_id: courseDetail.id,
        }
        dispatch(addToCartAction(data));

    }


    const isCart = useMemo(() => {
        if (!courseDetail?.id || !cartItems?.length) return false;
        return cartItems.some((item: any) => item?.course_info?.id === courseDetail.id);
    }, [cartItems, courseDetail?.id]);

    const isWishlist = useMemo(() => {
        if (!courseDetail?.id || !wishListItems?.length) return false;
        return wishListItems.some((item: any) => item?.course_info?.id === courseDetail.id);
    }, [wishListItems, courseDetail?.id]);


    const handleWishList = async () => {
        try {
            if (!courseDetail?.id) return;
            const data = {
                course_id: courseDetail.id,
            }
            await dispatch(toggleWishlistAction(data)).unwrap();
            dispatch(toggleCourseWishlistStatus());
        } catch (error) {
            toast.error(error as string);
        }
    }


    const formatDuration = (seconds: string | number | null | undefined) => {
        if (!seconds) return "0h 0m";

        const secNum = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
        if (!secNum || isNaN(secNum)) return "0h 0m";

        const hours = Math.floor(secNum / 3600);
        const minutes = Math.floor((secNum % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };





    const gotoCart = () => {
        navigate('/cart');
    }


    if (loading) {
        return <SkeltonLoader loaderType="course_detail_sidebar" />
    }

    return (
        <div className="bg-white border rounded-2xl shadow-xl overflow-hidden sticky top-8 max-w-sm ml-auto">
            {/* Price Section */}
            <div className="p-6">
                {purchasedCourse ? (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Status</p>
                            <p className="text-sm font-extrabold text-green-900">Purchased & Enrolled</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-bold text-gray-900">
                                {loading ? '—' : `₹${courseDetail?.price?.toFixed(2)}`}
                            </span>
                            {price > 0 && (
                                <span className="text-lg text-gray-400 line-through">₹{courseDetail?.original_price?.toFixed(2)}</span>
                            )}
                            {discountPct > 0 && (
                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded ml-auto">
                                    {discountPct}% OFF
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold mb-6">
                            <Clock className="w-4 h-4" />
                            <span>2 days left at this price!</span>
                        </div>
                    </>
                )}

                {/* Course Details List */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span>Course Duration</span>
                        </div>
                        <span className="font-semibold text-gray-800">{formatDuration(courseDetail?.total_video_duration)} </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <BarChart className="w-5 h-5" />
                            <span>Course Level</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                            {courseDetail?.level === 1 ? 'Beginner' :
                                courseDetail?.level === 2 ? 'Intermediate' :
                                    courseDetail?.level === 3 ? 'Advanced' : 'All Levels'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Users className="w-5 h-5" />
                            <span>Students Enrolled</span>
                        </div>
                        <span className="font-semibold text-gray-800">{courseDetail?.enrolled_students || "Not Available"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Globe className="w-5 h-5" />
                            <span>Language</span>
                        </div>
                        <span className="font-semibold text-gray-800">{courseDetail?.language || 'English'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Subtitles className="w-5 h-5" />
                            <span>Subtitle Language</span>
                        </div>
                        <span className="font-semibold text-gray-800">{courseDetail?.subtitle_language || 'Not Available'}</span>
                    </div>
                </div>

                {/* Progress & Last Watched Section for Purchased Courses */}
                {purchasedCourse && (
                    <div className="space-y-4 mb-6 animate-fade-in">
                        {/* Progress */}
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Progress</span>
                                <span className="text-sm font-extrabold text-indigo-600">{purchasedCourse.progress || 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${purchasedCourse.progress || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Last Watched */}
                        {lastWatched && (
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Watched Lesson</p>
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 text-indigo-600 shrink-0">
                                        <PlayCircle className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate leading-snug">{lastWatched.lectureName}</p>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{lastWatched.chapterName}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Primary Action Buttons */}
                <div className="grid gap-3 mb-6">
                    {purchasedCourse ? (
                        <>
                            <button
                                onClick={handleStartOrContinue}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                {purchasedCourse.progress > 0 ? "Continue Learning" : "Start Learning"}
                            </button>
                            
                            {purchasedCourse.progress >= 50 && (
                                <button
                                    onClick={handleDownloadCertificate}
                                    disabled={downloadingCert}
                                    className="w-full border-2 border-indigo-600 text-indigo-600 font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-gray-100"
                                >
                                    <Award className="w-5 h-5" />
                                    {downloadingCert ? "Downloading Certificate..." : "Download Certificate"}
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {
                                !isCart ?

                                    <button onClick={() => addCourseToCart()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]">
                                        {cartLoading ?
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Adding to cart...</span>
                                            </div>

                                            : "Add To Cart"}
                                    </button>
                                    :
                                    <button onClick={() => gotoCart()} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]">
                                        Go To Cart
                                    </button>
                            }
                            {isAuthenticated && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleWishList()} disabled={wishlistLoading} className={`flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold ${isWishlist ? 'text-rose-600' : 'text-gray-700'}`}>
                                        {wishlistLoading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                        ) : (
                                            <Heart className={`w-4 h-4 ${isWishlist ? 'fill-current' : ''}`} />
                                        )}
                                        {isWishlist ? 'Wishlisted' : 'Add To Wishlist'}
                                    </button>
                                    <button disabled={true} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold">
                                        <Gift className="w-4 h-4" /> Gift Course
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <p className="text-[10px] text-gray-400 text-center mb-8 uppercase tracking-wider font-bold">
                    Note: all course have 30-days money-back guarantee
                </p>

                {/* Course Includes Section */}
                {
                    courseDetail?.course_includes && courseDetail?.course_includes.length > 0 &&
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-4 px-1">This course includes:</h3>
                        <div className="space-y-4">
                            {/* {[
                            { icon: Infinity, text: "Lifetime access", color: "text-orange-500" },
                            { icon: CheckCircle2, text: "30-days money-back guarantee", color: "text-orange-500" },
                            { icon: FileText, text: "Free exercises file & downloadable resources", color: "text-orange-500" },
                            { icon: Award, text: "Shareable certificate of completion", color: "text-orange-500" },
                            { icon: Smartphone, text: "Access on mobile, tablet and TV", color: "text-orange-500" },
                            { icon: Subtitles, text: "English subtitles", color: "text-orange-500" },
                            { icon: Globe, text: "100% online course", color: "text-orange-500" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 px-1">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <span>{item.text}</span>
                            </div>
                        ))} */}

                            {
                                courseDetail?.course_includes?.map((item: any, idx: number) => (
                                    <div key={item?.id || idx} className="flex items-center gap-3 text-sm text-gray-600 px-1">
                                        <img src={item?.icon || ""} alt="" className="w-5 h-5" />
                                        <span>{item?.text}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }

                {/* Share Section */}
                <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-900 mb-4 px-1">Share this course:</h3>
                    <SocialShare
                        title={courseDetail?.name}
                        description={courseDetail?.short_description}
                        image={courseDetail?.image || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;
