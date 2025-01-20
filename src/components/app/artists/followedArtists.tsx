"use client";

import { getCurrentUserFollowedArtists } from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Artisticon from "@/components/ui/icons/artist";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import type { FollowedArtists } from "@/types/artists";
import StatsCard from "../common/statsCard";
import { useTranslations } from "next-intl";

interface Props {
    setStats: React.Dispatch<React.SetStateAction<'artists' | 'shows' | 'tracks' | 'playlists'>>;
}

export default function FollowedArtists({setStats}: Props) {
    const queryClient = useQueryClient();
     const t = useTranslations('app.home.userCard');
    const { data: session  } = useSession() as { data: ExtendedSession | null };

    const { data } = useQuery<FollowedArtists>({
        queryKey: ["followed_artists"],
        queryFn: () => {
            if (session && session.accessToken) {
                return getCurrentUserFollowedArtists(session.accessToken as string);
            }
            return Promise.reject("No session available");
        },
        initialData: () => {
          const cachedData = queryClient.getQueryData<FollowedArtists>([
            "followed_artists",
          ]);
          return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            {data && (
                <div onClick={() => setStats("artists")}>
                    <StatsCard title={t('stats.artists')} value={data.artists.total} icon={<Artisticon className="h-8 w-8"/>} />
                </div>
            )}
        </>
    )
}