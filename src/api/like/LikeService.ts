import {IsLiked} from "@/types/like.ts";
import {PaginatedResponse} from "@/types/response.ts";
import {TrackPreview} from "@/types/music.ts";

import {apiGet, apiPost} from "@/api";

export const LikeService = {
    like(
        musicId: number,
        signal?: AbortSignal,
    ): Promise<IsLiked> {
        return apiPost(`/likes/${musicId}`, undefined, {signal})
    },

    getLikedTracks(
        name: string = '',
        page: number = 1,
        limit: number = 21,
        signal?: AbortSignal,
    ): Promise<PaginatedResponse<TrackPreview>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (name) params.append('name', name)

        return apiGet(`/likes?${params}`, {signal})
    },

    checkLike(
        musicId: number,
    ): Promise<IsLiked> {
        return apiGet(`/likes/${musicId}`)
    },
}