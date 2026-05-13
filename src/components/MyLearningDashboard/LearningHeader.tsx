import React, { useState } from 'react';
import { ChevronLeft, Share2, Star, Trophy, ChevronDown, MoreVertical, Award } from 'lucide-react';

const Header = ({
    courseTitle = "Advanced React Patterns & Architecture",
    progress = 68
}) => {
    const [showProgress, setShowProgress] = useState(false);

    const circumference = 81.68;
    const offset = circumference - (circumference * progress) / 100;

    return (
        <header style={{
            height: 56,
            background: '#0f0f11',
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            fontFamily: 'sans-serif'
        }}>

            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <IconBtn aria-label="Go back">
                    <ChevronLeft size={18} />
                </IconBtn>
                <div style={{ width: 0.5, height: 20, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{
                    fontSize: 13, fontWeight: 600, color: '#e8e8f0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320
                }}>
                    {courseTitle}
                </span>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

                {/* Rating */}
                <button style={ratingStyle}>
                    <Star size={14} fill="currentColor" />
                    <span>Rating</span>
                </button>

                {/* Progress */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowProgress(p => !p)}
                        style={progressBtnStyle}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="16" cy="16" r="13" stroke="#2a2a35" strokeWidth="2.5" fill="none" />
                            <circle
                                cx="16" cy="16" r="13"
                                stroke="#7f77dd" strokeWidth="2.5" fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <Trophy size={10} style={{ position: 'absolute', left: 19, color: '#a89fec' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#e8e8f0', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                {progress}% done
                            </span>
                            <ChevronDown size={10} style={{ color: '#6b6b80', transform: showProgress ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                    </button>

                    {showProgress && (
                        <div style={dropdownStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#e8e8f0' }}>Progress</span>
                                <Award size={16} style={{ color: '#a89fec' }} />
                            </div>
                            <div style={{ height: 4, background: '#242429', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                                <div style={{ height: '100%', width: `${progress}%`, background: '#7f77dd', borderRadius: 99 }} />
                            </div>
                            <p style={{ fontSize: 11, color: '#6b6b80', lineHeight: 1.5 }}>
                                Complete all lessons to earn your certificate.
                            </p>
                        </div>
                    )}
                </div>

                {/* Share */}
                <button style={shareStyle}>
                    <Share2 size={15} />
                    <span>Share</span>
                </button>

                {/* More */}
                <IconBtn aria-label="More options">
                    <MoreVertical size={18} />
                </IconBtn>
            </div>
        </header>
    );
};

const IconBtn = ({ children, ...props }: any) => (
    <button {...props} style={{
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8, border: 'none',
        background: 'transparent', color: '#6b6b80',
        cursor: 'pointer', transition: 'background 0.15s, color 0.15s'
    }}
        onMouseEnter={e => { e.currentTarget.style.background = '#242429'; e.currentTarget.style.color = '#e8e8f0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b6b80'; }}
    >
        {children}
    </button>
);

const ratingStyle = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '0 10px', height: 34, borderRadius: 8,
    border: 'none', background: 'transparent',
    color: '#f3ca8c', cursor: 'pointer',
    fontSize: 12, fontWeight: 700
};

const progressBtnStyle: any = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 8px', height: 34, borderRadius: 8,
    border: 'none', background: 'transparent',
    cursor: 'pointer', position: 'relative'
};

const dropdownStyle: any = {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
    width: 220, background: '#1a1a1f',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 16, zIndex: 200
};

const shareStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '0 12px', height: 34, borderRadius: 8,
    border: '0.5px solid rgba(255,255,255,0.08)',
    background: 'transparent', color: '#e8e8f0',
    cursor: 'pointer', fontSize: 12, fontWeight: 700
};

export default Header;