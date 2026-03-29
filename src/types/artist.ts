import {BasePagination} from "./BasePagination.ts";

export interface Artist {
    id: number
    name: string
    avatar_url: string | null
}

export interface ArtistsList extends BasePagination {
    artists: Artist[]
}