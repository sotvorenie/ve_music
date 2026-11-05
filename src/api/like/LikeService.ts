import {IsLiked} from "@/types/like.ts";
import {PaginatedResponse} from "@/types/response.ts";
import {TrackPreview} from "@/types/music.ts";

import {apiGet, apiPost} from "@/api";

export const LikeService = {
    like(
        musicId: number,
    ): Promise<IsLiked> {
        return apiPost(`/like/${musicId}`)
    },

    getLikedTracks(
        name: string = '',
        page: number = 1,
        limit: number = 21
    ): Promise<PaginatedResponse<TrackPreview>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (name) params.append('name', name)

        return apiGet(`/like/list?${params}`)
    },

    checkLike(
        musicId: number,
    ): Promise<IsLiked> {
        return apiGet(`/like/check/${musicId}`)
    },
}