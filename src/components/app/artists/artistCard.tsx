"use client";

import Image from "next/image"
import Link from "next/link";
import { FiExternalLink, FiHeart} from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Artist } from "@/types/artists";
import { formatFollowers } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import useFollowArtist from "@/hooks/followArtist";

interface ArtistCardProps {
    artist: Artist;
    isFollowed: boolean;
}

export default function ArtistCard({artist, isFollowed}: ArtistCardProps) {
    const { data: session  } = useSession() as { data: ExtendedSession | null };

    const { handleFollowClick } = useFollowArtist({
        artist,
        isFollowed,
        token: session?.accessToken as string,
    });

    const t = useTranslations('app.artist');

    return (
        <div className="p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <header className="w-full flex justify-between items-center mb-10">
                <div className="flex justify-start items-center gap-4">
                    <div className="h-8 w-2 bg-primary rounded-xl"/>
                    <h1 className="text-2xl">{t('title')}</h1>
                </div>
                <Button variant="ghost" size="md">
                    <Link href={artist.external_urls.spotify} target="_blank" className="flex justify-between items-center gap-2">
                        <FiExternalLink className="w-8 h-8"/>
                        {t('show')}
                    </Link>
                </Button>
            </header>
            <div className="flex justify-start items-start gap-10 h-48">
                <div className="overflow-hidden rounded-md h-full">
                    <Image
                        src={artist.images[0].url}
                        alt={artist.name}
                        width={200}
                        height={200}
                        className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                    />
                </div>
                <div className="flex flex-col justify-between items-start gap-8 w-full h-full">
                    <div className="flex flex-col justify-start items-start gap-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{artist.name}</h2>
                            <MdVerified className="text-blue-500 w-6 h-6" title="Verified Artist" />
                        </div>
                        <div className="flex justify-start items-center gap-4 mb-2">
                            {artist.genres.map((genre, index) => ( 
                                <Badge key={index} className="capitalize">{genre}</Badge>
                            ))}
                        </div>
                        <Button variant="ghost" size="md" onClick={handleFollowClick}>
                            {isFollowed ? <FaHeart className="w-8 h-8"/> : <FiHeart className="w-8 h-8"/> }
                            {isFollowed ? t('followButton.unfollow') : t('followButton.follow')}
                        </Button>
                    </div>
                    <div className="w-full flex justify-start items-center gap-16 flex-wrap">
                        <div>
                            <h4 className="text-sm dark:text-gray-300 text-slate-600">{t('popularity')}</h4>
                            <p className="text-md dark:text-gray-400 text-slate-700">{artist.popularity}</p>
                        </div>
                        <div>
                            <h4 className="text-sm dark:text-gray-300 text-slate-600">{t('followers')}</h4>
                            <p className="text-md dark:text-gray-400 text-slate-700">{formatFollowers(artist.followers.total)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}