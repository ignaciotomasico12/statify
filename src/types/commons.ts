export interface Image {
    url: string,
    height: number,
    width: number
}

export interface ExternalUrls {
    spotify: string
}

export interface ExternalIds {
    isrc: string,
    ean: string,
    upc: string
}

export interface Total {
    href: string,
    total: number
}

export interface ListProps {
    href: string,
    limit: number,
    next: string,
    total: number,
    offset?: number,
    previous?: string,
    cursors?: {
        after: string,
        before: string
    },
}

export interface Copyrights {
    text: string,
    type: string
}

export interface TrackArtist {
    external_urls: ExternalUrls,
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}