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
        <div className="p-3 sm:p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-10">
                <div className="flex justify-start items-center gap-3 sm:gap-4">
                    <div className="h-6 sm:h-8 w-2 bg-primary rounded-xl"/>
                    <h1 className="text-xl sm:text-2xl">{t('title')}</h1>
                </div>
                <Button variant="ghost" size="md" className="w-full sm:w-auto">
                    <Link href={artist.external_urls.spotify} target="_blank" className="flex justify-between items-center gap-2">
                        <FiExternalLink className="w-6 h-6 sm:w-8 sm:h-8"/>
                        {t('show')}
                    </Link>
                </Button>
            </header>
            <div className="flex flex-col sm:flex-row justify-start items-start gap-6 sm:gap-10 min-h-[200px] sm:h-48">
                <div className="overflow-hidden rounded-md h-48 w-48 sm:h-full sm:w-auto mx-auto sm:mx-0 flex-shrink-0">
                    <Image
                        src={artist.images[0].url}
                        alt={artist.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-all hover:scale-105 aspect-square"
                    />
                </div>
                <div className="flex flex-col justify-between items-start gap-4 sm:gap-8 w-full h-full">
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                            <h2 className="text-xl sm:text-2xl font-bold break-words">{artist.name}</h2>
                            <MdVerified className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" title="Verified Artist" />
                        </div>
                        <div className="flex justify-start items-center gap-2 sm:gap-4 mb-2 flex-wrap">
                            {artist.genres.slice(0, 3).map((genre, index) => ( 
                                <Badge key={index} className="capitalize text-xs">{genre}</Badge>
                            ))}
                        </div>
                        <Button variant="ghost" size="md" onClick={handleFollowClick} className="w-full sm:w-auto">
                            {isFollowed ? <FaHeart className="w-6 h-6 sm:w-8 sm:h-8"/> : <FiHeart className="w-6 h-6 sm:w-8 sm:h-8"/> }
                            {isFollowed ? t('followButton.unfollow') : t('followButton.follow')}
                        </Button>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 sm:gap-16 flex-wrap">
                        <div className="w-full sm:w-auto">
                            <h4 className="text-xs sm:text-sm dark:text-gray-300 text-slate-600">{t('popularity')}</h4>
                            <p className="text-sm sm:text-md dark:text-gray-400 text-slate-700">{artist.popularity}</p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <h4 className="text-xs sm:text-sm dark:text-gray-300 text-slate-600">{t('followers')}</h4>
                            <p className="text-sm sm:text-md dark:text-gray-400 text-slate-700">{formatFollowers(artist.followers.total)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}