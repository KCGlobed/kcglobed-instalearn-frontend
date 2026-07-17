import React, { useEffect, useState } from 'react'
import { UserPlus, Trash2, BookOpen, ShieldAlert, Lock, Key } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { fetchCorporateUsers } from '../../store/slices/corporateUserSlice'
import { useModal } from '../Modals/ModalContext'
import InviteMemberForm from '../Forms/InviteMemberForm'
import DeleteModal from '../Modals/DeleteModal'
import AssignCourseModal from '../Modals/AssignCourseModal'
import toast from 'react-hot-toast'
import ReshareLoginDetail from '../Modals/ReshareLoginDetail'

interface Member {
    id: number;
    name: string;
    email: string;
    activeCourses: number;
    completion: number;
    status: 'Active' | 'Pending';
}

const MemberList = () => {
    const dispatch = useAppDispatch();
    const { showModal } = useModal();
    const { corporateUsers, pagination, loading, error } = useAppSelector((state) => state.corporateUser);

    // Local state for members list
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        dispatch(fetchCorporateUsers(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (corporateUsers) {
            const mappedMembers: Member[] = corporateUsers.map((user: any) => ({
                id: user.id,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name',
                email: user.email || '',
                activeCourses: user.courses?.length || 0,
                completion: 0,
                status: (user.is_active ? 'Active' : 'Pending') as 'Active' | 'Pending'
            }));
            setMembers(mappedMembers);
        }
    }, [corporateUsers]);

    const handleDeleteMember = async (id: number) => {
        showModal({
            content: (
                <DeleteModal
                    title="Delete Member"
                    description={`Are you sure you want to delete the member ""?`}
                    confirmText="Delete"
                    onConfirm={async () => {
                        try {

                            toast.success('Member deleted successfully!');

                        } catch (err: any) {
                            console.error('Failed to delete reminder', err);
                            toast.error(err?.message || 'Failed to delete reminder');
                            throw err;
                        }
                    }}
                />
            ),
            size: "md"
        });


    }

    const handleAssignCourse = (member: Member) => {
        showModal({
            content: (
                <AssignCourseModal
                    userId={member.id}
                    userName={member.name}
                    onSuccess={() => {
                        dispatch(fetchCorporateUsers(pagination?.current_page || 1));
                    }}
                />
            ),
            size: "md"
        });
    }

    const handleReshareLoginDetail = (member: Member) => {
        showModal({
            content: (
                <ReshareLoginDetail
                    userId={member.id}
                    userName={member.name}
                    member={member}
                />
            ),
            size: "md"
        });

    }






    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-[#2F2B3D]">Team Members</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Manage licenses, assign courses, and track employee progress.</p>
                </div>
                <button
                    onClick={() => showModal({ content: <InviteMemberForm />, size: 'md' })}
                    className="sm:self-end h-9 px-4 bg-perple hover:bg-[#5e50eb] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {/* Members Table Card */}
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F7FA] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 md:px-6">Name / Email</th>
                                <th className="py-3.5 px-4 text-center">Active Courses</th>
                                <th className="py-3.5 px-4">Completion Progress</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-perple"></div>
                                            <span>Loading team members...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-rose-500 text-xs">
                                        <div className="flex justify-center items-center gap-1.5">
                                            <ShieldAlert className="w-4 h-4" />
                                            <span>{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : members.length > 0 ? (
                                members.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                                        {/* Name / Email */}
                                        <td className="py-4 px-4 md:px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#2F2B3D]">{member.name}</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">{member.email}</span>
                                            </div>
                                        </td>

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
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${member.status === 'Active'
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
                                                    className="p-1 text-gray-400 hover:text-perple hover:bg-perple/5 rounded transition-colors cursor-pointer"
                                                    title="Reshare Login Detail"
                                                    onClick={() => handleReshareLoginDetail(member)}
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-gray-400 hover:text-perple hover:bg-perple/5 rounded transition-colors cursor-pointer"
                                                    title="Assign Course"
                                                    onClick={() => handleAssignCourse(member)}
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                    title="Remove Member"
                                                    onClick={() => handleDeleteMember(member.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                                        No team members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.total_pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5 bg-[#F8F7FA] sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => pagination.previous_page && dispatch(fetchCorporateUsers(pagination.previous_page))}
                                disabled={!pagination.previous_page}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => pagination.next_page && dispatch(fetchCorporateUsers(pagination.next_page))}
                                disabled={!pagination.next_page}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Showing page <span className="font-semibold text-gray-700">{pagination.current_page}</span> of{' '}
                                    <span className="font-semibold text-gray-700">{pagination.total_pages}</span> ({pagination.total_results} total results)
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => pagination.previous_page && dispatch(fetchCorporateUsers(pagination.previous_page))}
                                        disabled={!pagination.previous_page}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>
                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => dispatch(fetchCorporateUsers(page))}
                                            aria-current={page === pagination.current_page ? 'page' : undefined}
                                            className={`relative inline-flex items-center px-3 py-2 text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 cursor-pointer ${page === pagination.current_page
                                                ? 'z-10 bg-perple text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-perple'
                                                : 'text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => pagination.next_page && dispatch(fetchCorporateUsers(pagination.next_page))}
                                        disabled={!pagination.next_page}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="sr-only">Next</span>
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MemberList
