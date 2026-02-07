"use client";

import { useEffect, useState } from "react";
import { getCurrentUserSavedTracks, getCurrentUserTopTracks } from "@/services/users";
import { SavedTracks, TopTracks, Track } from "@/types/tracks";
import { ExtendedSession } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { TrackListItem } from "./trackListItem";
import { PaginationProps } from "@/types/ui/pagination";
import Pagination from "@/components/ui/pagination";

interface TracksListProps {
    listType: 'liked' | 'top_last_month' | 'top_six_months' | 'top_all_time';
}

export default function TracksList({ listType }: TracksListProps) {
    const { data: session  } = useSession() as { data: ExtendedSession | null };
    
    const [pagination, setPagination] = useState<PaginationProps>({
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
        offset: 0
    });

    useEffect(() => {
        setPagination(prev => ({ ...prev, currentPage: 1, offset: 0 }));
    }, [listType]);

    const fetchTracks = async (): Promise<SavedTracks | TopTracks> => {
        if (!session || !session.accessToken) {
            return Promise.reject("No session available");
        }

        switch (listType) {
            case 'liked':
                return await getCurrentUserSavedTracks(session.accessToken as string, pagination.pageSize, pagination.offset);
            case 'top_last_month':
                return await getCurrentUserTopTracks(session.accessToken as string, 'short_term', pagination.pageSize, pagination.offset);
            case 'top_six_months':
                return await getCurrentUserTopTracks(session.accessToken as string, 'medium_term', pagination.pageSize, pagination.offset);
            case 'top_all_time':
                return await getCurrentUserTopTracks(session.accessToken as string, 'long_term', pagination.pageSize, pagination.offset);
            default:
                return Promise.reject("Invalid list type");
        }
    };

    const tracksQuery = useQuery<SavedTracks | TopTracks>({
        queryKey: [`tracks_${listType}`, listType, pagination.offset, pagination.pageSize],
        queryFn: fetchTracks,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (tracksQuery.data) {
            const data = tracksQuery.data;
            setPagination((prev: PaginationProps) => ({
                ...prev,
                totalItems: data.total || 0,
                pages: Math.ceil((data.total || 0) / (data.limit || prev.pageSize))
            }));
        }
    }, [tracksQuery.data, pagination.pageSize]);

    const tracks: Track[] = tracksQuery.data ? 
        (listType === 'liked' 
            ? (tracksQuery.data as SavedTracks).items.map(item => item.track)
            : (tracksQuery.data as TopTracks).items)
        : [];

    const isEmpty = !tracksQuery.isLoading && tracks.length === 0;

    return (
        <div>
            <div className="w-full relative">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <p className="text-xl font-medium text-gray-400">
                           No se han encontrado canciones
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 mt-4 max-h-[58rem] overflow-y-scroll pb-8 px-1 pr-2">
                        {tracksQuery.isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-2">
                                    <div className="w-6 h-4 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-dark-light animate-pulse rounded shadow-sm" />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 w-1/3 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                    </div>
                                    <div className="w-10 h-3 bg-slate-200 dark:bg-dark-light animate-pulse rounded" />
                                </div>
                            ))
                        ) : tracks.map((track, index) => ( 
                            <TrackListItem
                                key={track.id + index}
                                index={pagination.offset + index}
                                track={track}
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
