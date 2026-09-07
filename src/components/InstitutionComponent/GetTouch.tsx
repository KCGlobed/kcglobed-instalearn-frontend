import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { unversityRegister, getUniversityJobRolesApi, getUniversityInstitutionTypesApi } from '../../utils/service';

interface FormData {
    firstName: string;
    lastName: string;
    workEmail: string;
    phoneNumber: string;
    institutionType: string;
    institutionName: string;
    jobRole: string;
    department: string;
    needs: string;
    country: string;
}

const GetTouchSection = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [institutionTypes, setInstitutionTypes] = useState<any[]>([]);
    const [jobRoles, setJobRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [instTypeRes, jobRoleRes] = await Promise.all([
                    getUniversityInstitutionTypesApi(),
                    getUniversityJobRolesApi()
                ]);

                if (instTypeRes?.success) {
                    setInstitutionTypes(instTypeRes.data || []);
                }
                if (jobRoleRes?.success) {
                    setJobRoles(jobRoleRes.data || []);
                }
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const payload = {
                first_name: data.firstName,
                last_name: data.lastName,
                phone_number: data.phoneNumber,
                work_email: data.workEmail,
                institution_type: data.institutionType,
                institution_name: data.institutionName,
                job_role: data.jobRole,
                department: data.department,
                country: data.country
            };

            const response = await unversityRegister(payload);
            if (response?.success) {
                toast.success(response.message || 'Form submitted successfully!');
                reset();
            } else {
                toast.error(response?.message || 'Something went wrong');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'An error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left Column */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Get in touch with our sales team
                    </h2>

                    <p className="text-lg text-gray-800 font-medium mb-4">
                        Learn more about how you can:
                    </p>

                    <ul className="space-y-3 mb-12">
                        <li className="flex items-start">
                            <Check className="h-5 w-5 text-[#0056D2] mr-3 mt-0.5 shrink-0" />
                            <span className="text-gray-800 text-[15px]">Connect curriculum to careers</span>
                        </li>
                        <li className="flex items-start">
                            <Check className="h-5 w-5 text-[#0056D2] mr-3 mt-0.5 shrink-0" />
                            <span className="text-gray-800 text-[15px]">Strengthen employment outcomes</span>
                        </li>
                        <li className="flex items-start">
                            <Check className="h-5 w-5 text-[#0056D2] mr-3 mt-0.5 shrink-0" />
                            <span className="text-gray-800 text-[15px]">Enhance learning experiences</span>
                        </li>
                    </ul>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 max-w-lg leading-snug">
                        Join the innovative colleges and universities globally that choose Instalearn for their students
                    </h3>

                    {/* Logos Grid Placeholder */}
                    <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-12 items-center opacity-80">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">T</div>
                            <div className="text-[10px] font-bold text-gray-800 leading-tight">Tecnológico<br />de Monterrey</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-[#FFCB05] font-extrabold text-2xl">M</div>
                            <div className="text-[10px] font-bold text-[#00274C] leading-tight">UNIVERSITY OF<br />MICHIGAN</div>
                        </div>
                        <div className="text-[11px] font-bold text-[#003E74] leading-tight border-l-2 border-[#003E74] pl-2">Imperial College<br />London</div>

                        <div className="flex flex-col">
                            <div className="text-[#094183] text-[9px] font-bold">THE UNIVERSITY OF</div>
                            <div className="text-[#094183] text-[12px] font-extrabold">MELBOURNE</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-red-700 rotate-45 shrink-0"></div>
                            <div className="text-xs font-bold text-red-700 tracking-wide">MANIPAL</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-5 h-5 bg-black rounded-sm shrink-0"></div>
                            <div className="text-xs font-bold text-gray-800 tracking-widest">NMIMS</div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                        <p className="text-gray-800 text-[15px] leading-relaxed mb-6">
                            "No one professor or university can offer the breadth of choices students have with Coursera. And since they can find courses relevant to their industry, Coursera is a great bridge between the classroom and the workplace."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="font-serif font-bold text-2xl text-[#4A2054]">
                                IVEY
                                <div className="text-[8px] font-sans font-normal text-gray-500 uppercase tracking-widest mt-0.5">Business School</div>
                            </div>
                            <div className="border-l border-gray-300 pl-4">
                                <p className="font-bold text-gray-900 text-sm">Lameck O.</p>
                                <p className="text-gray-600 text-[13px]">Lecturer and IT project manager</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-sm shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("firstName", { required: "First Name is required" })}
                                />
                                {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("lastName", { required: "Last Name is required" })}
                                />
                                {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Work Email Address"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.workEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("workEmail", {
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                    })}
                                />
                                {errors.workEmail && <p className="text-red-500 text-[11px] mt-1">{errors.workEmail.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("phoneNumber", { required: "Phone number is required" })}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-[11px] mt-1">{errors.phoneNumber.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <select
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.institutionType ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1 bg-white`}
                                    {...register("institutionType", { required: "Institution Type is required" })}
                                >
                                    <option value="">Select Institution Type</option>
                                    {institutionTypes.map((type: any, index: number) => (
                                        <option key={index} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                                {errors.institutionType && <p className="text-red-500 text-[11px] mt-1">{errors.institutionType.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Institution Name"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.institutionName ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("institutionName", { required: "Institution Name is required" })}
                                />
                                {errors.institutionName && <p className="text-red-500 text-[11px] mt-1">{errors.institutionName.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <select
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.jobRole ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1 bg-white`}
                                    {...register("jobRole", { required: "Job Role is required" })}
                                >
                                    <option value="">Select Job Role</option>
                                    {jobRoles.map((role: any, index: number) => (
                                        <option key={index} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                                {errors.jobRole && <p className="text-red-500 text-[11px] mt-1">{errors.jobRole.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Department"
                                    className={`w-full px-3 py-2.5 text-sm border ${errors.department ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                    {...register("department", { required: "Department is required" })}
                                />
                                {errors.department && <p className="text-red-500 text-[11px] mt-1">{errors.department.message}</p>}
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Which best describes your needs?"
                                className={`w-full px-3 py-2.5 text-sm border ${errors.needs ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                {...register("needs", { required: "This field is required" })}
                            />
                            {errors.needs && <p className="text-red-500 text-[11px] mt-1">{errors.needs.message}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Country"
                                className={`w-full px-3 py-2.5 text-sm border ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-blue-500'} rounded-sm focus:outline-none focus:ring-1`}
                                {...register("country", { required: "Country is required" })}
                            />
                            {errors.country && <p className="text-red-500 text-[11px] mt-1">{errors.country.message}</p>}
                        </div>

                        <div className="pt-4">
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                                By submitting your info in the form above, you agree to our <a href="#" className="text-[#0056D2] hover:underline">Terms of Use</a> and <a href="#" className="text-[#0056D2] hover:underline">Privacy Notice</a>. We may use this info to contact you and/or use data from third parties to personalize your experience.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${loading ? 'bg-blue-400' : 'bg-[#0056D2] hover:bg-blue-800'} text-white font-bold py-3 px-4 rounded-sm transition duration-200 text-sm`}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetTouchSection;