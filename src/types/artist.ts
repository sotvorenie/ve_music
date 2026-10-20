import {PaginationMeta} from "@/types/paginationMeta.ts";


export interface Artist {
    id: number
    name: string
    avatarUrl: string | null
}

export interface ArtistsResponse extends PaginationMeta {
    artists: Artist[]
}