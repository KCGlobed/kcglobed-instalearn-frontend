import React, { useCallback } from 'react';
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
    Copy,
    Facebook,
    Twitter,
    Mail,
    Phone
} from 'lucide-react';

import type { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks/useRedux';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';


const CourseSidebar = () => {
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    const dispatch = useAppDispatch();
    // Safely compute prices — price and discount default to 0 while courseDetail is null
    const price = courseDetail?.price ?? 0;
    const discountPct = courseDetail?.discount ?? 0;
    const discountedPrice = price - (price * discountPct) / 100;


    const handleCopyUrl = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
    }, [])



    const addCourseToCart = () => {
        if (!courseDetail?.id) return;

        const data = {
            course_id: courseDetail.id,
            is_add: true
        }
        console.log("data", data);

    }



    return (
        <div className="bg-white border rounded-2xl shadow-xl overflow-hidden sticky top-8 max-w-sm ml-auto">
            {/* Price Section */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                        {loading ? '—' : `₹${discountedPrice.toFixed(2)}`}
                    </span>
                    {price > 0 && (
                        <span className="text-lg text-gray-400 line-through">₹{price.toFixed(2)}</span>
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

                {/* Course Details List */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span>Course Duration</span>
                        </div>
                        <span className="font-semibold text-gray-800">{courseDetail?.duration ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <BarChart className="w-5 h-5" />
                            <span>Course Level</span>
                        </div>
                        <span className="font-semibold text-gray-800">Beginner and Intermediate</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Users className="w-5 h-5" />
                            <span>Students Enrolled</span>
                        </div>
                        <span className="font-semibold text-gray-800">69,419,618</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Globe className="w-5 h-5" />
                            <span>Language</span>
                        </div>
                        <span className="font-semibold text-gray-800">Mandarin</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Subtitles className="w-5 h-5" />
                            <span>Subtitle Language</span>
                        </div>
                        <span className="font-semibold text-gray-800">English</span>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid gap-3 mb-6">
                    <button onClick={() => addCourseToCart()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]">
                        Add To Cart
                    </button>
                    <button className="w-full border-2 border-indigo-600 text-indigo-600 font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all active:scale-[0.98]">
                        Buy Now
                    </button>
                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold">
                            <Heart className="w-4 h-4" /> Add To Wishlist
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold">
                            <Gift className="w-4 h-4" /> Gift Course
                        </button>
                    </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center mb-8 uppercase tracking-wider font-bold">
                    Note: all course have 30-days money-back guarantee
                </p>

                {/* Course Includes Section */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4 px-1">This course includes:</h3>
                    <div className="space-y-4">
                        {[
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
                        ))}
                    </div>
                </div>

                {/* Share Section */}
                <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-900 mb-4 px-1">Share this course:</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleCopyUrl()} className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-all text-gray-600">
                            <Copy className="w-4 h-4" /> Copy link
                        </button>
                        {[Facebook, Twitter, Mail, Phone].map((Icon, idx) => (
                            <button key={idx} className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all">
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;
