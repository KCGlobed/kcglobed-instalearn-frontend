import { BookOpen, Bell, FileText, Star, Wrench } from "lucide-react";

const TABS = ["Overview", "Notes", "Announcements", "Reviews", "Learning tools"] as const;

const TAB_ICONS = {
  Overview: BookOpen,
  Notes: FileText,
  Announcements: Bell,
  Reviews: Star,
  "Learning tools": Wrench,
};

interface CourseTabsProps {
  active: string;
  setActive: (tab: string) => void;
}

export default function CourseTabs({ active, setActive }: CourseTabsProps) {
  return (
    <div className="flex items-center border-b border-gray-700/50">
      {TABS.map((tab) => {
        const Icon = TAB_ICONS[tab];
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold border-b-2 -mb-px transition ${
              active === tab
                ? "text-white border-violet-500"
                : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            <Icon size={13} />
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export { TABS };
