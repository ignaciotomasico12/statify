"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ExtendedSession } from "@/types/auth";
import { searchTracks } from "@/services/users";
import { Track } from "@/types/tracks";
import { FiSearch, FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { msToTime } from '@/lib/utils';

const TrackSearch = () => {
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const t = useTranslations('app.home.userStats.tracks');
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            if (session?.accessToken) {
                setIsSearching(true);
                try {
                    const data = await searchTracks(session.accessToken, query);
                    setResults(data.tracks.items || []);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setResults([]);
                } finally {
                    setIsSearching(false);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, session?.accessToken]);

    return (
        <div className="relative w-full max-w-[200px] sm:max-w-xs" ref={containerRef}>
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className="w-full pl-10 pr-10 py-2 bg-slate-200/50 dark:bg-white/5 border border-transparent focus:border-primary rounded-full text-xs sm:text-sm outline-none transition-all dark:text-gray-100 dark:placeholder-gray-500"
                    onFocus={() => query.trim() && setIsOpen(true)}
                />
                {query && (
                    <button 
                        onClick={() => { setQuery(""); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-[300px] sm:w-[400px] right-0 bg-slate-50 dark:bg-[#121212] rounded-lg shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden z-50">
                    {isSearching ? (
                        <div className="p-4 text-center text-sm text-slate-500 dark:text-gray-400 animate-pulse">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col">
                            {results.map((track) => (
                                <Link 
                                    key={track.id}
                                    href={track.external_urls.spotify}
                                    target="_blank"
                                    className="flex items-center gap-3 p-3 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all border-b last:border-0 border-slate-100 dark:border-white/5 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-slate-200 dark:border-white/10 transition-transform group-hover:scale-110">
                                        <Image
                                            src={track.album.images[2]?.url || track.album.images[0]?.url || ""}
                                            alt={track.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-semibold truncate dark:text-gray-100 group-hover:text-primary transition-colors">
                                            {track.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                                            {track.artists[0].name} • {track.album.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 tabular-nums">
                                        {msToTime(track.duration_ms)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-500 dark:text-gray-400">
                            {t('no_results')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackSearch;
