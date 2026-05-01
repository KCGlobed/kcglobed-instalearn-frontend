import React from 'react';
import { Award, Briefcase, Clock, Users } from 'lucide-react';
import SectionTitle from './SectionTitle';

const InstructorPanel: React.FC<{ courseDetail: any }> = ({ courseDetail }) => {
    const instructors = courseDetail?.instrcutor_info ?? [];

    return (
        <div id="tabpanel-Instructor" role="tabpanel" aria-labelledby="tab-Instructor" className="mb-12">
            <SectionTitle
                icon={<Users className="w-5 h-5 text-indigo-600" />}
                title="Meet Your Instructors"
                subtitle={`${instructors.length} expert${instructors.length !== 1 ? 's' : ''} teaching this course`}
            />

            {instructors.length > 0 ? (
                <div className="space-y-5">
                    {instructors.map((item: any) => {
                        const info = item.instructor_info;
                        return (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                            >
                                <div className="flex gap-5 items-start">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={info?.image || 'https://placehold.co/80x80?text=I'}
                                            alt={info?.text_1}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100"
                                        />
                                        <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <Award className="w-3.5 h-3.5 text-white" />
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-0.5">{info?.text_1}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                                            {info?.text_2 && (
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                                                    {info.text_2}
                                                </span>
                                            )}
                                            {info?.text_3 && (
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                                                    {info.text_3}
                                                </span>
                                            )}
                                            {info?.experience && (
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                                    {info.experience} experience
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">Instructor information not available.</p>
                </div>
            )}
        </div>
    );
};

export default InstructorPanel;
