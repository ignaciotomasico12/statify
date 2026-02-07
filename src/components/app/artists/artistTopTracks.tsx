"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { ExtendedSession } from "@/types/auth";
import { getArtistTopTracks } from "@/services/artists";
import { ArtistTopTracks as ArtistTopTracksType } from "@/types/artists";
import Image from "next/image";
import { msToTime } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ArtistTopTracksProps {
    artistId: string;
}

const ArtistTopTracks = ({ artistId }: ArtistTopTracksProps) => {
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const t = useTranslations('app.artist');

    const { data, isLoading } = useQuery<ArtistTopTracksType>({
        queryKey: [`artist_top_tracks_${artistId}`, artistId],
        queryFn: async () => {
            if (!session || !session.accessToken) {
                throw new Error("No session available");
            }
            return await getArtistTopTracks(session.accessToken as string, artistId);
        },
        enabled: !!artistId && !!session?.accessToken,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return <div className="mt-8 animate-pulse bg-slate-100 dark:bg-dark-light h-64 rounded-lg w-full" />;
    }

    if (!data || data.tracks.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <div className="flex justify-start items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="h-6 sm:h-8 w-2 bg-primary rounded-xl" />
                <h2 className="text-xl sm:text-2xl font-semibold">{t('top_tracks')}</h2>
            </div>
            <div className="flex flex-col gap-1">
                {data.tracks.slice(0, 10).map((track, index) => (
                    <Link 
                        key={track.id} 
                        href={track.external_urls.spotify}
                        target="_blank"
                        className="flex items-center gap-2 sm:gap-4 p-2 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors group"
                    >
                        <span className="w-4 sm:w-6 text-xs sm:text-sm text-slate-400 font-medium text-center flex-shrink-0">{index + 1}</span>
                        <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded shadow-sm flex-shrink-0">
                            <Image
                                src={track.album.images[0]?.url || ""}
                                alt={track.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-semibold truncate dark:text-gray-100 group-hover:text-primary transition-colors">{track.name}</span>
                            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 truncate">{track.album.name}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-400 dark:text-gray-400 tabular-nums flex-shrink-0">
                            {msToTime(track.duration_ms)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ArtistTopTracks;
