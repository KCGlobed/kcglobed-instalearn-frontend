import React, { useState, useEffect } from 'react'
import { BookOpen, Users, GraduationCap, PlusCircle, Search, Award, Star, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchCorporateAssignedCourses } from '../../store/slices/corporateAssignedCoursesSlice'

const stripHtml = (html: string) => {
    if (!html) return '';
    let text = html.replace(/<[^>]*>/g, '');
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    return text.trim();
};

const CourseAnalytics = () => {
    const dispatch = useAppDispatch();
    const { data: courses, loading } = useAppSelector((state) => state.corporateAssignedCourses);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Assign Modal state
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignForm, setAssignForm] = useState({
        courseTitle: '',
        targetDept: 'All Employees'
    });

    useEffect(() => {
        dispatch(fetchCorporateAssignedCourses());
    }, [dispatch]);

    useEffect(() => {
        if (courses.length > 0 && !assignForm.courseTitle) {
            setAssignForm(prev => ({ ...prev, courseTitle: courses[0].name }));
        }
    }, [courses]);

    // Parse unique categories from the courses data dynamically
    const categories = ['All', ...new Set(courses.flatMap(course => course.categories?.map(c => c.category_info?.name) || []).filter(Boolean))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.short_description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || 
            (course.categories && course.categories.some(c => c.category_info?.name === categoryFilter));
        return matchesSearch && matchesCategory;
    });

    const handleAssignCourseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Course "${assignForm.courseTitle}" assigned to ${assignForm.targetDept}!`);
        setIsAssignOpen(false);
    };

    if (loading && courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-gray-150 rounded-xl shadow-sm">
                <Loader2 className="w-8 h-8 text-perple animate-spin" />
                <span className="text-[11px] text-gray-400 font-medium">Loading assigned courses...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-[#2F2B3D]">Assigned Courses</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Track learning progress, completion rates, and certifications across assigned courses.</p>
                </div>
                <button
                    onClick={() => setIsAssignOpen(true)}
                    className="sm:self-end h-9 px-4 bg-perple hover:bg-[#5e50eb] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
                >
                    <PlusCircle className="w-4 h-4" />
                    Assign Course
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by course title or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 border border-gray-250 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-perple focus:ring-1 focus:ring-perple transition-all"
                    />
                </div>

                <div className="w-full sm:w-48 shrink-0">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full h-9 px-3 border border-gray-250 bg-white rounded-md text-xs text-[#2F2B3D]/80 focus:outline-none focus:border-perple focus:ring-1 focus:ring-perple cursor-pointer"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Courses Catalog list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course.id} className="group bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                            {course.image && (
                                <div className="w-full h-40 shrink-0 relative overflow-hidden bg-gray-100 border-b border-gray-100">
                                    <img 
                                        src={course.image} 
                                        alt={course.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            
                            <div className="p-5 flex flex-col justify-between flex-1">
                                <div>
                                    {/* Card Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                        {course.categories && course.categories.map((cat) => (
                                            <span 
                                                key={cat.id} 
                                                className="text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider"
                                                style={{ 
                                                    backgroundColor: cat.category_info?.bg_code || 'rgba(94, 80, 235, 0.05)', 
                                                    color: cat.category_info?.text_code || '#5e50eb' 
                                                }}
                                            >
                                                {cat.category_info?.name}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-xs font-bold text-[#2F2B3D] leading-snug group-hover:text-perple transition-colors">{course.name}</h3>
                                    
                                    {/* Star Rating */}
                                    {course.avg_rating !== undefined && (
                                        <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-gray-500">
                                            <div className="flex items-center text-amber-500">
                                                <Star className="w-3 h-3 fill-current" />
                                            </div>
                                            <span className="text-[#2F2B3D]">{course.avg_rating.toFixed(1)}</span>
                                            <span>({course.total_reviews} {course.total_reviews === 1 ? 'review' : 'reviews'})</span>
                                        </div>
                                    )}

                                    <p 
                                        className="text-[10px] text-gray-500 mt-2 leading-relaxed"
                                        style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                    >
                                        {stripHtml(course.short_description)}
                                    </p>
                                </div>

                                <div className="mt-5 border-t border-gray-100 pt-4 flex flex-col gap-4">
                                    {/* Analytics Metrics */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Enrolled</span>
                                            <span className="text-xs font-bold text-[#2F2B3D] mt-0.5 flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                                {course.enrolled_students} team
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Avg Progress</span>
                                            <span className="text-xs font-bold text-perple mt-0.5 flex items-center gap-1.5">
                                                <GraduationCap className="w-3.5 h-3.5" />
                                                {course.avg_progress}%
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Certificates</span>
                                            <span className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5" />
                                                {course.certificates} issued
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Visual */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                                            <span>Average Program Completion</span>
                                            <span className="text-[#2F2B3D]">{course.avg_progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-perple rounded-full"
                                                style={{ width: `${course.avg_progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 bg-white rounded-xl border border-gray-150 p-8 text-center text-gray-400 text-xs">
                        No assigned courses found matching filters.
                    </div>
                )}
            </div>

            {/* Assign Course Modal */}
            {isAssignOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsAssignOpen(false)}
                            className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                        >
                            ✕
                        </button>

                        <div className="mb-5 pr-8">
                            <h3 className="text-sm font-bold text-[#2F2B3D] tracking-tight">Assign Course to Team</h3>
                            <p className="text-[11px] text-gray-500 mt-1">This will enroll selected departments or employees in the course.</p>
                        </div>

                        <form onSubmit={handleAssignCourseSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Select Course</label>
                                <select
                                    value={assignForm.courseTitle}
                                    onChange={(e) => setAssignForm({ ...assignForm, courseTitle: e.target.value })}
                                    className="h-10 px-3 border border-gray-250 bg-white rounded-md text-xs text-[#2F2B3D]/80 focus:outline-none focus:border-perple cursor-pointer"
                                >
                                    {courses.length > 0 ? (
                                        courses.map((course) => (
                                            <option key={course.id} value={course.name}>{course.name}</option>
                                        ))
                                    ) : (
                                        <option value="">No courses available</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Target Team / Department</label>
                                <select
                                    value={assignForm.targetDept}
                                    onChange={(e) => setAssignForm({ ...assignForm, targetDept: e.target.value })}
                                    className="h-10 px-3 border border-gray-250 bg-white rounded-md text-xs text-[#2F2B3D]/80 focus:outline-none focus:border-perple cursor-pointer"
                                >
                                    <option value="All Employees">All Employees (Entire Team)</option>
                                    <option value="Finance & Accounts Department">Finance & Accounts</option>
                                    <option value="Human Resources Department">Human Resources</option>
                                    <option value="Marketing & Sales Department">Marketing & Sales</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignOpen(false)}
                                    className="px-4 h-9 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={courses.length === 0}
                                    className="px-5 h-9 bg-perple hover:bg-[#5e50eb] text-white text-xs font-bold rounded-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Assign Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseAnalytics
