import { ArrowRight } from "lucide-react"
import Button from "../Button"
import public_speaker from "../../assets/public_speaker.svg"
import career from "../../assets/career.svg"
import thinking from "../../assets/thinking.svg"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../hooks/useRedux"

const InstituteBanner = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <div className="banner px-4 md:px-8 xl:px-0 relative pb-16  mb-20 md:mb-28 lg:mb-32">
            <div className="max-w-[1200px] mx-auto overflow-hidden lg:overflow-visible">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">
                    <div className="banner-content flex flex-col">
                        <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#2F2B3DE5] leading-[1.2] md:leading-[1.15]">
                            <span className="text-[#7367F0]">Power </span>Your Career with <br className="hidden lg:block" /> <span className="text-[#7367F0]"> In-Demand </span> Skills
                        </h1>

                        <h3>Get expert guidance to master critical finance & accounting skills and unlock new opportunities for growth.</h3>

                        <div className="mt-6 md:mt-8">
                            <button
                                onClick={() => navigate('/contact')}
                                className="h-[44px] md:h-[48px] px-6 md:px-8 rounded bg-[#0056D2] hover:bg-[#004bb8] transition-colors text-white font-semibold text-[14px] md:text-[15px] w-full sm:w-auto"
                            >
                                Contact us
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-6 md:gap-12 mt-8 md:mt-12">
                            <div className="flex flex-col items-center gap-2" >
                                <img src={public_speaker} alt="public_speaker" className="w-10 h-10 md:w-auto md:h-auto" />
                                <p className="text-[#1D2939B2] text-sm md:text-base">Public Speaking</p>
                            </div>
                            <div className="flex flex-col items-center gap-2" >
                                <img src={career} alt="career" className="w-10 h-10 md:w-auto md:h-auto" />
                                <p className="text-[#1D2939B2] text-sm md:text-base">Career-Oriented</p>
                            </div>
                            <div className="flex flex-col items-center gap-2" >
                                <img src={thinking} alt="thinking" className="w-10 h-10 md:w-auto md:h-auto" />
                                <p className="text-[#1D2939B2] text-sm md:text-base">Creative Thinking</p>
                            </div>
                        </div>
                    </div>

                    <div className="banner-image">
                        <div className="relative inline-block h-fit w-full max-w-[350px]">
                            {/* Main Background Image */}
                            <img src="/hero_banner.webp" alt="Banner Image" className="relative z-10 w-full object-cover" />

                            {/* Floating Card: 250k Assisted Student */}
                            <div className="absolute top-[8%] -left-[25%] z-20 bg-white/95 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[14px] p-2 md:p-3 pl-3.5 pr-6 md:pr-8 hidden md:flex items-center gap-2 md:gap-3 " >
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00CFE8] rounded-[10px] flex items-center justify-center text-white shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2F2B3DE5] font-bold text-[13px] md:text-[15px] leading-tight">250k</span>
                                    <span className="text-[#2F2B3DB2] text-[10px] md:text-[12px] font-medium leading-tight">Assisted Student</span>
                                </div>
                            </div>

                            {/* Top Right Red Icon */}
                            <div className="absolute top-[3%] -right-[5%] z-20 bg-[#EA5455] w-[36px] h-[36px] md:w-[46px] md:h-[46px] rounded-[10px] md:rounded-[12px] shadow-lg shadow-[#EA5455]/30 hidden md:flex flex items-center justify-center">
                                <div className="flex items-end gap-[3px] md:gap-[4px] h-[16px] md:h-[20px]">
                                    <div className="w-[3px] md:w-[4px] h-[10px] md:h-[12px] bg-white rounded-sm"></div>
                                    <div className="w-[3px] md:w-[4px] h-[16px] md:h-[20px] bg-white rounded-sm"></div>
                                    <div className="w-[3px] md:w-[4px] h-[12px] md:h-[16px] bg-white rounded-sm"></div>
                                </div>
                            </div>

                            {/* Floating Card: Congratulations */}
                            <div className="absolute top-[35%] -right-[30%] z-20 bg-white/95 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-[14px] p-2.5 md:p-3.5 px-3 md:px-4 pr-6 md:pr-10 hidden lg:flex items-center gap-3">
                                <div className="w-[36px] h-[36px] md:w-[42px] md:h-[42px] bg-[#FF9F43] rounded-[10px] flex items-center justify-center text-white shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2F2B3DE5] font-bold text-[12px] md:text-[14px] leading-tight">Congratulations</span>
                                    <span className="text-[#2F2B3DB2] text-[10px] md:text-[11px] font-medium leading-tight mt-0.5">Your admission completed</span>
                                </div>
                            </div>

                            {/* Floating Card: User Experience Class */}
                            <div className="absolute bottom-[20%] -left-[28%] z-20 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-[16px] md:rounded-[20px] p-3 md:p-5 py-3 md:py-4 hidden lg:flex flex-col gap-3 w-[200px] md:w-[240px]">
                                <div className="flex items-center gap-2 md:gap-3 relative">
                                    <div className="relative shrink-0">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e293b] overflow-hidden">
                                            <div className="w-full h-full flex items-end justify-center pt-2 md:pt-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-[-2px] w-[10px] h-[10px] md:w-[13px] md:h-[13px] bg-[#28C76F] rounded-full border-2 border-white"></div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[#2F2B3DE5] font-bold text-[12px] md:text-[14px] leading-tight">User Experience Class</span>
                                        <span className="text-[#2F2B3DB2] text-[10px] md:text-[11px] font-medium leading-tight mt-0.5">Today at 12.00 PM</span>
                                    </div>
                                </div>
                                <button className="w-full bg-[#D1598C] text-white rounded-lg py-[7px] md:py-[9px] text-[11px] md:text-[12.5px] font-semibold hover:bg-[#c34c7b] transition-colors">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="absolute left-0 right-0 bottom-0 translate-y-[50%] w-full px-4 md:px-8 xl:px-0 z-30">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-[#143958] rounded-[10px] md:rounded-[12px] flex flex-col md:flex-row py-8 lg:py-10 px-4 md:px-6 lg:px-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">

                        {/* Stat 1 */}
                        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start relative py-6 md:py-0 px-4 md:px-6 lg:px-8">
                            <div className="flex flex-row items-center gap-4 lg:gap-5 w-full">
                                <h2 className="text-[38px] lg:text-[46px] font-bold text-white m-0 tracking-tight shrink-0">76%</h2>
                                <p className="text-[12px] lg:text-[13px] text-white/80 leading-[1.4] m-0 font-medium max-w-[200px] md:max-w-none">
                                    Students are 76% more likely to enroll in a degree program that offers industry micro-credentials
                                </p>
                            </div>
                            <span className="absolute bottom-2 md:-bottom-4 lg:-bottom-6 right-4 md:right-2 lg:right-6 text-[10px] text-white/40 font-medium">[1]</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] bg-white/10 self-stretch my-2"></div>
                        <div className="block md:hidden h-[1px] bg-white/10 w-full my-2"></div>

                        {/* Stat 2 */}
                        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start relative py-6 md:py-0 px-4 md:px-6 lg:px-8">
                            <div className="flex flex-row items-center gap-4 lg:gap-5 w-full">
                                <h2 className="text-[38px] lg:text-[46px] font-bold text-white m-0 tracking-tight shrink-0">88%</h2>
                                <p className="text-[12px] lg:text-[13px] text-white/80 leading-[1.4] m-0 font-medium max-w-[200px] md:max-w-none">
                                    of employers believe that Professional Certificates strengthen a candidate's job application
                                </p>
                            </div>
                            <span className="absolute bottom-2 md:-bottom-4 lg:-bottom-6 right-4 md:right-2 lg:right-6 text-[10px] text-white/40 font-medium">[2]</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] bg-white/10 self-stretch my-2"></div>
                        <div className="block md:hidden h-[1px] bg-white/10 w-full my-2"></div>

                        {/* Stat 3 */}
                        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start relative py-6 md:py-0 px-4 md:px-6 lg:px-8">
                            <div className="flex flex-row items-center gap-4 lg:gap-5 w-full">
                                <h2 className="text-[38px] lg:text-[46px] font-bold text-white m-0 tracking-tight shrink-0">90%</h2>
                                <p className="text-[12px] lg:text-[13px] text-white/80 leading-[1.4] m-0 font-medium max-w-[200px] md:max-w-none">
                                    of students agree that a Professional Certificate will help them secure a job
                                </p>
                            </div>
                            <span className="absolute bottom-2 md:-bottom-4 lg:-bottom-6 right-4 md:right-4 lg:right-8 text-[10px] text-white/40 font-medium">[3]</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstituteBanner
