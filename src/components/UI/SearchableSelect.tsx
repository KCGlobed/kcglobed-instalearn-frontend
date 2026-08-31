import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    disabled = false,
    error = false,
    icon,
    className = "py-2.5 rounded-md",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Find the current selected option label
    const selectedOption = useMemo(() => {
        return options.find(opt => opt.value.toLowerCase() === value.toLowerCase());
    }, [options, value]);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search term when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 border transition-all cursor-pointer bg-white ${
                    disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''
                } ${
                    error ? 'border-red-500' : 'border-[#E9EAF0] focus-within:border-[#5624D0]'
                } ${isOpen ? 'ring-2 ring-[#5624D0]/20 border-[#5624D0]' : ''} ${className}`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {icon && <div className="text-gray-400 shrink-0 flex items-center">{icon}</div>}
                    <span className={`text-[14px] truncate ${!selectedOption ? 'text-gray-400' : 'text-[#1D2026] font-medium'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-[9999] w-full mt-1.5 bg-white border border-[#E9EAF0] rounded-md shadow-xl max-h-[260px] flex flex-col">
                    {/* Search Input */}
                    <div className="p-2 border-b border-[#E9EAF0] flex items-center gap-2 shrink-0 bg-gray-50/50">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-transparent text-[13px] outline-none text-[#1D2026] py-0.5"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                        {searchTerm && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchTerm('');
                                }}
                                className="p-0.5 hover:bg-gray-200 rounded"
                            >
                                <X className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                        )}
                    </div>

                    {/* Options list */}
                    <div className="overflow-y-auto max-h-[200px] py-1 divide-y divide-gray-50 no-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value.toLowerCase() === value.toLowerCase();
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-2.5 text-[14px] cursor-pointer transition-colors ${
                                            isSelected
                                                ? 'bg-[#F5F4FF] text-[#5624D0] font-bold'
                                                : 'text-[#1D2026] hover:bg-[#F8F9FB] hover:text-[#5624D0]'
                                        }`}
                                    >
                                        {opt.label}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-[13px] text-gray-400 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
