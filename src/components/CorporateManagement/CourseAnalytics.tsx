import React, { useState } from 'react'
import { BookOpen, Users, GraduationCap, PlusCircle, Search, Award } from 'lucide-react'
import toast from 'react-hot-toast'

interface CourseProgress {
    id: number;
    title: string;
    description: string;
    enrolledCount: number;
    avgProgress: number;
    certificatesCount: number;
    category: string;
}

const CourseAnalytics = () => {
    // Local state to make additions work live!
    const [courses, setCourses] = useState<CourseProgress[]>([
        { id: 1, title: 'Corporate Financial Basics', description: 'Fundamental concepts of bookkeeping, balance sheets, and cash flow analysis.', enrolledCount: 14, avgProgress: 82, certificatesCount: 6, category: 'Finance' },
        { id: 2, title: 'Advanced Corporate Tax Law', description: 'Deep dive into corporate tax slabs, exemptions, filings, and audit processes.', enrolledCount: 10, avgProgress: 64, certificatesCount: 2, category: 'Tax' },
        { id: 3, title: 'GST Implementation Guide', description: 'Comprehensive walkthrough of Goods and Services Tax compliance and filings.', enrolledCount: 18, avgProgress: 42, certificatesCount: 0, category: 'Tax' },
        { id: 4, title: 'Management Accounting Principles', description: 'Decision-making models, budgeting, variance calculations, and cost control.', enrolledCount: 8, avgProgress: 70, certificatesCount: 3, category: 'Finance' },
        { id: 5, title: 'Auditing & Corporate Governance', description: 'Standards of internal controls, forensic accounting, and compliance guidelines.', enrolledCount: 5, avgProgress: 25, certificatesCount: 0, category: 'Compliance' },
    ]);


    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Assign Modal state
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignForm, setAssignForm] = useState({
        courseTitle: 'Corporate Financial Basics',
        targetDept: 'All Employees'
    });

    const categories = ['All', 'Finance', 'Tax', 'Compliance'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleAssignCourseSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if course already assigned (simulating updates)
        toast.success(`Course "${assignForm.courseTitle}" assigned to ${assignForm.targetDept}!`);
        setIsAssignOpen(false);

        // Optional logic: if we want to simulate adding a new course to list if it was a new catalog item
    };

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

                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`h-9 px-4 text-xs font-semibold rounded-md border transition-all cursor-pointer ${categoryFilter === cat
                                    ? 'bg-perple/10 border-perple text-perple'
                                    : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Catalog list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-150 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                            <div>
                                {/* Card Tag */}
                                <span className="inline-block text-[9px] font-bold text-perple bg-perple/5 px-2.5 py-0.5 rounded uppercase tracking-wider mb-3">
                                    {course.category}
                                </span>

                                <h3 className="text-xs font-bold text-[#2F2B3D] leading-snug">{course.title}</h3>
                                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{course.description}</p>
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col gap-4">
                                {/* Analytics Metrics */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Enrolled</span>
                                        <span className="text-xs font-bold text-[#2F2B3D] mt-0.5 flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-gray-400" />
                                            {course.enrolledCount} team
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Avg Progress</span>
                                        <span className="text-xs font-bold text-perple mt-0.5 flex items-center gap-1.5">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            {course.avgProgress}%
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Certificates</span>
                                        <span className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                                            <Award className="w-3.5 h-3.5" />
                                            {course.certificatesCount} issued
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Visual */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                                        <span>Average Program Completion</span>
                                        <span className="text-[#2F2B3D]">{course.avgProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-perple rounded-full"
                                            style={{ width: `${course.avgProgress}%` }}
                                        />
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
                                    <option value="Corporate Financial Basics">Corporate Financial Basics</option>
                                    <option value="Advanced Corporate Tax Law">Advanced Corporate Tax Law</option>
                                    <option value="GST Implementation Guide">GST Implementation Guide</option>
                                    <option value="Management Accounting Principles">Management Accounting Principles</option>
                                    <option value="Auditing & Corporate Governance">Auditing & Corporate Governance</option>
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
                                    className="px-5 h-9 bg-perple hover:bg-[#5e50eb] text-white text-xs font-bold rounded-md transition-all cursor-pointer"
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
