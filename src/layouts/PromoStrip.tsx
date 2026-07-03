import { useState, useEffect, useCallback } from "react";
import { getCampaignApi } from "../utils/service";
import PromoStripSkeleton from "../components/Loader/PromoStripSkeleton";

interface TimeLeft {
    days: number;
    hours: number;
    mins: number;
    secs: number;
}

interface CouponInfo {
    id: number;
    code: string;
}

interface CampaignData {
    id: number;
    title: string;
    display_text: string;
    start_time: string;
    end_time: string;
    status: boolean;
    created_at: string;
    coupon_info: CouponInfo | null;
}

interface CacheData {
    campaign: CampaignData | null;
    expiresAt: number;
}

interface PromoStripProps {
    endDate?: string;
    promoCode?: string;
    discountPercent?: number;
    ctaText?: string;
    ctaHref?: string;
    dismissible?: boolean;
}

const CACHE_KEY = "promo_campaign_cache";
const CACHE_DURATION = 2 * 60 * 1000;
const EMPTY_CACHE_DURATION = 30 * 1000;

const getDefaultEndDate = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString();
};

const calcTimeLeft = (endDate: string): TimeLeft => {
    const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
    };
};

const pad = (n: number) => String(n).padStart(2, "0");

const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="promo-time-box">
        <span className="promo-time-value">{pad(value)}</span>
        <span className="promo-time-label">{label}</span>
    </div>
);

const Dot = () => <span className="promo-dot">:</span>;

const PromoStrip = ({
    endDate,
    promoCode,
    discountPercent,
    ctaText = "AVAIL NOW",
    ctaHref = "/courses",
    dismissible = true,
}: PromoStripProps) => {
    const [campaign, setCampaign] = useState<CampaignData | null>(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);

    const hasOverrides = Boolean(promoCode || endDate);
    const activePromoCode = promoCode || campaign?.coupon_info?.code || "SUMMER26";
    const activeTitle = campaign?.title || (discountPercent ? `${discountPercent}% Off` : "40% Off");
    const activeSubText = campaign?.display_text || "Summer Sale is On!";
    const activeCtaText = ctaText;
    const activeCtaHref = ctaHref;
    const activeEndDate = endDate || campaign?.end_time || getDefaultEndDate();

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(activeEndDate));

    const loadCampaign = useCallback(async () => {
        if (hasOverrides) {
            setLoading(false);
            return;
        }

        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed: CacheData = JSON.parse(cached);
                if (parsed && typeof parsed.expiresAt === "number" && Date.now() < parsed.expiresAt) {
                    setCampaign(parsed.campaign);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.error(e);
        }

        try {
            const res = await getCampaignApi();
            if (res && res.success) {
                const campaignData = Array.isArray(res.data) ? res.data[0] : res.data;

                if (campaignData && campaignData.status && new Date(campaignData.end_time).getTime() > Date.now()) {
                    setCampaign(campaignData);
                    const expiry = Math.min(Date.now() + CACHE_DURATION, new Date(campaignData.end_time).getTime());
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ campaign: campaignData, expiresAt: expiry }));
                } else {
                    setCampaign(null);
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ campaign: null, expiresAt: Date.now() + EMPTY_CACHE_DURATION }));
                }
            } else {
                setCampaign(null);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ campaign: null, expiresAt: Date.now() + EMPTY_CACHE_DURATION }));
            }
        } catch (error) {
            console.error(error);
            setCampaign(null);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ campaign: null, expiresAt: Date.now() + EMPTY_CACHE_DURATION }));
        } finally {
            setLoading(false);
        }
    }, [hasOverrides]);

    const tick = useCallback(() => {
        const remaining = calcTimeLeft(activeEndDate);
        setTimeLeft(remaining);

        const diff = new Date(activeEndDate).getTime() - Date.now();
        if (diff <= 0) {
            setVisible(false);
        }
    }, [activeEndDate]);

    useEffect(() => {
        loadCampaign();
    }, [loadCampaign]);

    useEffect(() => {
        setTimeLeft(calcTimeLeft(activeEndDate));
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [activeEndDate, tick]);

    const isExpired = new Date(activeEndDate).getTime() <= Date.now();

    if (loading) {
        return <PromoStripSkeleton dismissible={dismissible} />;
    }

    if (!visible || isExpired || (!hasOverrides && !campaign)) {
        return null;
    }

    return (
        <div className="promo-strip" role="banner" aria-label="Promotional offer">
            <div className="promo-inner">
                <span className="promo-emoji" aria-hidden="true">🌴</span>
                <div className="promo-text-block">
                    <span className="promo-offer-text">
                        🔥 {activeTitle}, Use{" "}
                        <strong className="promo-code">{activePromoCode}</strong>
                    </span>
                    <span className="promo-sub-text">
                        🏷️ {activeSubText}
                    </span>
                </div>

                <div className="promo-divider" />

                <div className="promo-countdown" aria-label="Offer countdown timer">
                    <TimeBox value={timeLeft.days} label="DAYS" />
                    <Dot />
                    <TimeBox value={timeLeft.hours} label="HOURS" />
                    <Dot />
                    <TimeBox value={timeLeft.mins} label="MINS" />
                    <Dot />
                    <TimeBox value={timeLeft.secs} label="SECS" />
                </div>

                <div className="promo-divider" />

                <a
                    href={activeCtaHref}
                    className="promo-cta"
                    aria-label={`${activeCtaText} - ${activeTitle} with code ${activePromoCode}`}
                >
                    {activeCtaText}
                </a>
            </div>

            {dismissible && (
                <button
                    onClick={() => setVisible(false)}
                    className="promo-close"
                    aria-label="Dismiss promotional banner"
                    title="Dismiss"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default PromoStrip;
