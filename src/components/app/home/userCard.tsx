"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiExternalLink} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ExtendedUser } from "@/types/auth";
import FollowedArtists from "@/components/app/artists/followedArtists";
import UserPlaylists from "@/components/app/playlists/userPlaylists";
import SavedTracks from "@/components/app/tracks/savedTracks";
import SavedShows from "@/components/app/shows/savedShows";
import { useTranslations } from "next-intl";

interface UserCardProps {
    user: ExtendedUser;
    setStats: React.Dispatch<React.SetStateAction<'artists' | 'shows' | 'tracks' | 'playlists'>>;
}

export default function UserCard({user, setStats}: UserCardProps) {
    const t = useTranslations('app.home.userCard');
    return (
        <div className="p-3 sm:p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-10">
                <div className="flex justify-start items-center gap-3 sm:gap-4">
                    <div className="h-6 sm:h-8 w-2 bg-primary rounded-xl"/>
                    <h1 className="text-xl sm:text-2xl">{t('title')}</h1>
                </div>
                <Button variant="ghost" size="md" className="w-full sm:w-auto">
                    <Link href={user.spotifyUrl} target="_blank" className="flex justify-between items-center gap-2">
                        <FiExternalLink className="w-6 h-6 sm:w-8 sm:h-8"/>
                        {t('spotifyLink')}
                    </Link>
                </Button>
            </header>
            <div className="flex flex-col sm:flex-row justify-start items-start gap-6 sm:gap-10">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-42 lg:h-42 mx-auto sm:mx-0">
                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-start items-start gap-4 sm:gap-8 w-full">
                    <div className="text-center sm:text-left w-full">
                        <h2 className="text-xl sm:text-2xl">{user.name}</h2>
                        <p className="text-xs sm:text-sm text-gray-500 italic">@{user.id}</p>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 sm:gap-16 flex-wrap">
                        <div className="w-full sm:w-auto">
                            <h4 className="text-xs sm:text-sm dark:text-gray-300 text-slate-600">{t('details.product')}</h4>
                            <p className="text-sm sm:text-md dark:text-gray-400 text-slate-700 capitalize">{user.accountType}</p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <h4 className="text-xs sm:text-sm dark:text-gray-300 text-slate-600">{t('details.email')}</h4>
                            <p className="text-sm sm:text-md dark:text-gray-400 text-slate-700 break-all sm:break-normal">{user.email}</p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <h4 className="text-xs sm:text-sm dark:text-gray-300 text-slate-600">{t('details.followers')}</h4>
                            <p className="text-sm sm:text-md dark:text-gray-400 text-slate-700">{user.followers.total}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 w-full">
                <FollowedArtists setStats={setStats}/>
                <SavedTracks setStats={setStats}/>
                <SavedShows setStats={setStats}/>
                <UserPlaylists setStats={setStats}/>
            </div>
        </div>
    )
}