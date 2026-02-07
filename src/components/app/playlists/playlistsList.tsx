"use client";

import { useEffect, useState } from "react";
import { getCurrentUserPlaylists } from "@/services/users";
import { UserPlaylists } from "@/types/playlits";
import { ExtendedSession } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { PlaylistListItem } from "./playlistListItem";
import { useTranslations } from "next-intl";
import { PaginationProps } from "@/types/ui/pagination";
import Pagination from "@/components/ui/pagination";

export default function PlaylistsList() {
    const t = useTranslations('app.playlists');
    const { data: session  } = useSession() as { data: ExtendedSession | null };
    
    const [pagination, setPagination] = useState<PaginationProps>({
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
        offset: 0
    });

    const fetchPlaylists = async (): Promise<UserPlaylists> => {
        if (!session || !session.accessToken || !session.user?.id) {
            return Promise.reject("No session available");
        }
        return await getCurrentUserPlaylists(session.accessToken as string, session.user.id, pagination.pageSize, pagination.offset);
    };

    // Note: Spotify Playlists API for user playlists doesn't support offset directly in the standard 'me/playlists' endpoint simple call usually
    // But v1/users/{user_id}/playlists does support limit and offset.
    // Our service getCurrentUserPlaylists is calling v1/users/${userId}/playlists.
    // Let's check if we can pass limit/offset to it.

    const playlistsQuery = useQuery<UserPlaylists>({
        queryKey: ["userPlaylistsFull", pagination.currentPage, pagination.pageSize],
        queryFn: fetchPlaylists,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (playlistsQuery.data) {
            const data = playlistsQuery.data;
            setPagination((prev: PaginationProps) => ({
                ...prev,
                totalItems: data.total || 0,
                pages: Math.ceil((data.total || 0) / (data.limit || prev.pageSize))
            }));
        }
    }, [playlistsQuery.data, pagination.pageSize]);

    const isEmpty = !playlistsQuery.isLoading && playlistsQuery.data?.items.length === 0;

    return (
        <div>
            <div className="w-full relative">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <p className="text-xl font-medium text-gray-400">
                            {t('no_data_found')}
                        </p>
                    </div>
                ) : (
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-6 mt-4 max-h-[58rem] overflow-y-scroll pb-8 px-1`}>
                        {playlistsQuery.isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="w-full aspect-square bg-slate-200 dark:bg-dark-light animate-pulse rounded-md" />
                                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                </div>
                            ))
                        ) : playlistsQuery.data?.items.map((playlist, index) => ( 
                            <PlaylistListItem
                                key={playlist.id}
                                index={index}
                                playlist={playlist}
                                aspectRatio="square"
                                width={300}
                                height={300}
                                className="w-full"
                            />
                        ))}
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-dark to-[transparent] z-10 pointer-events-none"/>
            </div>
            <Pagination pagination={pagination} setPagination={setPagination} />
        </div>
    )
}
