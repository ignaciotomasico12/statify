import { ExternalUrls, Copyrights, Image, ListProps } from "./commons"

export interface SavedShows extends ListProps {
    items: Shows[]
}

export interface Shows {
    added_at: string,
    show: Show
}

export interface Show {
    available_markets: string[],
    copyrights: Copyrights[],
    description: string,
    html_description: string,
    explicit: false,
    external_urls: ExternalUrls,
    href: string,
    id: string,
    images: Image[],
    is_externally_hosted: false,
    languages: string[],
    media_type: string,
    name: string,
    publisher: string,
    type: string,
    uri: string,
    total_episodes: 0
}
