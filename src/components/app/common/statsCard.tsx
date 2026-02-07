import React from "react";

interface CardProps {
    title: string;
    value: number;
    icon: React.ReactElement;
}

export default function StatsCard({
    title,
    value,
    icon
}: CardProps) {
    return (
        <div className="rounded-lg bg-slate-200 dark:bg-gray p-3 sm:p-4 flex justify-start items-center gap-3 sm:gap-4 cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-foreground transition-all hover:scale-105">
            <div className="rounded-full p-3 sm:p-4 dark:bg-gray-foreground bg-slate-300 flex justify-center items-center flex-shrink-0">
                {icon}
            </div>
            <div className="flex flex-col justify-center items-start gap-1 sm:gap-2 min-w-0">
                <h5 className="text-lg sm:text-xl font-medium">{value}</h5>
                <p className="text-xs sm:text-sm truncate w-full">{title}</p>
            </div>
        </div>
    )
}