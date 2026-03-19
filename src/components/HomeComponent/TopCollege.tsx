
import {
    Cpu,
    Handshake,
    CreditCard,
    Code,
    User,
    FileText,
    Camera,
    Box,
    PenTool,
    Activity,
    Headphones,
    ArrowRight,
    Presentation
} from "lucide-react";

const categories = [
    { title: "Label", count: "63,476 Courses", icon: <Cpu className="w-8 h-8" />, bgColor: "bg-[#EBEBFF]", iconColor: "text-[#5624D0]", iconBg: "bg-white" },
    { title: "Business", count: "52,822 Courses", icon: <Handshake className="w-8 h-8" />, bgColor: "bg-[#E1F7E3]", iconColor: "text-[#23BD33]", iconBg: "bg-white" },
    { title: "Finance & Accounting", count: "33,841 Courses", icon: <CreditCard className="w-8 h-8" />, bgColor: "bg-[#FFF2E5]", iconColor: "text-[#FD8E1F]", iconBg: "bg-white" },
    { title: "IT & Software", count: "22,649 Courses", icon: <Code className="w-8 h-8" />, bgColor: "bg-[#FFEEE8]", iconColor: "text-[#FF4E55]", iconBg: "bg-white" },
    { title: "Personal Development", count: "20,126 Courses", icon: <User className="w-8 h-8" />, bgColor: "bg-white ", iconColor: "text-white", iconBg: "bg-[#5624D0]" },
    { title: "Office Productivity", count: "13,932 Courses", icon: <FileText className="w-8 h-8" />, bgColor: "bg-white border-[#E9EAF0] border", iconColor: "text-[#1D2026]", iconBg: "bg-[#F0F2F5]" },
    { title: "Marketing", count: "12,068 Courses", icon: <Presentation className="w-8 h-8" />, bgColor: "bg-[#EBEBFF]", iconColor: "text-white", iconBg: "bg-[#A14EBF]" },
    { title: "Photography & Video", count: "6,196 Courses", icon: <Camera className="w-8 h-8" />, bgColor: "bg-white border-[#E9EAF0] border", iconColor: "text-[#1D2026]", iconBg: "bg-[#F0F2F5]" },
    { title: "Lifestyle", count: "2,736 Courses", icon: <Box className="w-8 h-8" />, bgColor: "bg-[#FFF2E5]", iconColor: "text-[#FD8E1F]", iconBg: "bg-white" },
    { title: "Design", count: "2,600 Courses", icon: <PenTool className="w-8 h-8" />, bgColor: "bg-[#FFEEE8]", iconColor: "text-[#FF4E55]", iconBg: "bg-white" },
    { title: "Health & Fitness", count: "1,678 Courses", icon: <Activity className="w-8 h-8" />, bgColor: "bg-[#E1F7E3]", iconColor: "text-[#23BD33]", iconBg: "bg-white" },
    { title: "Music", count: "959 Courses", icon: <Headphones className="w-8 h-8" />, bgColor: "bg-[#FFF2E5]", iconColor: "text-[#FD8E1F]", iconBg: "bg-white" },
];

const TopCollege = () => {
    return (
        <section className="w-full bg-[#F5F7FA] py-20 px-6">
            <div className="max-w-[1320px] mx-auto">
                <h2 className="font-bold text-[#1D2026] mb-10 lg:text-center md:text-left">Browse Top Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`${cat.bgColor} p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all duration-300 group min-h-[100px]`}
                        >
                            <div className={`${cat.iconBg} w-[60px] h-[60px] min-w-[60px] flex items-center justify-center ${cat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                {cat.icon}
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                                <h3 className="font-semibold text-[#1D2026] truncate leading-tight mb-1">{cat.title}</h3>
                                <p className="text-[#8C94A3] font-medium leading-none">{cat.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-center gap-2 text-[#4E5566] text-[16px]">
                    <p>We have more category and subcategory.</p>
                    <a href="#" className="text-[#5624D0] font-semibold flex items-center gap-1.5 hover:underline transition-all group">
                        Browse All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TopCollege;