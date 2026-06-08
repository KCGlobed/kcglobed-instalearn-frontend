import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useModal } from "../Modals/ModalContext";
import { quickContactApi } from "../../utils/service";

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string;
}

export default function QuickContactForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            message: ""
        }
    });
    const [submitting, setSubmitting] = useState(false);
    const { hideModal } = useModal();

    const onSubmit = async (data: ContactFormData) => {
        setSubmitting(true);
        try {
            const response = await quickContactApi(data);
            if (response.status) {
                toast.success(response.message);
                reset();
                hideModal();
            } else {
                toast.error(response.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 bg-white text-left">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1D2026] tracking-tight">Quick Inquiry</h3>
                <p className="text-sm text-[#6E7485] mt-1 leading-relaxed">
                    Have questions? Leave your details below and our team will connect with you soon.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="flex flex-col gap-1.5 col-span-1">
                    <label htmlFor="first_name" className="text-xs font-bold text-[#1D2026] uppercase tracking-wider">
                        First Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="first_name"
                            type="text"
                            placeholder="John"
                            {...register("first_name", {
                                required: "First Name is required",
                                minLength: { value: 2, message: "First name must be at least 2 characters" }
                            })}
                            className={`w-full h-12 pl-10 pr-4 border ${errors.first_name ? "border-rose-500 bg-rose-50/30" : "border-[#E9EAF0]"
                                } rounded-md text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#FF9F00] focus:ring-1 focus:ring-[#FF9F00] transition-all`}
                        />
                    </div>
                    {errors.first_name && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            {errors.first_name.message}
                        </span>
                    )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5 col-span-1">
                    <label htmlFor="last_name" className="text-xs font-bold text-[#1D2026] uppercase tracking-wider">
                        Last Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="last_name"
                            type="text"
                            placeholder="Doe"
                            {...register("last_name", {
                                required: "Last Name is required",
                                minLength: { value: 2, message: "Last name must be at least 2 characters" }
                            })}
                            className={`w-full h-12 pl-10 pr-4 border ${errors.last_name ? "border-rose-500 bg-rose-50/30" : "border-[#E9EAF0]"
                                } rounded-md text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#FF9F00] focus:ring-1 focus:ring-[#FF9F00] transition-all`}
                        />
                    </div>
                    {errors.last_name && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            {errors.last_name.message}
                        </span>
                    )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 col-span-1">
                    <label htmlFor="email" className="text-xs font-bold text-[#1D2026] uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email", {
                                required: "Email Address is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className={`w-full h-12 pl-10 pr-4 border ${errors.email ? "border-rose-500 bg-rose-50/30" : "border-[#E9EAF0]"
                                } rounded-md text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#FF9F00] focus:ring-1 focus:ring-[#FF9F00] transition-all`}
                        />
                    </div>
                    {errors.email && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5 col-span-1">
                    <label htmlFor="phone" className="text-xs font-bold text-[#1D2026] uppercase tracking-wider">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Phone className="w-4 h-4" />
                        </div>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[+]?[0-9\s-]{10,15}$/,
                                    message: "Please enter a valid phone number"
                                }
                            })}
                            className={`w-full h-12 pl-10 pr-4 border ${errors.phone ? "border-rose-500 bg-rose-50/30" : "border-[#E9EAF0]"
                                } rounded-md text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#FF9F00] focus:ring-1 focus:ring-[#FF9F00] transition-all`}
                        />
                    </div>
                    {errors.phone && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            {errors.phone.message}
                        </span>
                    )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 col-span-2">
                    <label htmlFor="message" className="text-xs font-bold text-[#1D2026] uppercase tracking-wider">
                        Message
                    </label>
                    <div className="relative">
                        <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                            id="message"
                            rows={3}
                            placeholder="Tell us what you are looking for..."
                            {...register("message", {
                                required: "Please enter your message",
                                minLength: { value: 10, message: "Message must be at least 10 characters" }
                            })}
                            className={`w-full pl-10 pr-4 py-3 border ${errors.message ? "border-rose-500 bg-rose-50/30" : "border-[#E9EAF0]"
                                } rounded-md text-[14px] text-[#1D2026] placeholder:text-[#9499A3] focus:outline-none focus:border-[#FF9F00] focus:ring-1 focus:ring-[#FF9F00] transition-all resize-none`}
                        />
                    </div>
                    {errors.message && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            {errors.message.message}
                        </span>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 justify-end mt-6 pt-6 border-t border-[#F1F2F4]">
                <button
                    type="button"
                    onClick={hideModal}
                    className="px-5 h-11 text-sm font-semibold text-[#1D2026] hover:bg-gray-100 rounded-md transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className={`px-8 h-11 bg-[#FF9F00] text-white text-sm font-bold rounded-md hover:bg-[#E68F00] transition-all shadow-md hover:shadow-[#FF9F00]/20 flex items-center gap-2 justify-center min-w-[150px] cursor-pointer ${submitting ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                >
                    {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Send Message</span>
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
