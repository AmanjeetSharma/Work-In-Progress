import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function NavButton({ to = "#", children, className = "", ...props }) {
    return (
        <Link
            to={to}
            className={twMerge(
                "relative overflow-hidden group",
                "text-zinc-200 hover:text-white",
                "bg-gradient-to-br from-gray-900/80 to-gray-800/80",
                "border border-gray-700/50 hover:border-gray-600/70",
                "rounded-lg py-2 px-6",
                "shadow-[3px_3px_5px_rgba(0,0,0,0.5)]", // Slight shadow on right & bottom
                "hover:shadow-[4px_4px_7px_rgba(0,0,0,0.6)]", // Slightly stronger on hover
                "backdrop-blur-sm",
                "transition-all duration-300 ease-out",
                "transform hover:-translate-y-0.5",
                "active:translate-y-0 active:scale-95",
                className
            )}
            {...props}
        >
            {/* Animated background highlight on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Glass edge highlights */}
            <span className="absolute inset-0 rounded-lg shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5)]" />

            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </Link>
    );
}
