import { useState, useRef } from "react";
import Footer from "../../layouts/Footer";
import MainHeader from "../../layouts/MainHeader";
import TopHeader from "../../layouts/TopHeader";
import CareerForm, { ROLE_CHOICES } from "./CareerForm";
import Button from "../../components/Button";

import {
  Briefcase,
  Users,
  Compass,
  Rocket,
  Award,
  Globe,
  ArrowRight,
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function Career() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleApplyClick = (roleValue: string) => {
    setSelectedRole(roleValue);
    
    // Smooth scroll to the form section
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Static mock jobs mapped to role choices for listing
  const jobListings = [
    {
      role: "tech_it",
      title: "Full Stack Engineer (React/Node)",
      department: "Technology / IT",
      type: "Full-Time",
      location: "Bengaluru / Hybrid",
      experience: "2-4 Years",
      description: "Join our core engineering team to build scalable learning applications. You will work on React, TypeScript, Tailwind, and Node.js backend integrations.",
    },
    {
      role: "academic",
      title: "Lead Academic Trainer (Tech)",
      department: "Academic / Training",
      type: "Full-Time",
      location: "Mumbai / Remote",
      experience: "3-5 Years",
      description: "Design curricula and lead live bootcamps for industry professionals. Requires expertise in software engineering concepts and strong mentoring skills.",
    },
    {
      role: "sales_marketing",
      title: "Growth Marketing Specialist",
      department: "Sales & Marketing",
      type: "Full-Time",
      location: "Delhi NCR / Hybrid",
      experience: "1-3 Years",
      description: "Lead performance marketing and user acquisition campaigns. Optimize conversion funnels and spearhead brand partnerships.",
    },
    {
      role: "content_design",
      title: "UI/UX & Brand Designer",
      department: "Content / Design",
      type: "Full-Time",
      location: "Remote (India)",
      experience: "2+ Years",
      description: "Own the visual identity and user interface designs across Web & Mobile platforms. Create design systems and dynamic marketing assets.",
    },
    {
      role: "operations",
      title: "Operations Associate",
      department: "Operations",
      type: "Full-Time",
      location: "Bengaluru Office",
      experience: "0-2 Years",
      description: "Manage day-to-day student support, program coordination, and operational tools. Ensure a seamless learning journey for our participants.",
    }
  ];

  const values = [
    {
      icon: <Rocket className="w-6 h-6 text-[#5624D0]" />,
      title: "Innovation First",
      desc: "We continuously evolve our platform, utilizing modern tech stacks and AI workflows to create ahead-of-time education models."
    },
    {
      icon: <Globe className="w-6 h-6 text-[#5624D0]" />,
      title: "Remote & Hybrid Freedom",
      desc: "Work from where you are most productive. We focus on results, collaboration, and high trust rather than desk time."
    },
    {
      icon: <Award className="w-6 h-6 text-[#5624D0]" />,
      title: "Learning & Growth",
      desc: "We provide monthly learning allowances, paid courses, and structural mentorship to help you constantly level up."
    },
    {
      icon: <Heart className="w-6 h-6 text-[#5624D0]" />,
      title: "Health & Wellness",
      desc: "Comprehensive health insurance, flexible mental health leaves, and wellness credits because your health comes first."
    }
  ];

  return (
    <div className="bg-[#F8F9FC] min-h-screen">
      <TopHeader />
      <MainHeader />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1D2026] via-[#15171C] to-[#2B1B54] py-20 lg:py-28 text-white">
        {/* Floating decorative light glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#5624D0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-24 w-80 h-80 bg-[#FF9F00]/5 rounded-full blur-3xl" />

        <div className="max-w-[1320px] mx-auto px-4 xl:px-0 relative z-10">
          <div className="max-w-3xl">
            {/* Tagline */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#FF9F00] fill-[#FF9F00]" />
              Careers at InstaLearn
            </span>
            
            <h1 className="text-[38px] md:text-[56px] font-bold leading-[1.1] tracking-tight text-white mb-6">
              Shape the Future of <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#FF9F00] to-[#E68F00] bg-clip-text text-transparent">Digital Learning</span>
            </h1>
            
            <p className="text-[#9499A3] text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Join a modern, fast-paced team building high-fidelity educational platforms. Empower thousands of students around the world to build meaningful careers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 md:mt-8">
              <Button
                variant="perple"
                title="Apply Directly"
                onClick={() => handleApplyClick("")}
                className="h-[48px] px-6 rounded bg-perple text-white flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-[1.02] cursor-pointer"
                icon={<ArrowRight className="w-4 h-4" />}
              />
              <Button
                variant="light-gray"
                title="View Openings"
                onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}
                className="h-[48px] px-6 rounded bg-light-gray text-white flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-[1.02] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY VALUES ── */}
      <section className="py-20 bg-white border-b border-[#E9EAF0]">
        <div className="max-w-[1320px] mx-auto px-4 xl:px-0">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#1D2026] tracking-tight">
              Why You'll Love Working With Us
            </h2>
            <p className="text-[#6E7485] mt-3 text-base">
              We offer a progressive workspace built on autonomy, continuous learning, and shared growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl border border-[#E9EAF0] bg-[#F8F9FC]/40 hover:bg-white hover:border-[#5624D0]/30 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h3 className="text-[18px] font-bold text-[#1D2026] mb-3 leading-snug">
                  {v.title}
                </h3>
                <p className="text-[#6E7485] text-[14px] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ── */}
      <section id="openings" className="py-20">
        <div className="max-w-[1320px] mx-auto px-4 xl:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-5">
            <div>
              <span className="text-[12px] font-bold text-[#5624D0] uppercase tracking-wider">Join our squad</span>
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#1D2026] tracking-tight mt-1">
                Explore Open Positions
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[#6E7485] text-sm">
              <Briefcase className="w-4 h-4 text-[#5624D0]" />
              <span>Have a different skillset? Apply directly via the form below!</span>
            </div>
          </div>

          <div className="space-y-4">
            {jobListings.map((job, idx) => (
              <div
                key={idx}
                className="bg-white p-6 md:p-8 rounded-2xl border border-[#E9EAF0] shadow-sm hover:shadow-md hover:border-[#5624D0]/20 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold text-[#5624D0] bg-[#F5F4FF] rounded-full">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D2026] leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-[#6E7485] text-[14px] leading-relaxed max-w-4xl">
                    {job.description}
                  </p>
                </div>

                <button
                  onClick={() => handleApplyClick(job.role)}
                  className="w-full lg:w-auto h-11 px-6 bg-white hover:bg-[#5624D0] text-[#5624D0] hover:text-white border border-[#5624D0]/30 hover:border-[#5624D0] text-[14px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM SECTION ── */}
      <section
        ref={formSectionRef}
        className="py-20 bg-white border-t border-[#E9EAF0]"
      >
        <div className="max-w-[800px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[12px] font-bold text-[#FF9F00] uppercase tracking-wider">Become a candidate</span>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#1D2026] tracking-tight mt-1">
              Apply For A Position
            </h2>
            <p className="text-[#6E7485] mt-3 text-base">
              Submit your information, choose a role, and upload your resume. Let's make an impact together.
            </p>
          </div>

          <div className="bg-[#F8F9FC]/40 p-6 md:p-10 rounded-2xl border border-[#E9EAF0] shadow-inner">
            <CareerForm selectedRole={selectedRole} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}