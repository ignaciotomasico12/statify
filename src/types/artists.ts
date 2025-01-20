import { Album } from './albums';
import { Image, ExternalUrls, Total, ListProps } from './commons';
import { Track } from './tracks';

export interface FollowedArtists {
    artists: Artists,
}

export interface TopArtists extends ListProps {
    items: Artist[]
}

export interface Artists extends ListProps {
    items: Artist[]
}

export interface Artist {
    external_urls: ExternalUrls,
    followers: Total,
    genres: string[],
    href: string,
    id: string,
    images: Image[],
    name: string,
    popularity: number,
    type: string,
    uri: string,
    followed?: boolean
}

export interface ArtistAlbums extends ListProps  {
    items: Album[]
}

export interface ArtistTopTracks {
    tracks: Track[]
}

export interface ArtistRelatedArtists {
    artists: Artist[]
}