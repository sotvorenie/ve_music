import {Genre} from "@/types/genre.ts";
import {Artist} from "@/types/artist.ts";

export interface TrackPreview {
    id: number
    name: string
    duration: number
    url: string
    previewUrl: string | null
    previewX480Url: string | null
    genreId: number

    artists: Artist[]
}

export interface Track {
    id: number
    name: string
    duration: number
    url: string
    auditionsCount: number
    likesCount: number
    previewUrl: string
    previewX480Url: string | null
    videoClipUrl: string | null
    isLiked: boolean
    genre: Genre

    artists: Artist[]

    segmentsCount: number
    bitrates: number[]
}