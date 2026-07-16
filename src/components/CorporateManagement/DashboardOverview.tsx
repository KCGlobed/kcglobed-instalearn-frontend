import React, { useEffect } from 'react'
import { Users, Clock, GraduationCap, BookOpen, ChevronRight, TrendingUp, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchCorporateDashboardCounters } from '../../store/slices/corporateDashboardSlice'

const DashboardOverview = () => {
    const dispatch = useAppDispatch();
    const { counters, loading } = useAppSelector((state) => state.corporateDashboard);

    useEffect(() => {
        dispatch(fetchCorporateDashboardCounters());
    }, [dispatch]);

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

    // Mock Weekly Activity (representing learning hours)
    const weeklyActivity = [
        { day: 'Mon', hours: 45 },
        { day: 'Tue', hours: 60 },
        { day: 'Wed', hours: 85 },
        { day: 'Thu', hours: 55 },
        { day: 'Fri', hours: 70 },
        { day: 'Sat', hours: 30 },
        { day: 'Sun', hours: 15 },
    ]

    // Mock Department Breakdown
    const departments = [
        { name: 'Finance & Accounts', learners: 8, progress: 78, color: 'bg-perple' },
        { name: 'Human Resources', learners: 4, progress: 62, color: 'bg-cyan-500' },
        { name: 'Marketing & Sales', learners: 5, progress: 48, color: 'bg-amber-500' },
        { name: 'Operations', learners: 1, progress: 30, color: 'bg-emerald-500' },
    ]

    // Mock Activities Feed
    const recentActivities = [
        { id: 1, text: 'Amit Sharma completed "Corporate Financial Basics"', time: '2 hours ago', type: 'completion' },
        { id: 2, text: 'Admin invited Vikram Singh to the platform', time: '5 hours ago', type: 'invite' },
        { id: 3, text: 'Neha Gupta reached 90% progress in "Advanced Tax Law"', time: 'Yesterday', type: 'progress' },
        { id: 4, text: 'A new course "GST Implementation Guide" was assigned', time: '2 days ago', type: 'course' },
    ]

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Weekly Learning Hours Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">Weekly Learning Hours</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Hours logged by team members daily.</p>
                    </div>

                    <div className="mt-6 flex items-end justify-between h-40 px-2 border-b border-gray-100 pb-2">
                        {weeklyActivity.map((d, index) => {
                            const pct = (d.hours / 100) * 100; // max reference 100 hours
                            return (
                                <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer w-10">
                                    <span className="text-[9px] font-bold text-perple opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {d.hours}h
                                    </span>
                                    <div className="w-6 bg-perple/10 rounded-t-md relative h-32 overflow-hidden flex items-end">
                                        <div
                                            className="w-full bg-perple hover:bg-[#5e50eb] rounded-t-md transition-all duration-500 ease-out"
                                            style={{ height: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold">{d.day}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Departments */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">Department Progress</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Performance index per department.</p>
                    </div>

                    <div className="mt-5 space-y-4">
                        {departments.map((dept, index) => (
                            <div key={index} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-[10px] font-semibold text-gray-700">
                                    <span>{dept.name}</span>
                                    <span className="text-gray-500">{dept.learners} Active • {dept.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${dept.color}`}
                                        style={{ width: `${dept.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
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
                    {recentActivities.map((act) => (
                        <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${act.type === 'completion' ? 'bg-emerald-500' :
                                    act.type === 'invite' ? 'bg-perple' :
                                        act.type === 'progress' ? 'bg-cyan-500' : 'bg-amber-500'
                                    }`} />
                                <p className="text-xs text-gray-700 font-medium truncate">{act.text}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0 font-medium">{act.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
