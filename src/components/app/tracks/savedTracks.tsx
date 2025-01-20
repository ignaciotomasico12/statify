"use client";

import { getCurrentUserSavedTracks } from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import type { SavedTracks } from "@/types/tracks";
import { FiHeart } from "react-icons/fi";
import StatsCard from "../common/statsCard";
import { useTranslations } from "next-intl";

interface Props {
    setStats: React.Dispatch<React.SetStateAction<'artists' | 'shows' | 'tracks' | 'playlists'>>;
}

export default function SavedTracks({setStats}: Props) {
    const queryClient = useQueryClient();
    const t = useTranslations('app.home.userCard');
    const { data: session  } = useSession() as { data: ExtendedSession | null };

    const { data } = useQuery<SavedTracks>({
        queryKey: ["savedTracks"],
        queryFn: () => {
            if (session && session.accessToken) {
                return getCurrentUserSavedTracks(session.accessToken as string)
            }
            return Promise.reject("No session available");
        },
        initialData: () => {
          const cachedData = queryClient.getQueryData<SavedTracks>([
            "savedTracks",
          ]);
          return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            {data && (
                <div onClick={() => setStats("tracks")}>
                    <StatsCard title={t('stats.tracks')} value={data.total} icon={<FiHeart className="h-8 w-8"/>} />
                </div>
            )}
        </>
    )
}