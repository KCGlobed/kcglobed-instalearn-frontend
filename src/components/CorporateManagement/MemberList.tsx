import React, { useState } from 'react'
import { Search, UserPlus, Trash2, BookOpen, Check, X, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
    activeCourses: number;
    completion: number;
    status: 'Active' | 'Pending';
}

const MemberList = () => {
    // Local state for members list so actions (like adding/deleting) work live!
    const [members, setMembers] = useState<Member[]>([
        { id: 1, name: 'Amit Sharma', email: 'amit.sharma@company.com', role: 'Member', activeCourses: 3, completion: 75, status: 'Active' },
        { id: 2, name: 'Neha Gupta', email: 'neha.gupta@company.com', role: 'Team Lead', activeCourses: 5, completion: 90, status: 'Active' },
        { id: 3, name: 'Rohan Sen', email: 'rohan.sen@company.com', role: 'Member', activeCourses: 2, completion: 40, status: 'Active' },
        { id: 4, name: 'Vikram Singh', email: 'vikram.singh@company.com', role: 'Member', activeCourses: 0, completion: 0, status: 'Pending' },
        { id: 5, name: 'Sneha Reddy', email: 'sneha.reddy@company.com', role: 'Manager', activeCourses: 4, completion: 60, status: 'Active' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Invite Modal State
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' });

    // Course Assignment Modal State
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignedCourse, setAssignedCourse] = useState('1');

    // Filtered Members
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Handle Delete
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to remove ${name} from your team?`)) {
            setMembers(members.filter(m => m.id !== id));
            toast.success(`${name} has been removed.`);
        }
    };

    // Handle Invite Submission
    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMember.name || !newMember.email) {
            toast.error('Please fill in all fields.');
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newMember.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
        const memberToAdd: Member = {
            id: newId,
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            activeCourses: 0,
            completion: 0,
            status: 'Pending'
        };

        setMembers([...members, memberToAdd]);
        setNewMember({ name: '', email: '', role: 'Member' });
        setIsInviteOpen(false);
        toast.success(`Invitation sent to ${memberToAdd.name}!`);
    };

    // Handle Course Assignment Submission
    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        setMembers(members.map(m => {
            if (m.id === selectedMember.id) {
                return {
                    ...m,
                    activeCourses: m.activeCourses + 1,
                    status: 'Active' // make active if pending
                };
            }
            return m;
        }));

        setIsAssignOpen(false);
        setSelectedMember(null);
        toast.success('Course assigned successfully!');
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-[#2F2B3D]">Team Members</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Manage licenses, assign courses, and track employee progress.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="sm:self-end h-9 px-4 bg-perple hover:bg-[#5e50eb] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 border border-gray-250 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-perple focus:ring-1 focus:ring-perple transition-all"
                    />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-9 px-3 border border-gray-250 rounded-md text-xs text-[#2F2B3D]/80 bg-white focus:outline-none focus:border-perple cursor-pointer w-full sm:w-auto"
                    >
                        <option value="All">All Roles</option>
                        <option value="Member">Member</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
            </div>

            {/* Members Table Card */}
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F7FA] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 md:px-6">Name / Email</th>
                                <th className="py-3.5 px-4">Role</th>
                                <th className="py-3.5 px-4 text-center">Active Courses</th>
                                <th className="py-3.5 px-4">Completion Progress</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                                        {/* Name / Email */}
                                        <td className="py-4 px-4 md:px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#2F2B3D]">{member.name}</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">{member.email}</span>
                                            </div>
                                        </td>
                                        
                                        {/* Role */}
                                        <td className="py-4 px-4 text-[#2F2B3D]/80">{member.role}</td>
                                        
                                        {/* Active Courses */}
                                        <td className="py-4 px-4 text-center font-medium text-[#2F2B3D]">{member.activeCourses}</td>
                                        
                                        {/* Progress Bar */}
                                        <td className="py-4 px-4 min-w-[140px]">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-perple rounded-full" 
                                                        style={{ width: `${member.completion}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">{member.completion}%</span>
                                            </div>
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                                member.status === 'Active' 
                                                    ? 'bg-emerald-50 text-emerald-600' 
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        
                                        {/* Actions */}
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMember(member);
                                                        setIsAssignOpen(true);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-perple hover:bg-perple/5 rounded transition-colors cursor-pointer"
                                                    title="Assign Course"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                                        No team members found matching search parameters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Member Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsInviteOpen(false)}
                            className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="mb-5 pr-8">
                            <h3 className="text-sm font-bold text-[#2F2B3D] tracking-tight">Invite Team Member</h3>
                            <p className="text-[11px] text-gray-500 mt-1">An invitation link will be sent to the employee email.</p>
                        </div>

                        <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Amit Sharma"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    className="h-10 px-3 border border-gray-250 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-perple transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="amit.sharma@company.com"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    className="h-10 px-3 border border-gray-250 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-perple transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Role</label>
                                <select
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    className="h-10 px-3 border border-gray-250 bg-white rounded-md text-xs text-[#2F2B3D]/80 focus:outline-none focus:border-perple cursor-pointer"
                                >
                                    <option value="Member">Member (Employee)</option>
                                    <option value="Team Lead">Team Lead</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteOpen(false)}
                                    className="px-4 h-9 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 h-9 bg-perple hover:bg-[#5e50eb] text-white text-xs font-bold rounded-md transition-all cursor-pointer"
                                >
                                    Send Invitation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Course Modal */}
            {isAssignOpen && selectedMember && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => {
                                setIsAssignOpen(false);
                                setSelectedMember(null);
                            }}
                            className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="mb-5 pr-8">
                            <h3 className="text-sm font-bold text-[#2F2B3D] tracking-tight">Assign Course</h3>
                            <p className="text-[11px] text-gray-500 mt-1">Assign a training catalog course directly to **{selectedMember.name}**.</p>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Select Course</label>
                                <select
                                    value={assignedCourse}
                                    onChange={(e) => setAssignedCourse(e.target.value)}
                                    className="h-10 px-3 border border-gray-250 bg-white rounded-md text-xs text-[#2F2B3D]/80 focus:outline-none focus:border-perple cursor-pointer"
                                >
                                    <option value="1">Corporate Financial Basics</option>
                                    <option value="2">Advanced Corporate Tax Law</option>
                                    <option value="3">GST Implementation Guide</option>
                                    <option value="4">Management Accounting Principles</option>
                                    <option value="5">Auditing & Corporate Governance</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAssignOpen(false);
                                        setSelectedMember(null);
                                    }}
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

export default MemberList
