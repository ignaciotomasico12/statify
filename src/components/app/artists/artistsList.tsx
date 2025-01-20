"use client";

import { useState } from "react";
import { getCurrentUserFollowedArtists, getCurrentUserFollowsArtist, getCurrentUserTopArtists } from "@/services/users";
import { TopArtists, Artists } from "@/types/artists";
import { ExtendedSession } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArtistListItem } from "./artistListItem";
import { PaginationProps } from "@/types/ui/pagination";
import Pagination from "@/components/ui/pagination";

interface ListProps {
    listType: 'followed' | 'top_last_month' | 'top_six_months' | 'top_all_time';
}

export default function ArtistsList({listType = 'followed'}: ListProps) {
    const queryClient = useQueryClient();
    const { data: session  } = useSession() as { data: ExtendedSession | null };
    
    const [pagination, setPagination] = useState<PaginationProps>({
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
        offset: 0
    });

    const fetchArtists = async (): Promise<Artists | TopArtists> => {
        if (!session || !session.accessToken) {
            return Promise.reject("No session available");
        }

        let artistsData: Artists | TopArtists;

        switch (listType) {
            case 'followed':
                const followedArtists = await getCurrentUserFollowedArtists(session.accessToken as string, pagination.pageSize, pagination.offset);
                artistsData = followedArtists.artists;
                artistsData.items.map(artist => artist.followed = true);
                setPagination({
                    totalItems: followedArtists.artists.total,
                    pageSize: followedArtists.artists.limit,
                    currentPage: 1,
                    pages: Math.ceil(followedArtists.artists.total / followedArtists.artists.limit),
                    offset: 0
                });
                break;
            case 'top_last_month':
            case 'top_six_months':
            case 'top_all_time':
                const topArtists = await getCurrentUserTopArtists(session.accessToken as string, listType === 'top_last_month' ? 'short_term' : listType === 'top_six_months' ? 'medium_term' : 'long_term', pagination.pageSize, pagination.offset);
                const artistsIds = topArtists.items.map(artist => artist.id);
                const topArtistsFollowed = await getCurrentUserFollowsArtist(session.accessToken as string, artistsIds);
                topArtists.items.map((artist, index) => artist.followed = topArtistsFollowed[index]);
                artistsData = topArtists;
                setPagination({
                    totalItems: topArtists.total,
                    pageSize: topArtists.limit,
                    currentPage: 1,
                    pages: Math.ceil(topArtists.total / topArtists.limit),
                    offset: 0
                });
                break;
            default:
                return Promise.reject("Invalid list type");
        }

        return artistsData;
    };


    const artistsQuery = useQuery<Artists | TopArtists>({
        queryKey: [`${listType}_artists`, listType, pagination],
        queryFn: fetchArtists,
        initialData: () => {
            const cachedData = queryClient.getQueryData<Artists | TopArtists>([`${listType}_artists`, listType ]);
            return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div>
            <div className="w-full relative">
                <div className={`grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-h-[58rem] overflow-y-scroll pb-8 ${(pagination.pageSize >= 20 && pagination.totalItems >= 20) ? 'pr-4' : ''}`}>
                    {artistsQuery.data?.items.map((artist, index) => ( 
                        <ArtistListItem
                            key={index}
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
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-dark to-[transparent] z-10"/>
            </div>
            <Pagination pagination={pagination} setPagination={setPagination} />
        </div>
    )
}