import { ExternalUrls, Image, TrackArtist } from "./commons"

export interface Album {
    album_type: string,
    total_tracks: number,
    available_markets: string[],
    external_urls: ExternalUrls,
    href: string,
    id: string,
    images: Image[],
    name: string,
    release_date: string,
    release_date_precision: string,
    restrictions: {
        reason: string
    },
    type: string,
    uri: string,
    artists: TrackArtist[],
    album_group?: string,
}