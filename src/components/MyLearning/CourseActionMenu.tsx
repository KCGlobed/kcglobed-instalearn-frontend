import React, { useRef, useEffect } from 'react';
import { Share2, Plus, Star, Folder } from 'lucide-react';

interface ActionItem {
    icon: any;
    label: string;
    onClick?: (id?: any) => void;
}

interface CourseActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    courseId?: any;
    lists?: { name: string; selected: boolean }[];
    actions?: ActionItem[];
}

const CourseActionMenu: React.FC<CourseActionMenuProps> = ({
    isOpen,
    onClose,
    courseId,
    lists = [{ name: 'Python', selected: true }],
    actions = [
        { icon: Share2, label: 'Share', onClick: () => { } },
        { icon: Plus, label: 'Create New List', onClick: () => { } },
        { icon: Star, label: 'Unfavorite', onClick: () => { } },
        { icon: Folder, label: 'Archive', onClick: () => { } },
    ]
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="w-[240px] bg-white rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#F1F2F4] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
            {/* Lists Header Section */}
            <div className="px-5 pt-5 pb-2">
                <h4 className="text-[12px] font-bold text-[#6E7485] mb-3 tracking-wide uppercase">Lists</h4>
                {lists.map((list, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 group cursor-pointer">
                        <span className="text-[15px] text-[#1D2026] font-medium group-hover:text-[#5624D0] transition-colors">
                            {list.name}
                        </span>
                        {list.selected && (
                            <div className="w-5 h-5 text-[#10B981] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F1F2F4] mx-5 my-1" />

            {/* Actions Section */}
            <div className="px-2 py-2">
                {actions.map((item, idx) => (
                    <button
                        key={idx}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-[4px] hover:bg-[#F8F9FB] transition-colors group text-left"
                        onClick={() => item.onClick?.(courseId)}
                    >
                        <item.icon className="w-[18px] h-[18px] text-[#4E5566] group-hover:text-[#1D2026] transition-colors" />
                        <span className="text-[15px] text-[#4E5566] group-hover:text-[#1D2026] transition-colors font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CourseActionMenu;
