import { useTranslations } from "next-intl";
import ArtistsTabs from "../artists/artistsTabs";
import TracksTabs from "../tracks/tracksTabs";
import ArtistSearch from "../artists/artistSearch";
import PlaylistsList from "../playlists/playlistsList";
import TrackSearch from "../tracks/trackSearch";

interface UserStatsProps {
    selectedStats: 'artists' | 'shows' | 'tracks' | 'playlists';
}

export default function UserStats({selectedStats}: UserStatsProps) {
    const t = useTranslations('app.home.userStats');
    return (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 md:p-8 lg:p-10 w-full rounded-lg bg-slate-50 dark:bg-dark shadow-lg">
            <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-10">
                <div className="flex justify-start items-center gap-3 sm:gap-4">
                    <div className="h-6 sm:h-8 w-2 bg-primary rounded-xl"/>
                    <h2 className="text-xl sm:text-2xl capitalize">{t(`${selectedStats}.title`)}</h2>
                </div>
                {selectedStats === 'artists' && <ArtistSearch />}
                {selectedStats === 'tracks' && <TrackSearch />}
            </header>
            <div>
                {selectedStats && selectedStats === 'artists' &&
                    <ArtistsTabs /> 
                }
                {selectedStats && selectedStats === 'tracks' &&
                    <TracksTabs /> 
                }
                {selectedStats && selectedStats === 'playlists' &&
                    <PlaylistsList />
                }
            </div>
        </div>
    )
}