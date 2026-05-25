import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const ShareCourse = ({ courseId }: { courseId?: number }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `http://localhost:5173/courses/detail/${courseId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col p-6 w-full max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-[#2d2f31] mb-6">
                Share this course
            </h2>

            <div className="flex items-center gap-3 w-full">
                <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-4 py-3 border border-[#2d2f31] rounded-sm text-[#2d2f31] text-sm bg-white
                               focus:outline-none focus:border-[#a435f0] transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <button
                    onClick={handleCopy}
                    className="px-6 py-3 bg-[#a435f0] text-white font-bold text-sm rounded-sm hover:bg-[#8710d8] 
                             active:scale-95 transition-all min-w-[100px] flex items-center justify-center gap-2"
                >
                    {copied ? (
                        <>
                            <Check size={16} strokeWidth={3} />
                            <span>Copied</span>
                        </>
                    ) : (
                        <span>Copy</span>
                    )}
                </button>
            </div>


        </div>
    );
};

export default ShareCourse;