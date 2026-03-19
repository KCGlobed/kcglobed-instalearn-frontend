import React from "react";

type ButtonProps = {
    title: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "perple" | "light-gray";
    size?: "sm" | "md" | "lg";
    className?: string;
};

export default function Button({
    title,
    onClick,
    icon,
    variant = "primary",
    size = "md",
    className = "",
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`btn btn-${variant} btn-${size} ${className}`}
        >
            {title}
            {icon && <span className="btn-icon">{icon}</span>}
        </button>
    );
}