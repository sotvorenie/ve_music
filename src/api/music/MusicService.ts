import {PaginatedResponse} from "@/types/response.ts";
import {Track, TrackPreview} from "@/types/music.ts";

import {apiGet} from "@/api";

export const MusicService = {
    getTracks(
        name: string = '',
        artistId: number = -1,
        genreId: number = -1,
        page: number = 1,
        limit: number = 21,
    ): Promise<PaginatedResponse<TrackPreview>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (name) params.append('name', name)
        if (artistId >= 0) params.append('artist_id', String(artistId))
        if (genreId >= 0) params.append('genre_id', String(genreId))

        return apiGet(`/music/list?${params}`)
    },

    getTrack(
        musicId: number,
        setView: boolean = true,
    ): Promise<Track> {
        const params = new URLSearchParams({
            set_view: String(setView),
        })

        return apiGet(`/music/${musicId}?${params}`)
    },

    getRandomIds(
        page: number = 1,
        limit: number = 21,
        excludeId: number,
        seed: number,
        name: string = '',
        artistId: number = -1,
        genreId: number = -1,
    ): Promise<PaginatedResponse<number>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (excludeId !== undefined) params.append('exclude_id', String(excludeId))
        if (seed !== undefined) params.append('seed', String(seed))
        if (name) params.append('name', name)
        if (artistId >= 0) params.append('artist_id', String(artistId))
        if (genreId >= 0) params.append('genre_id', String(genreId))


        return apiGet(`/music/random_list?${params}`)
    },
}