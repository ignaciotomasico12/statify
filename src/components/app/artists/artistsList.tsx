"use client";

import { useEffect, useState } from "react";
import { getCurrentUserFollowedArtists, getCurrentUserFollowsArtist, getCurrentUserTopArtists } from "@/services/users";
import { TopArtists, Artists } from "@/types/artists";
import { ExtendedSession } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArtistListItem } from "./artistListItem";
import { useTranslations } from "next-intl";
import { PaginationProps } from "@/types/ui/pagination";
import Pagination from "@/components/ui/pagination";

interface ListProps {
    listType: 'followed' | 'top_last_month' | 'top_six_months' | 'top_all_time';
}

export default function ArtistsList({listType = 'followed'}: ListProps) {
    const t = useTranslations('app.artists');
    const queryClient = useQueryClient();
    const { data: session  } = useSession() as { data: ExtendedSession | null };
    
    const [pagination, setPagination] = useState<PaginationProps>({
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
        offset: 0
    });

    const [cursorMap, setCursorMap] = useState<Record<number, string | undefined>>({ 1: undefined });

    useEffect(() => {
        setPagination((prev: PaginationProps) => ({
            ...prev,
            currentPage: 1,
            offset: 0
        }));
        setCursorMap({ 1: undefined }); // Page 1 has no previous cursor
    }, [listType]);

    const fetchArtists = async (): Promise<Artists | TopArtists> => {
        if (!session || !session.accessToken) {
            return Promise.reject("No session available");
        }

        let artistsData: Artists | TopArtists;

        switch (listType) {
            case 'followed':
                const cursor = cursorMap[pagination.currentPage];
                const followedArtists = await getCurrentUserFollowedArtists(session.accessToken as string, pagination.pageSize, cursor);
                artistsData = followedArtists.artists;
                artistsData.items.map(artist => artist.followed = true);
                break;
            case 'top_last_month':
            case 'top_six_months':
            case 'top_all_time':
                const topArtists = await getCurrentUserTopArtists(session.accessToken as string, listType === 'top_last_month' ? 'short_term' : listType === 'top_six_months' ? 'medium_term' : 'long_term', pagination.pageSize, pagination.offset);
                const artistsIds = topArtists.items.map(artist => artist.id);
                const topArtistsFollowed = artistsIds.length > 0 
                    ? await getCurrentUserFollowsArtist(session.accessToken as string, artistsIds)
                    : [];
                topArtists.items.map((artist, index) => artist.followed = topArtistsFollowed[index]);
                artistsData = topArtists;
                break;
            default:
                return Promise.reject("Invalid list type");
        }

        return artistsData;
    };

    const artistsQuery = useQuery<Artists | TopArtists>({
        queryKey: [`${listType}_artists`, listType, pagination.currentPage, pagination.pageSize],
        queryFn: fetchArtists,
        initialData: () => {
            const cachedData = queryClient.getQueryData<Artists | TopArtists>([`${listType}_artists`, listType ]);
            return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (artistsQuery.data) {
            const data = artistsQuery.data as Artists | TopArtists;
            const total = listType === 'followed' ? (data as Artists).total : (data as TopArtists).total;
            const limit = listType === 'followed' ? (data as Artists).limit : (data as TopArtists).limit;

            setPagination((prev: PaginationProps) => ({
                ...prev,
                totalItems: total || 0,
                pages: Math.ceil((total || 0) / (limit || prev.pageSize))
            }));

            // If we are in followed list, store the cursor for the NEXT page
            const afterCursor = listType === 'followed' && 'cursors' in data ? data.cursors?.after : undefined;
            if (afterCursor) {
                setCursorMap((prev: Record<number, string | undefined>) => ({
                    ...prev,
                    [pagination.currentPage + 1]: afterCursor
                }));
            }
        }
    }, [artistsQuery.data, listType, pagination.currentPage]);

    const isEmpty = !artistsQuery.isLoading && artistsQuery.data?.items.length === 0;

    return (
        <div>
            <div className="w-full relative">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <p className="text-xl font-medium text-gray-400">
                            {t('no_data_found')}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {t('try_different_period')}
                        </p>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 max-h-[58rem] overflow-y-scroll pb-8 ${(pagination.pageSize >= 20 && pagination.totalItems >= 20) ? 'pr-4' : ''}`}>
                        {artistsQuery.isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="w-full aspect-square bg-gray-800/10 animate-pulse rounded-md" />
                            ))
                        ) : artistsQuery.data?.items.map((artist, index) => ( 
                            <ArtistListItem
                                key={artist.id}
                                pagination={pagination}
                                index={index}
                                artist={artist}
                                listType={listType}
                                token={session?.accessToken as string}
                                className="w-full"
                                aspectRatio="square"
                                width={300}
                                height={300}
                                isLink
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