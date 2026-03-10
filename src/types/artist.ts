import {BasePagination} from "./BasePagination.ts";

export interface Artist {
    id: number
    name: string
    avatar: string | null
}

export interface ArtistsList extends BasePagination {
    artists: Artist[]
}