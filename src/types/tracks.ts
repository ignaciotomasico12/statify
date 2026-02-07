import { Album } from "./albums"
import { TrackArtist, ExternalUrls, ExternalIds, ListProps } from "./commons"

export interface SavedTracks extends ListProps {
    items: Tracks[]
}

export interface TopTracks extends ListProps {
    items: Track[]
}

export interface Tracks {
    added_at: string,
    track: Track
}

export interface Track {
    album: Album,
    artists: TrackArtist[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: ExternalIds,
    external_urls: ExternalUrls,
    href: string,
    id: string,
    is_playable: boolean,
    linked_from?: string,
    restrictions?: {
        reason: string
    },
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean
}
