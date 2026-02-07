"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ExtendedSession } from "@/types/auth";
import { searchArtists } from "@/services/artists";
import { Artist } from "@/types/artists";
import { FiSearch, FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const ArtistSearch = () => {
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const t = useTranslations('app.home.userStats.artists');
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Artist[]>([]);
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
                    const data = await searchArtists(session.accessToken, query);
                    setResults(data.artists.items || []);
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
                <div className="absolute top-full mt-2 w-[280px] sm:w-full right-0 sm:left-0 bg-slate-50 dark:bg-[#121212] rounded-lg shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden z-50">
                    {isSearching ? (
                        <div className="p-4 text-center text-sm text-slate-500 dark:text-gray-400 animate-pulse">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col">
                            {results.map((artist) => (
                                <Link 
                                    key={artist.id}
                                    href={`/artist/${artist.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all border-b last:border-0 border-slate-100 dark:border-white/5 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-white/10 transition-transform group-hover:scale-110">
                                        <Image
                                            src={artist.images[2]?.url || artist.images[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100&auto=format&fit=crop"}
                                            alt={artist.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold truncate dark:text-gray-100 group-hover:text-primary transition-colors">
                                            {artist.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-gray-400 capitalize truncate">
                                            {artist.genres[0] || 'Artist'}
                                        </span>
                                    </div>
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

export default ArtistSearch;
