import {Genre} from "./genre.ts";
import {Artist} from "./artist.ts";
import {BasePagination} from "./BasePagination.ts";

export interface MusicForList {
    id: number
    name: string
    duration: number
    preview_url: string | null

    genre: Genre
    artists: Artist[]
}

export interface Music {
    id: number
    name: string
    duration: number
    audio_url: string
    auditions: number
    likes: number
    preview_url: string
    video_clip_url: string | null
    genre_id: number

    genre: Genre
    artists: Artist[]
}

export interface MusicList extends BasePagination{
    music: MusicForList[]
}