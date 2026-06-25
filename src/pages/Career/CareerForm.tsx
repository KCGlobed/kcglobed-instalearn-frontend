import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Linkedin,
  FileText,
  Upload,
  Trash2,
  Send,
  AlertCircle
} from "lucide-react";
import { submitApplicationFormApi } from "../../utils/service";

// Define dropdown choices
export const EMPLOYMENT_STATUS_CHOICES = [
  { value: "student", label: "Student" },
  { value: "fresher", label: "Fresher" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "working_professional", label: "Working Professional" },
];

export const EXPERIENCE_CHOICES = [
  { value: "0-1", label: "0-1 Year" },
  { value: "1-3", label: "1-3 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years" },
];

export const ROLE_CHOICES = [
  { value: "academic", label: "Academic / Training" },
  { value: "sales_marketing", label: "Sales & Marketing" },
  { value: "operations", label: "Operations" },
  { value: "tech_it", label: "Technology / IT" },
  { value: "content_design", label: "Content / Design" },
  { value: "other", label: "Other (Please specify)" },
];

export const NOTICE_PERIOD_CHOICES = [
  { value: "immediate", label: "Immediate" },
  { value: "15_days", label: "15 Days" },
  { value: "30_days", label: "30 Days" },
  { value: "more_than_30", label: "More than 30 Days" },
];

interface CareerFormData {
  full_name: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
  highest_qualification: string;
  current_employment_status: string;
  total_years_of_experience: string;
  role_applying_for: string;
  other_role_specification: string;
  linkedin_portfolio: string;
  notice_period: string;
  summary: string;
  resume: File | null;
}

interface CareerFormProps {
  selectedRole?: string;
}

