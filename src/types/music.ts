import {Genre} from "./genre.ts";
import {Artist} from "./artist.ts";
import {BasePagination} from "./BasePagination.ts";

export interface MusicForList {
    id: number
    name: string
    duration: number
    previewUrl: string | null

    genre: Genre
    artists: Artist[]
}

export interface Music {
    id: number
    name: string
    duration: number
    url: string
    auditionsCount: number
    likesCount: number
    previewUrl: string
    videoClipUrl: string | null
    isLiked: boolean

    artists: Artist[]
}

export interface MusicList extends BasePagination{
    music: MusicForList[]
}