import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' }
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const currentLanguage = LANGUAGES.find(lang => lang.code === (i18n.resolvedLanguage || 'en')) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-400 text-[13px] px-2 py-1 rounded border border-gray-700 hover:text-white transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentLanguage.label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 12 12">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-[9999] overflow-hidden border border-gray-700">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full text-left px-4 py-2 text-[13px] transition-colors duration-150 flex items-center justify-between ${
                  (i18n.resolvedLanguage || 'en') === language.code
                    ? 'bg-gray-700 text-white font-medium'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                role="menuitem"
              >
                {language.label}
                {(i18n.resolvedLanguage || 'en') === language.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