export default function CareerForm({ selectedRole }: CareerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CareerFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      mobile: "",
      state: "",
      city: "",
      highest_qualification: "",
      current_employment_status: "",
      total_years_of_experience: "",
      role_applying_for: "",
      other_role_specification: "",
      linkedin_portfolio: "",
      notice_period: "",
      summary: "",
      resume: null,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch role selection to show other_role_specification conditionally
  const watchedRole = watch("role_applying_for");

  // Sync selectedRole prop from parent (e.g. when user clicks "Apply Now" on a specific job card)
  useEffect(() => {
    if (selectedRole) {
      setValue("role_applying_for", selectedRole, { shouldValidate: true });
    }
  }, [selectedRole, setValue]);

  // Manually register resume file input
  useEffect(() => {
    register("resume", {
      required: "Resume/CV is required",
    });
  }, [register]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setResumeFile(null);
      setValue("resume", null, { shouldValidate: true });
      return;
    }

    // Validation checks
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast.error("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setResumeFile(file);
    setValue("resume", file, { shouldValidate: true });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setValue("resume", null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CareerFormData) => {
    setSubmitting(true);
    const formData = new FormData();

    // Append standard fields
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("highest_qualification", data.highest_qualification);
    formData.append("current_employment_status", data.current_employment_status);
    formData.append("total_years_of_experience", data.total_years_of_experience);
    formData.append("role_applying_for", data.role_applying_for);
    
    // Only append other role if "other" is selected
    if (data.role_applying_for === "other" && data.other_role_specification) {
      formData.append("other_role_specification", data.other_role_specification);
    } else {
      formData.append("other_role_specification", "");
    }
    
    formData.append("linkedin_portfolio", data.linkedin_portfolio || "");
    formData.append("notice_period", data.notice_period);
    formData.append("summary", data.summary);

    // Append file
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const response = await submitApplicationFormApi(formData);
      if (response && (response.status || response.id)) {
        toast.success(response.message || "Application submitted successfully!");
        // Reset form
        reset();
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(response?.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              {...register("full_name", {
                required: "Full Name is required",
                minLength: { value: 2, message: "Full Name must be at least 2 characters" }
              })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.full_name ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.full_name && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.full_name.message}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="alex@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.email ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mobile" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="mobile"
              type="tel"
              placeholder="10-digit number without country code"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number"
                }
              })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.mobile ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.mobile && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.mobile.message}
            </span>
          )}
        </div>

        {/* Highest Qualification */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="highest_qualification" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Highest Qualification <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <input
              id="highest_qualification"
              type="text"
              placeholder="e.g., M.Tech CSE, MBA, B.Sc"
              {...register("highest_qualification", {
                required: "Highest Qualification is required",
                minLength: { value: 2, message: "Qualification must be at least 2 characters" }
              })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.highest_qualification ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.highest_qualification && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.highest_qualification.message}
            </span>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="state"
              type="text"
              placeholder="e.g., Karnataka"
              {...register("state", { required: "State is required" })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.state ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.state && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.state.message}
            </span>
          )}
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="city"
              type="text"
              placeholder="e.g., Bengaluru"
              {...register("city", { required: "City is required" })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.city ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.city && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.city.message}
            </span>
          )}
        </div>

        {/* Employment Status */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="current_employment_status" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Employment Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <select
              id="current_employment_status"
              {...register("current_employment_status", { required: "Employment Status is required" })}
              className={`w-full h-12 pl-10 pr-4 border bg-white ${
                errors.current_employment_status ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] focus:outline-none focus:ring-4 transition-all appearance-none`}
            >
              <option value="" disabled>Select status</option>
              {EMPLOYMENT_STATUS_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.current_employment_status && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.current_employment_status.message}
            </span>
          )}
        </div>

        {/* Total Experience */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="total_years_of_experience" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Total Experience <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <select
              id="total_years_of_experience"
              {...register("total_years_of_experience", { required: "Total Experience is required" })}
              className={`w-full h-12 pl-10 pr-4 border bg-white ${
                errors.total_years_of_experience ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] focus:outline-none focus:ring-4 transition-all appearance-none`}
            >
              <option value="" disabled>Select experience range</option>
              {EXPERIENCE_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.total_years_of_experience && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.total_years_of_experience.message}
            </span>
          )}
        </div>

        {/* Role Applying For */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="role_applying_for" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Role Applying For <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <select
              id="role_applying_for"
              {...register("role_applying_for", { required: "Role is required" })}
              className={`w-full h-12 pl-10 pr-4 border bg-white ${
                errors.role_applying_for ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] focus:outline-none focus:ring-4 transition-all appearance-none`}
            >
              <option value="" disabled>Select role type</option>
              {ROLE_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.role_applying_for && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.role_applying_for.message}
            </span>
          )}
        </div>

        {/* Notice Period */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="notice_period" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Notice Period <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <select
              id="notice_period"
              {...register("notice_period", { required: "Notice Period is required" })}
              className={`w-full h-12 pl-10 pr-4 border bg-white ${
                errors.notice_period ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] focus:outline-none focus:ring-4 transition-all appearance-none`}
            >
              <option value="" disabled>Select notice period</option>
              {NOTICE_PERIOD_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.notice_period && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.notice_period.message}
            </span>
          )}
        </div>

        {/* Conditional Field: Other Role Specification */}
        {watchedRole === "other" && (
          <div className="flex flex-col gap-1.5 md:col-span-2 transition-all duration-300 animate-fade-in-up">
            <label htmlFor="other_role_specification" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
              Specify Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <input
                id="other_role_specification"
                type="text"
                placeholder="e.g., HR Generalist, Product Manager"
                {...register("other_role_specification", {
                  required: "Please specify the role you are applying for",
                  minLength: { value: 2, message: "Specification must be at least 2 characters" }
                })}
                className={`w-full h-12 pl-10 pr-4 border ${
                  errors.other_role_specification ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
                } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
              />
            </div>
            {errors.other_role_specification && (
              <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.other_role_specification.message}
              </span>
            )}
          </div>
        )}

        {/* LinkedIn Portfolio */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="linkedin_portfolio" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            LinkedIn / Portfolio URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Linkedin className="w-4 h-4" />
            </div>
            <input
              id="linkedin_portfolio"
              type="url"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin_portfolio", {
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,
                  message: "Please enter a valid URL (e.g. http://linkedin.com/...)"
                }
              })}
              className={`w-full h-12 pl-10 pr-4 border ${
                errors.linkedin_portfolio ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
              } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.linkedin_portfolio && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.linkedin_portfolio.message}
            </span>
          )}
        </div>

        {/* Resume upload */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Upload Resume / CV <span className="text-red-500">*</span>
          </label>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive ? "border-[#5624D0] bg-[#F5F4FF]" : "border-[#E9EAF0] hover:border-[#5624D0] hover:bg-[#F8F9FC]"
            } ${errors.resume ? "border-rose-500 bg-rose-50/5 hover:bg-rose-50/10" : ""}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            
            {!resumeFile ? (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[#F5F4FF] text-[#5624D0] rounded-xl flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1D2026]">
                    Drag and drop your file here, or <span className="text-[#5624D0] hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-[#8C94A3] mt-1.5">
                    Supports PDF, DOC, DOCX up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white border border-[#E9EAF0] p-4 rounded-lg max-w-lg mx-auto shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#EBEBFF] text-[#5624D0] rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[13px] font-bold text-[#1D2026] truncate">{resumeFile.name}</p>
                    <p className="text-xs text-[#8C94A3] mt-0.5">
                      {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {errors.resume && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.resume.message}
            </span>
          )}
        </div>

        {/* Summary / Cover Letter */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="summary" className="text-[13px] font-bold text-[#1D2026] uppercase tracking-wider">
            Short Summary / Cover Letter <span className="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            rows={5}
            placeholder="Tell us about yourself, your goals, and why you are a good fit for this role..."
            {...register("summary", {
              required: "Please write a brief summary",
              minLength: { value: 10, message: "Summary must be at least 10 characters long" }
            })}
            className={`w-full p-4 border ${
              errors.summary ? "border-rose-500 bg-rose-50/10 focus:ring-rose-500/20" : "border-[#E9EAF0] focus:border-[#5624D0] focus:ring-[#5624D0]/10"
            } rounded-lg text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:ring-4 transition-all resize-none`}
          />
          {errors.summary && (
            <span className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.summary.message}
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className={`w-full h-12 bg-[#5624D0] hover:bg-[#461DA5] text-white text-[15px] font-bold rounded-lg transition-all shadow-lg hover:shadow-[#5624D0]/20 flex items-center gap-2 justify-center cursor-pointer ${
            submitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
