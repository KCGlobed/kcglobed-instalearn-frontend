import React from "react";

interface PromoStripSkeletonProps {
    dismissible?: boolean;
}

const PromoStripSkeleton = ({ dismissible = true }: PromoStripSkeletonProps) => {
    return (
        <div className="promo-strip" role="status" aria-label="Loading promotional offer">
            <div className="promo-inner">
                <div className="promo-skeleton-pulse" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div className="promo-skeleton-pulse" style={{ width: "120px", height: "12px" }} />
                    <div className="promo-skeleton-pulse" style={{ width: "80px", height: "10px" }} />
                </div>
                <div className="promo-divider" />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <div className="promo-skeleton-pulse" style={{ width: "30px", height: "24px" }} />
                    <span style={{ color: "#e5e7eb" }}>:</span>
                    <div className="promo-skeleton-pulse" style={{ width: "30px", height: "24px" }} />
                    <span style={{ color: "#e5e7eb" }}>:</span>
                    <div className="promo-skeleton-pulse" style={{ width: "30px", height: "24px" }} />
                </div>
                <div className="promo-divider" />
                <div className="promo-skeleton-pulse" style={{ width: "80px", height: "30px", borderRadius: "6px" }} />
            </div>
            {dismissible && (
                <div className="promo-close" style={{ color: "#e5e7eb", cursor: "default" }}>✕</div>
            )}
        </div>
    );
};

export default PromoStripSkeleton;
