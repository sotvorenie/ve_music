import {ArtistsResponse} from "@/types/artist.ts";

import {apiGet} from "@api/index.ts";

export const apiGetArtists = (name: string = '', page: number = 1, limit: number = 21): Promise<ArtistsResponse> => {
    const params = new URLSearchParams({
        name,
        page: String(page),
        limit: String(limit),
    })

    return apiGet(`/artist/list?${params}`)
}