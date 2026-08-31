import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTopCoursesApi, getTopCategoriesApi } from "../utils/service";
import LanguageSelector from "../components/UI/LanguageSelector";

// Dark skeleton loading placeholder for footer links
const FooterLinkSkeleton = () => (
    <div className="animate-pulse space-y-3.5 mt-2">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className="h-3.5 bg-[#363B47]/60 rounded-sm animate-pulse"
                style={{ width: `${60 + (i % 3) * 15}%` }}
            />
        ))}
    </div>
);

/**
 * Footer component for InstaLearn
 * Matches the Figma design:
 * - Dark background
 * - 5 Column layout (Brand + 4 Link columns)
 * - Social icons with square backgrounds
 * - Bottom bar with copyright and language selector
 */
const Footer = () => {
    const { t } = useTranslation();
    const [topCategories, setTopCategories] = useState<any[]>([]);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getTopCategoriesApi()
            .then((res: any) => {
                if (!isMounted) return;
                const data = res?.data || res;
                if (Array.isArray(data)) {
                    setTopCategories(data.slice(0, 5));
                } else if (data && Array.isArray(data.data)) {
                    setTopCategories(data.data.slice(0, 5));
                } else {
                    setTopCategories([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching top categories:", err);
                if (isMounted) setTopCategories([]);
            })
            .finally(() => {
                if (isMounted) setLoadingCategories(false);
            });

        getTopCoursesApi()
            .then((res: any) => {
                if (!isMounted) return;
                const data = res?.data || res;
                if (Array.isArray(data)) {
                    setTopCourses(data.slice(0, 5));
                } else if (data && Array.isArray(data.data)) {
                    setTopCourses(data.data.slice(0, 5));
                } else {
                    setTopCourses([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching top courses:", err);
                if (isMounted) setTopCourses([]);
            })
            .finally(() => {
                if (isMounted) setLoadingCourses(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const skillLinks = [
        { id: 3, name: t('footer.development', 'Development') },
        { id: 2, name: t('footer.financeAccounting', 'Finance & Accounting') },
        { id: 26, name: t('footer.design', 'Design') },
        { id: 17, name: t('footer.business', 'Business') },
        { id: 3, name: t('footer.dataScience', 'Data Science') },
    ];

    const courseLinks = [
        { name: t('footer.pythonForDataScience', 'Python for Data Science'), path: "/courses" },
        { name: t('footer.webDevBootcamp', 'Web Development Bootcamp'), path: "/courses" },
        { name: t('footer.financialAnalysis', 'Financial Analysis & Valuation'), path: "/courses" },
        { name: t('footer.uiuxMasterclass', 'UI/UX Graphic Design Masterclass'), path: "/courses" },
        { name: t('footer.digitalMarketing', 'Digital Marketing Strategy'), path: "/courses" },
    ];

    const resourceLinks = [
        { name: t('footer.blogs', 'Blogs'), path: "/blogs" },
        { name: t('footer.successStory', 'Success Story'), path: "/coming-soon" },
        { name: t('footer.careerGuidance', 'Career Guidance'), path: "/coming-soon" },
        { name: t('footer.helpCentre', 'Help Centre'), path: "/help-centre" },
        { name: t('footer.support', 'Support'), path: "/support" },
    ];

    const companyLinks = [
        { name: "KC GlobEd", path: "https://www.kcglobed.com/" },
        { name: "GCC School", path: "https://www.gccschool.com/" },
        { name: t('footer.termsCondition', 'Terms & Condition'), path: "/terms-condition" },
        { name: t('footer.careers', 'Careers'), path: "/career" },
        { name: t('footer.privacyPolicy', 'Privacy Policy'), path: "/privacy-policy" },
    ];

    const socialLinks = [
        { icon: <Facebook className="w-4.5 h-4.5 text-white" />, url: "https://www.facebook.com" },
        { icon: <Instagram className="w-4.5 h-4.5 text-white" />, url: "https://www.instagram.com" },
        { icon: <Linkedin className="w-4.5 h-4.5 text-white fill-white" />, url: "https://www.linkedin.com" },
        { icon: <Twitter className="w-4.5 h-4.5 text-white" />, url: "https://twitter.com" },
        { icon: <Youtube className="w-4.5 h-4.5 text-white" />, url: "https://www.youtube.com" },
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
                                <Link to="/">
                                    <img
                                        src="/instalogo_white.png"
                                        alt="KC Globed"
                                        className="h-10 w-auto"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/150x40?text=KC+Globed&bg=1b1e22&fontcolor=ffffff';
                                        }}
                                    />
                                </Link>
                            </div>
                            <p className="text-[#8C94A3] text-[13px] leading-[22px] mb-8 max-w-[280px]">
                                {t('footer.learnNewSkills', 'Learn new skills, advance your career')}
                            </p>

                            {/* Social Icons row */}
                            <div className="flex items-center gap-2">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center bg-[#242932] hover:bg-[#6A67F1] transition-all rounded-sm"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">{t('footer.popularSkills', 'Popular Skills')}</h4>
                            <ul className="flex flex-col gap-3">
                                {loadingCategories ? (
                                    <FooterLinkSkeleton />
                                ) : (
                                    (topCategories.length > 0 ? topCategories : skillLinks).map((link: any, idx: number) => {
                                        const path = link.id ? `/categories/${link.id}` : (link.path || "/courses");
                                        return (
                                            <li key={link.id || idx}>
                                                <Link to={path} state={{ categoryName: link.name }} className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal line-clamp-1">{link.name}</Link>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">{t('footer.topCourses', 'Top Courses')}</h4>
                            <ul className="flex flex-col gap-3">
                                {loadingCourses ? (
                                    <FooterLinkSkeleton />
                                ) : (
                                    (topCourses.length > 0 ? topCourses : courseLinks).map((link: any, idx: number) => {
                                        const path = link.id ? `/courses/detail/${link.id}` : (link.path || "/courses");
                                        return (
                                            <li key={link.id || idx}>
                                                <Link to={path} className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal line-clamp-1">{link.name}</Link>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">{t('footer.resources', 'Resources')}</h4>
                            <ul className="flex flex-col gap-3">
                                {resourceLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white text-[12px] font-bold tracking-widest uppercase mb-6">{t('footer.company', 'Company')}</h4>
                            <ul className="flex flex-col gap-3">
                                {companyLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-[#8C94A3] hover:text-white text-[14px] transition-colors font-normal">{link.name}</Link>
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
                            © {new Date().getFullYear()} {t('footer.allRightsReserved', 'InstaLearn. All rights reserved.')}
                        </p>

                        {/* Language Selector */}
                        <div className="relative">
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
