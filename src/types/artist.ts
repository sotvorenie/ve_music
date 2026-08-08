import {BasePagination} from "./BasePagination.ts";

export interface Artist {
    id: number
    name: string
    avatarUrl: string | null
}

export interface ArtistsList extends BasePagination {
    artists: Artist[]
}