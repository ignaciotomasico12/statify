import { Image, ExternalUrls, Total, ListProps } from './commons';

export interface UserPlaylists extends ListProps {
    items: Playlist[]
}

export interface Playlist {
    collaborative: boolean,
    description: string,
    external_urls: ExternalUrls,
    href: string,
    id: string,
    images: Image[],
    name: string,
    owner: PlaylistOwner,
    public: boolean,
    snapshot_id: string,
    tracks: Total,
    type: string,
    uri: string
}

export interface PlaylistOwner {
    external_urls: ExternalUrls,
    followers: Total,
    href: string,
    id: string,
    type: string,
    uri: string,
    display_name: string
}