import React, { useCallback, useEffect } from 'react';
import { Copy, Facebook, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export interface SocialShareProps {
    url?: string;
    title?: string;
    description?: string;
    image?: string;
}

// Custom SVG icon for WhatsApp since Lucide doesn't have an exact brand match
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
)

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description, image }) => {
    // Determine sharing properties with fallbacks
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    
    // Create a plain text description from HTML or string
    const createPlainTextDesc = (htmlStr?: string) => {
        if (!htmlStr) return '';
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlStr;
        return tempElement.innerText.slice(0, 150) + (tempElement.innerText.length > 150 ? '...' : '');
    };
    const shareDescription = createPlainTextDesc(description);

    // Inject Open Graph meta tags dynamically for social preview images (WhatsApp, iMessage, etc.)
    useEffect(() => {
        const updateMetaTag = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        if (shareTitle) updateMetaTag('og:title', shareTitle);
        if (shareDescription) updateMetaTag('og:description', shareDescription);
        if (image) updateMetaTag('og:image', image);
        updateMetaTag('og:url', shareUrl);
        updateMetaTag('og:type', 'website');
        
        // Twitter cards
        updateMetaTag('twitter:card', 'summary_large_image');
        if (shareTitle) updateMetaTag('twitter:title', shareTitle);
        if (shareDescription) updateMetaTag('twitter:description', shareDescription);
        if (image) updateMetaTag('twitter:image', image);

    }, [shareTitle, shareDescription, image, shareUrl]);

    const handleCopyUrl = useCallback(() => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
    }, [shareUrl]);

    // Native Web Share API (primarily for mobile devices)
    const handleWebShare = useCallback(async () => {
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    url: shareUrl,
                });
                return true;
            } catch (err) {
                // Ignore AbortError which happens when the user cancels the share dialog
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
                return false; 
            }
        }
        return false;
    }, [shareUrl, shareTitle, shareDescription]);

    const openSharePopup = async (e: React.MouseEvent, type: string) => {
        e.preventDefault();
        
        // Try Web Share API first for mobile devices
        if (typeof navigator.share === 'function' && /Mobi|Android/i.test(navigator.userAgent)) {
             const shared = await handleWebShare();
             // If sharing succeeded, stop. If failed or not supported, continue to fallback popup
             if (shared) return; 
        }

        let link = '';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        const encodedDesc = encodeURIComponent(shareDescription);

        switch (type) {
            case 'facebook':
                link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                link = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'whatsapp':
                // WhatsApp API works for both mobile app and web
                link = `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`;
                break;
            case 'email':
                link = `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`;
                window.location.href = link;
                return; // For email we just trigger mailto:, no need for popup
        }

        if (link) {
            // Open a centered popup window for desktop experiences
            const width = 600;
            const height = 400;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            
            window.open(link, 'share-popup', `width=${width},height=${height},top=${top},left=${left}`);
        }
    };

    return (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button 
                onClick={handleCopyUrl} 
                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-all text-gray-600 shrink-0 min-w-[120px]"
            >
                <Copy className="w-4 h-4" /> Copy link
            </button>
            <div className="flex items-center gap-2">
                <button 
                    onClick={(e) => openSharePopup(e, 'facebook')} 
                    title="Share on Facebook"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-[#1877F2] hover:border-blue-100 hover:bg-blue-50 transition-all"
                >
                    <Facebook className="w-4 h-4" />
                </button>
                
                <button 
                    onClick={(e) => openSharePopup(e, 'twitter')} 
                    title="Share on Twitter/X"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-[#1DA1F2] hover:border-sky-100 hover:bg-sky-50 transition-all"
                >
                    <Twitter className="w-4 h-4" />
                </button>
                
                <button 
                    onClick={(e) => openSharePopup(e, 'whatsapp')} 
                    title="Share on WhatsApp"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-[#25D366] hover:border-green-100 hover:bg-green-50 transition-all"
                >
                    <WhatsAppIcon className="w-4 h-4" />
                </button>
                
                <button 
                    onClick={(e) => openSharePopup(e, 'email')} 
                    title="Share via Email"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-100 transition-all"
                >
                    <Mail className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SocialShare;
