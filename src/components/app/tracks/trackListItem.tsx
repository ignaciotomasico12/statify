"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Track } from "@/types/tracks";
import { msToTime } from "@/lib/utils";

interface TrackListItemProps {
    track: Track;
    index: number;
}

export function TrackListItem({ track, index }: TrackListItemProps) {
    if (!track) return null;

    return (
        <Link 
            href={track.external_urls.spotify}
            target="_blank"
            className="flex items-center gap-4 p-2 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all group"
        >
            <span className="w-6 text-sm text-slate-400 font-medium text-center group-hover:text-primary transition-colors">
                {index + 1}
            </span>
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded shadow-sm">
                <Image
                    src={track.album.images[0]?.url || "https://images.unsplash.com/photo-1514525253361-bee8a4874a73?q=80&w=100&auto=format&fit=crop"}
                    alt={track.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold truncate dark:text-gray-100 group-hover:text-primary transition-colors">
                    {track.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400 truncate group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors">
                    {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-gray-400 tabular-nums font-medium group-hover:text-slate-600 dark:group-hover:text-gray-300 transition-colors">
                {msToTime(track.duration_ms)}
            </span>
        </Link>
    );
}
