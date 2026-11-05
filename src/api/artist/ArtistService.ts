import {PaginatedResponse} from "@/types/response.ts";
import {Artist} from "@/types/artist.ts";

import {apiGet} from "@/api";

export const ArtistService = {
    getArtists(
        name: string = '',
        page: number = 1,
        limit: number = 21
    ): Promise<PaginatedResponse<Artist>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (name) params.append('name', name)

        return apiGet(`/artist/list?${params}`)
    },
}