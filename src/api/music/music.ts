import {Track, TrackResponse} from "@/types/music.ts";

import {apiGet} from "@api/index.ts";

export const apiGetMusicList = (
    name: string = '',
    artistId: number = -1,
    genreId: number = -1,
    page: number = 1,
    limit: number = 21
): Promise<TrackResponse> => {
    const params = new URLSearchParams({
        name,
        artist_id: String(artistId),
        genre_id: String(genreId),
        page: String(page),
        limit: String(limit),
    })

    return apiGet(`/music/list?${params}`);
}

export const apiGetMusic = (musicId: number): Promise<Track> => {
    return apiGet(`/music/${musicId}`);
}

export const apiGetRandomMusic = (
    excludeId: number,
    name: string = '',
    artistId: number = -1,
    genreId: number = -1,
): Promise<Track> => {
    const params = new URLSearchParams({
        exclude_id: String(excludeId),
        name,
        artist_id: String(artistId),
        genre_id: String(genreId),
    })

    return apiGet(`/music/random?${params}`)
}