import { BookOpen, Bell, FileText, Star, Wrench } from "lucide-react";

const TABS = ["Overview", "Notes", "Announcements", "Reviews", "Learning tools", "Certificate"] as const;

interface CourseTabsProps {
  active: string;
  setActive: (tab: string) => void;
}

export default function CourseTabs({ active, setActive }: CourseTabsProps) {
  return (
    <div className="flex items-center gap-8 border-b border-[#d1d7dc]">
      {TABS.map((tab) => {
        const isActive = active === tab;

        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative py-3 text-sm font-bold transition-all shrink-0 ${isActive
                ? "text-[#2d2f31]"
                : "text-[#6a6f73] hover:text-[#2d2f31]"
              }`}
          >
            <span className="tracking-tight">{tab}</span>

            {/* Active Underline */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2d2f31]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { TABS };


