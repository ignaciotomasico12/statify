"use client";

import { getCurrentUserPlaylists } from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoAlbumsOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import type { UserPlaylists } from "@/types/playlits";
import StatsCard from "../common/statsCard";
import { useTranslations } from "next-intl";

interface Props {
    setStats: React.Dispatch<React.SetStateAction<'artists' | 'shows' | 'tracks' | 'playlists'>>;
}

export default function UserPlaylists({setStats}: Props) {
    const queryClient = useQueryClient();
    const t = useTranslations('app.home.userCard');
    const { data: session  } = useSession() as { data: ExtendedSession | null };

    const { data } = useQuery<UserPlaylists>({
        queryKey: ["userPlaylists"],
        queryFn: () => {
            if (session && session.accessToken) {
                return getCurrentUserPlaylists(session.accessToken as string, session.user?.id as string)
            }
            return Promise.reject("No session available");
        },
        initialData: () => {
          const cachedData = queryClient.getQueryData<UserPlaylists>([
            "userPlaylists",
          ]);
          return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            {data && (
                <div onClick={() => setStats("playlists")}>
                    <StatsCard title={t('stats.playlists')} value={data.total} icon={<IoAlbumsOutline className="h-8 w-8"/>} />
                </div>
            )}
        </>
    )
}