import React, { useEffect, useState } from 'react'
import { Users, Clock, GraduationCap, BookOpen, ChevronRight, TrendingUp, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchCorporateDashboardCounters } from '../../store/slices/corporateDashboardSlice'
import { fetchUserStudyProgress } from '../../store/slices/userStudyProgressSlice'
import { getCorporateStudentsActivityLogLatestApi, getCoursesWiseUserProgressApi } from '../../utils/service'

const DashboardOverview = () => {
    const dispatch = useAppDispatch();
    const { counters, loading } = useAppSelector((state) => state.corporateDashboard);
    const { data: progressData, loading: progressLoading, period } = useAppSelector((state) => state.userStudyProgress);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [courseProgressData, setCourseProgressData] = useState<any[]>([]);
    const [loadingCourseProgress, setLoadingCourseProgress] = useState(false);

    useEffect(() => {
        dispatch(fetchCorporateDashboardCounters());
        dispatch(fetchUserStudyProgress('daily'));
        fetchActivities();
        fetchCourseProgress();
    }, [dispatch]);

    const fetchCourseProgress = async () => {
        try {
            setLoadingCourseProgress(true);
            const response = await getCoursesWiseUserProgressApi();
            if (response.success) {
                setCourseProgressData(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching course progress", error);
        } finally {
            setLoadingCourseProgress(false);
        }
    };

    const fetchActivities = async () => {
        try {
            setLoadingActivities(true);
            const response = await getCorporateStudentsActivityLogLatestApi();
            if (response.success) {
                setRecentActivities(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching activities", error);
        } finally {
            setLoadingActivities(false);
        }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(fetchUserStudyProgress(e.target.value));
    };

    const formatLearningTime = (totalSeconds: number) => {
        if (totalSeconds >= 3600) {
            const hours = (totalSeconds / 3600).toFixed(1);
            return `${parseFloat(hours)} hrs`;
        }
        const minutes = Math.round(totalSeconds / 60);
        return `${minutes} mins`;
    };
    // Statistics from API & fallback to defaults 
    const stats = [
        {
            id: 1,
            title: 'Active Seats Used',
            value: counters ? `${counters.license_used} / ${counters.no_of_licences}` : '0 / 0',
            change: counters ? `${counters.remaning_licence} vacant seats` : '0 vacant',
            icon: Users,
            color: 'bg-perple/10 text-perple'
        },
        {
            id: 2,
            title: 'Total Learning Hours',
            value: counters ? formatLearningTime(counters.total_duration_video_watched) : '0 mins',
            change: counters ? `From ${counters.total_video_watched} videos` : '0 videos',
            icon: Clock,
            color: 'bg-emerald-100 text-emerald-700'
        },
        {
            id: 3,
            title: 'Registered Users',
            value: counters ? `${counters.registered_users}` : '0',
            change: 'Active team members',
            icon: GraduationCap,
            color: 'bg-cyan-100 text-cyan-700'
        },
        {
            id: 4,
            title: 'Active Assigned Courses',
            value: counters ? `${counters.assigned_courses} Courses` : '0 Courses',
            change: 'Enrolled in catalog',
            icon: BookOpen,
            color: 'bg-[#F8F7FA] text-amber-700'
        },
    ]

    // Calculate the maximum value to use as 100% reference
    const maxValue = progressData && progressData.length > 0
        ? Math.max(...progressData.map((d: any) => Number(d.value || d.hours || d.duration || d.progress || 0)))
        : 100;
    const chartMax = maxValue === 0 ? 100 : maxValue;

    if (loading && !counters) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-gray-150 rounded-xl shadow-sm">
                <Loader2 className="w-8 h-8 text-perple animate-spin" />
                <span className="text-[11px] text-gray-400 font-medium">Loading overview counters...</span>
            </div>
        )
    }




    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
                <h2 className="text-base font-bold text-[#2F2B3D]">Dashboard Overview</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">High-level training stats and team performance metrics.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.id} className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                                <span className="text-lg font-bold text-[#2F2B3D] mt-1">{stat.value}</span>
                                <span className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </span>
                            </div>
                            <div className={`p-2.5 rounded-lg shrink-0 ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Weekly Learning Hours Chart */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xs font-bold text-[#2F2B3D]">Learning Hours</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Hours logged by team members.</p>
                        </div>
                        <select
                            value={period}
                            onChange={handlePeriodChange}
                            className="text-[10px] bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-perple text-gray-600 cursor-pointer"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="half_yearly">Half Yearly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="mt-6 flex items-end justify-between h-40 px-2 border-b border-gray-100 pb-2 relative">
                        {progressLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                <Loader2 className="w-6 h-6 text-perple animate-spin" />
                            </div>
                        ) : null}
                        {progressData && progressData.length > 0 ? progressData.map((d: any, index: number) => {
                            const val = Number(d.value || d.hours || d.duration || d.progress || 0);
                            const rawLabel = d.label || d.day || d.name || d.date || '';
                            const label = rawLabel.length > 3 ? rawLabel.substring(0, 3) : rawLabel;
                            const videoWatched = Number(d.video_watched || d.videos || d.videos_watched || 0);
                            const pct = (val / chartMax) * 100;
                            return (
                                <div key={index} className="flex flex-col items-center justify-end group cursor-pointer flex-1 relative h-full">
                                    {/* Tooltip */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-[#2F2B3D] text-white rounded-md px-2 py-1.5 z-20 shadow-xl min-w-max">
                                        <span className="text-[10px] font-bold leading-none mb-1">{formatLearningTime(val)}</span>
                                        <span className="text-[8px] font-medium text-gray-300 leading-none">{videoWatched} videos</span>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2F2B3D] rotate-45"></div>
                                    </div>

                                    <div className="w-3.5 bg-perple/10 rounded-t-md relative h-28 overflow-hidden flex items-end mb-2 mt-auto">
                                        <div
                                            className="w-full bg-perple hover:bg-[#5e50eb] rounded-t-md transition-all duration-500 ease-out"
                                            style={{ height: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold text-center break-words max-w-full leading-tight">{label}</span>
                                </div>
                            )
                        }) : !progressLoading ? (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No data available for this period.
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Course Progress */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col h-[280px]">
                    <div className="shrink-0 mb-4">
                        <h3 className="text-xs font-bold text-[#2F2B3D]">Course Progress</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Average completion rate per course.</p>
                    </div>

                    <div className="space-y-6 overflow-y-auto theme-scrollbar pr-2 flex-1">
                        {loadingCourseProgress ? (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="w-5 h-5 text-perple animate-spin" />
                            </div>
                        ) : courseProgressData.length > 0 ? (
                            courseProgressData.map((course: any, idx: number) => {
                                const userCount = course.user_courses?.length || 0;
                                const avgCourseProgress = userCount > 0 
                                    ? Math.round(course.user_courses.reduce((acc: number, curr: any) => acc + (curr.avg_progress || 0), 0) / userCount) 
                                    : 0;

                                return (
                                    <div key={idx} className="flex flex-col gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                                        {/* Course Header */}
                                        <div className="flex justify-between items-start text-[11px] mb-1">
                                            <span className="font-bold text-[#2F2B3D] pr-2 leading-snug flex-1" title={course.name}>{course.name}</span>
                                            <span className="text-gray-500 whitespace-nowrap text-[10px] shrink-0 mt-0.5">{userCount} user{userCount !== 1 ? 's' : ''} · avg {avgCourseProgress}%</span>
                                        </div>
                                        
                                        {/* User List */}
                                        <div className="flex flex-col gap-3.5">
                                            {course.user_courses?.map((uc: any, ucIdx: number) => {
                                                const firstName = uc.user?.first_name || '';
                                                const lastName = uc.user?.last_name || '';
                                                const initials = `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'U';
                                                const fullName = `${firstName} ${lastName}`.trim() || 'User';
                                                const progress = uc.avg_progress || 0;
                                                
                                                let statusText = 'Not started';
                                                if (progress === 100) statusText = 'Completed';
                                                else if (progress > 0) statusText = 'In progress';

                                                return (
                                                    <div key={ucIdx} className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-6 h-6 rounded-full bg-perple/10 text-perple flex items-center justify-center font-bold text-[9px] shrink-0">
                                                                    {initials}
                                                                </div>
                                                                <span className="font-semibold text-[#2F2B3D] truncate" title={fullName}>{fullName}</span>
                                                            </div>
                                                            <span className="text-gray-500 shrink-0 font-medium">{statusText}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-perple rounded-full transition-all duration-500"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-[#2F2B3D] w-6 text-right shrink-0">{progress}%</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-xs text-gray-400">
                                No course progress found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">Recent Activity</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Real-time learning events inside your organization.</p>
                    </div>
                    <button className="text-[10px] font-bold text-perple hover:underline flex items-center gap-0.5 cursor-pointer">
                        View Log
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {loadingActivities ? (
                        <div className="py-8 flex justify-center">
                            <Loader2 className="w-5 h-5 text-perple animate-spin" />
                        </div>
                    ) : recentActivities.length > 0 ? (
                        recentActivities.map((act: any) => (
                            <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${act.action === 'PROGRESS' ? 'bg-cyan-500' :
                                        act.action === 'USER_LOGIN' ? 'bg-perple' :
                                            act.action === 'NOTE_CREATED' ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`} />
                                    <p className="text-xs text-gray-700 font-medium truncate" title={act.metadata}>{act.metadata}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 shrink-0 font-medium whitespace-nowrap">{act.time_ago}</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-xs text-gray-400">
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview;
