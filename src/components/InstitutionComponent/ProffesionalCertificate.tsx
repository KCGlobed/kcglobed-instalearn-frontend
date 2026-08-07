import { ArrowRight, Play } from "lucide-react";

const ProffesionalCertificate = () => {
    return (
        <section className="bg-[#EBEBEB] py-16 md:py-24 px-4 md:px-8 xl:px-0">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">
                    
                    {/* Left: Content */}
                    <div className="flex flex-col w-full order-2 lg:order-1 mt-10 lg:mt-0">
                        <div className="inline-block">
                            <span className="text-[#111827] text-[12px] font-bold uppercase tracking-wider">
                                PROFESSIONAL CERTIFICATES
                            </span>
                        </div>
                        
                        <h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#111827] leading-[1.2] mt-4 md:mt-5 max-w-[500px]">
                            Learn why students and employers value Professional Certificates
                        </h2>
                        
                        <p className="mt-4 md:mt-5 text-[#374151] text-[14px] md:text-[15px] leading-relaxed max-w-[550px]">
                            A survey of 5,000 students and employers in 11 countries finds that the majority value Professional Certificates for driving employment outcomes. Professional Certificates help students demonstrate to employers that they are qualified and job-ready.
                        </p>
                        
                        <p className="mt-4 text-[#374151] text-[14px] md:text-[15px] leading-relaxed max-w-[550px]">
                            Use these insights to enhance your curriculum, and strengthen employment outcomes.
                        </p>
                        
                        <div className="mt-6 md:mt-8">
                            <a href="#" className="inline-flex items-center gap-1.5 text-[#0056D2] font-semibold text-[14px] hover:underline transition-colors group">
                                Get report
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="w-full flex justify-center lg:justify-end order-1 lg:order-2">
                        <div className="relative w-full">
                            <img
                                src="/professional_certificate_placeholder.png"
                                alt="Professional Certificate Video"
                                className="w-full shadow-sm object-cover aspect-[16/9] lg:aspect-auto lg:h-[350px] xl:h-[400px]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[1.5px] border-white flex items-center justify-center bg-black/10 cursor-pointer pointer-events-auto hover:bg-black/20 hover:scale-105 transition-all">
                                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 fill-white" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ProffesionalCertificate;