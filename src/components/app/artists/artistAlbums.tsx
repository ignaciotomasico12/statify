"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { ExtendedSession } from "@/types/auth";
import { getArtistAlbums } from "@/services/artists";
import { ArtistAlbums as ArtistAlbumsType } from "@/types/artists";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ArtistAlbumsProps {
    artistId: string;
}

const ArtistAlbums = ({ artistId }: ArtistAlbumsProps) => {
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const t = useTranslations('app.artist');

    const { data, isLoading } = useQuery<ArtistAlbumsType>({
        queryKey: [`artist_albums_${artistId}`, artistId],
        queryFn: async () => {
            if (!session || !session.accessToken) {
                throw new Error("No session available");
            }
            return await getArtistAlbums(session.accessToken as string, artistId);
        },
        enabled: !!artistId && !!session?.accessToken,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return <div className="mt-8 animate-pulse bg-slate-100 dark:bg-dark-light h-48 rounded-lg w-full" />;
    }

    if (!data || data.items.length === 0) {
        return null;
    }

    // Filter to show only unique album names to avoid duplicates (e.g., standard vs deluxe)
    const uniqueAlbums = data.items.reduce((acc: any[], current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <div className="mt-8 p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg font-sans">
            <div className="flex justify-start items-center gap-4 mb-6">
                <div className="h-8 w-2 bg-primary rounded-xl" />
                <h2 className="text-2xl font-semibold">{t('top_albums')}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {uniqueAlbums.slice(0, 6).map((album) => (
                    <Link 
                        key={album.id} 
                        href={album.external_urls.spotify}
                        target="_blank"
                        className="flex flex-col gap-3 group transition-transform hover:scale-105"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-md shadow-md">
                            <Image
                                src={album.images[0]?.url || ""}
                                alt={album.name}
                                fill
                                className="object-cover transition-all group-hover:brightness-75"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold truncate dark:text-gray-100 group-hover:text-primary transition-colors">
                                {album.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">
                                {new Date(album.release_date).getFullYear()}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ArtistAlbums;
