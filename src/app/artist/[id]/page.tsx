"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExtendedSession } from "@/types/auth";
import { Artist } from '@/types/artists';
import { /*getArtistAlbums, getArtistRelatedArtists, getArtistTopTracks, */ getOneArtist } from "@/services/artists";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ArtistCard from "@/components/app/artists/artistCard";
import { getCurrentUserFollowsArtist } from '@/services/users';
import ArtistTopTracks from "@/components/app/artists/artistTopTracks";
import ArtistAlbums from "@/components/app/artists/artistAlbums";

interface ArtistPageProps {
    params: Promise<{ id: string }>;
}

interface FetchRespose {
    artist: Artist,
    isFollowedArtist: boolean[]
}

const ArtistPage = ({ params }: ArtistPageProps) => {
    const { data: session  } = useSession() as { data: ExtendedSession | null };
    const [uuid, setUuid] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        params.then(resolvedParams => {
            setUuid(resolvedParams.id);
        });
    }, [params]);

    const fetchArtist = async (): Promise<FetchRespose> => {
        if (!session || !session.accessToken) {
            return Promise.reject("No session available");
        }
        if(uuid) {
            const artist = await getOneArtist(session.accessToken as string, uuid as string);
            //const artistAlbums = await getArtistAlbums(session.accessToken as string, uuid as string);
            //const artistTopTracks = await getArtistTopTracks(session.accessToken as string, uuid as string);
            //const artistRealtedArtists = await getArtistRelatedArtists(session.accessToken as string, uuid as string);
            const isFollowedArtist = await getCurrentUserFollowsArtist(session.accessToken as string, [uuid])
            return {artist, isFollowedArtist};
        } else {
            return Promise.reject("No artist id available");
        }
    };

    const {data} = useQuery<FetchRespose>({
        queryKey: [`artist_${uuid}`, uuid],
        queryFn: fetchArtist,
        initialData: () => {
            const cachedData = queryClient.getQueryData<FetchRespose>([`artist_${uuid}`]);
            return cachedData ? cachedData : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="w-full">
            {data &&
                <>
                    <div className='mb-4'>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{data.artist.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <ArtistCard artist={data.artist} isFollowed={data.isFollowedArtist[0]}/>
                    {uuid && <ArtistAlbums artistId={uuid} />}
                    {uuid && <ArtistTopTracks artistId={uuid} />}
                </>
            }
        </div>
    );
}

export default ArtistPage;