import { BookOpen, Bell, FileText, Star, Wrench } from "lucide-react";

const TABS = ["Overview", "Notes", "Announcements", "Reviews", "Learning tools"] as const;

interface CourseTabsProps {
  active: string;
  setActive: (tab: string) => void;
}

export default function CourseTabs({ active, setActive }: CourseTabsProps) {
  return (
    <div className="flex items-center gap-8 border-b border-[#3e4143]">
      {TABS.map((tab) => {
        const isActive = active === tab;
        
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative py-3 text-sm font-bold transition-colors shrink-0 ${
              isActive
                ? "text-white"
                : "text-[#9b9da2] hover:text-white"
            }`}
          >
            <span className="tracking-tight">{tab}</span>
            
            {/* Active Underline */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#a435f0]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { TABS };


