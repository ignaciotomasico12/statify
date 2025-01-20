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
        <div className="p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <header className="w-full flex justify-between items-center mb-10">
                <div className="flex justify-start items-center gap-4">
                    <div className="h-8 w-2 bg-primary rounded-xl"/>
                    <h1 className="text-2xl">{t('title')}</h1>
                </div>
                <Button variant="ghost" size="md">
                    <Link href={user.spotifyUrl} target="_blank" className="flex justify-between items-center gap-2">
                        <FiExternalLink className="w-8 h-8"/>
                        {t('spotifyLink')}
                    </Link>
                </Button>
            </header>
            <div className="flex justify-start items-start gap-10">
                <Avatar className="w-28 h-28 md:w-36 md:h-36 lg:w-42 lg:h-42">
                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-start items-start gap-8 w-full">
                    <div>
                        <h2 className="text-2xl">{user.name}</h2>
                        <p className="text-sm text-gray-500 italic">@{user.id}</p>
                    </div>
                    <div className="w-full flex justify-start items-center gap-16 flex-wrap">
                        <div>
                            <h4 className="text-sm dark:text-gray-300 text-slate-600">{t('details.product')}</h4>
                            <p className="text-md dark:text-gray-400 text-slate-700 capitalize">{user.accountType}</p>
                        </div>
                        <div>
                            <h4 className="text-sm dark:text-gray-300 text-slate-600">{t('details.email')}</h4>
                            <p className="text-md dark:text-gray-400 text-slate-700">{user.email}</p>
                        </div>
                        <div>
                            <h4 className="text-sm dark:text-gray-300 text-slate-600">{t('details.followers')}</h4>
                            <p className="text-md dark:text-gray-400 text-slate-700">{user.followers.total}</p>
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