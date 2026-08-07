import { Check, ArrowRight } from "lucide-react";

const CareerAcademySection = () => {
    return (
        <section className="pt-4 pb-16 md:pb-24 px-4 md:px-8 xl:px-0">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">

                    {/* Left: Image */}
                    <div className="w-full flex justify-center lg:justify-start">
                        <img
                            src="/career_academy_placeholder.png"
                            alt="Career Academy"
                            className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[450px]"
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col w-full">
                        <div className="inline-block">
                            <span className="bg-[#3A56D4] text-white text-[10px] font-bold px-2 py-0.5 rounded-[3px] tracking-wider uppercase">
                                CAREER ACADEMY
                            </span>
                        </div>

                        <h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#111827] leading-[1.2] mt-4">
                            Prepare your students for in-demand jobs
                        </h2>

                        <p className="mt-4 text-[#374151] text-[15px] md:text-[16px] leading-relaxed">
                            Strengthen student employability with skills training from the world's leading companies.
                        </p>

                        <p className="mt-5 md:mt-6 text-[#111827] text-[14px] font-medium">
                            With Career Academy, enable your students to:
                        </p>

                        <ul className="mt-3 md:mt-4 space-y-2.5">
                            {[
                                "Earn a Professional Certificate designed to get them job-ready",
                                "Gain common job skills employers demand",
                                "Showcase skill mastery with a portfolio of work",
                                "Explore a range of in-demand roles across industries"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2.5">
                                    <div className="mt-0.5 shrink-0">
                                        <Check className="w-[16px] h-[16px] text-[#0056D2]" strokeWidth={3} />
                                    </div>
                                    <span className="text-[14px] text-[#374151] leading-snug">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 md:mt-8">
                            <a href="#" className="inline-flex items-center gap-1.5 text-[#0056D2] font-semibold text-[14px] hover:underline transition-colors group">
                                Learn more about Career Academy
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default CareerAcademySection;