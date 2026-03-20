import { Facebook, Instagram, Linkedin, Twitter, Youtube, ChevronDown } from "lucide-react";

/**
 * Footer component for InstaLearn
 * Matches the Figma design:
 * - Dark background
 * - 5 Column layout (Brand + 4 Link columns)
 * - Social icons with square backgrounds
 * - Bottom bar with copyright and language selector
 */
const Footer = () => {
    const skillLinks = [
        "Development",
        "Finance & Accounting",
        "Design",
        "Business",
        "Data Science",
    ];

    const courseLinks = [
        "Business Analytics",
        "Business Analytics",
        "Business Analytics",
        "Business Analytics",
        "Business Analytics",
    ];

    const resourceLinks = [
        "Blogs",
        "Success Story",
        "Career Guidance",
        "Help Centre",
        "Contact Support",
    ];

    const companyLinks = [
        "About Us",
        "Partner",
        "Terms & Condition",
        "Careers",
        "Privacy Policy",
    ];

    return (
        <>
            <footer className="bg-[#1B1E22] border-t border-[#363B47] text-white pt-24">
                <div className="container mx-auto px-4">
                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[424px_1fr_1fr_1fr_1fr] gap-x-8 gap-y-12 mb-20">

                        {/* Branding Column - Precise Figma dimensions (424px width, ~168px height) */}
                        <div className="flex flex-col w-full lg:max-w-[424px]">
                            <div className="mb-4">
                                <img
                                    src="/instalogo_white.png"
                                    alt="KC Globed"
                                    className="h-10 w-auto"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/150x40?text=KC+Globed&bg=1b1e22&fontcolor=ffffff';
                                    }}
                                />
                            </div>
                            <p className="text-[#8C94A3] text-[13px] leading-[22px] mb-8 max-w-[280px]">
                                Learn new skills, advance your career
                            </p>

                            {/* Social Icons row */}
                            <div className="flex items-center gap-2">
                                <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm">
                                    <Facebook className="w-4.5 h-4.5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm">
                                    <Instagram className="w-4.5 h-4.5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm ">
                                    <Linkedin className="w-4.5 h-4.5 text-white fill-white" />
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm">
                                    <Twitter className="w-4.5 h-4.5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm">
                                    <Youtube className="w-4.5 h-4.5 text-white" />
                                </a>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">Popular Skills</h4>
                            <ul className="flex flex-col gap-3">
                                {skillLinks.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">Top Courses</h4>
                            <ul className="flex flex-col gap-3">
                                {courseLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <a href="#" className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">Resources</h4>
                            <ul className="flex flex-col gap-3">
                                {resourceLinks.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">Company</h4>
                            <ul className="flex flex-col gap-3">
                                {companyLinks.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Full Width Border */}
                <div className="border-t border-[#363B47]/20 mt-10">
                    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[#8C94A3] text-[13px]">
                            © {new Date().getFullYear()} InstaLearn. All rights reserved.
                        </p>

                        {/* Language Selector */}
                        <div className="relative">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#242932]/30 border border-[#363B47] text-[#8C94A3] text-sm hover:border-[#8C94A3] transition-all min-w-[130px] justify-between">
                                English
                                <ChevronDown className="w-4 h-4 text-[#8C94A3]" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
