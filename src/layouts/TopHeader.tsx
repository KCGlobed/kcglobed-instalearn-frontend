import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/UI/LanguageSelector';
import { NavLink } from "react-router-dom";

const TopHeader = () => {
    const { t } = useTranslation();
    return (
        <div>
            <nav className="bg-dark px-6 h-12 flex items-center justify-between">
                {/* Left: Logo + Nav Links */}
                <div className="flex items-center gap-8 h-full">
                    {/* Logo */}
                    {/* <div className="w-7 h-7 bg-blue-500 rounded-md" /> */}

                    {/* Nav Links */}
                    <div className="flex items-center gap-6 h-full">
                        <NavLink to="/" className={({ isActive }) => `h-full flex items-center text-[13px] transition-colors border-b-[3px] ${isActive ? 'text-white border-white font-semibold' : 'text-gray-400 border-transparent font-medium hover:text-white hover:border-white'}`}>{t('nav.home', 'Home')}</NavLink>

                        <NavLink to="/courses" className={({ isActive }) => `h-full flex items-center text-[13px] transition-colors border-b-[3px] ${isActive ? 'text-white border-white font-semibold' : 'text-gray-400 border-transparent font-medium hover:text-white hover:border-white'}`}>{t('nav.courses', 'Courses')}</NavLink>

                        <NavLink to="/campus" className={({ isActive }) => `h-full flex items-center text-[13px] transition-colors border-b-[3px] ${isActive ? 'text-white border-white font-semibold' : 'text-gray-400 border-transparent font-medium hover:text-white hover:border-white'}`}>{t('nav.forInstitution', 'For Institution')}</NavLink>


                        {/* <a href="/my-learning" className="text-gray-400 text-sm hover:text-white transition-colors">My Learning</a> */}
                    </div>
                </div>

                {/* Right: Currency + Language */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-gray-400 text-[13px] px-2 py-1 rounded border border-gray-700 hover:text-white transition-colors">
                        INR
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button className="flex items-center gap-1 text-gray-400 text-[13px] px-2 py-1 rounded border border-gray-700 hover:text-white transition-colors">
                        English
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <LanguageSelector />
                </div>
            </nav>
        </div>
    )
}

export default TopHeader