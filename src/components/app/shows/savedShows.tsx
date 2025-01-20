"use client";

import { getCurrentUserSavedShows } from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import type { SavedShows } from "@/types/shows";
import { FiMic } from "react-icons/fi";
import StatsCard from "../common/statsCard";
import { useTranslations } from "next-intl";

interface Props {
    setStats: React.Dispatch<React.SetStateAction<'artists' | 'shows' | 'tracks' | 'playlists'>>;
}

export default function SavedShows({setStats}: Props) {
    const queryClient = useQueryClient();
    const t = useTranslations('app.home.userCard');
    const { data: session  } = useSession() as { data: ExtendedSession | null };

    const { data } = useQuery<SavedShows>({
        queryKey: ["savedShows"],
        queryFn: () => {
            if (session && session.accessToken) {
                return getCurrentUserSavedShows(session.accessToken as string)
            }
            return Promise.reject("No session available");
        },
        initialData: () => {
          const cachedData = queryClient.getQueryData<SavedShows>([
            "savedShows",
          ]);
          return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            {data && (
                <div onClick={() => setStats("shows")}>
                    <StatsCard title={t('stats.shows')} value={data.total} icon={<FiMic className="h-8 w-8"/>} />
                </div>
            )}
        </>
    )
}