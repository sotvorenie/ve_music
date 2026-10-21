import {IsLiked} from "@/types/like.ts";
import {TrackResponse} from "@/types/music.ts";

import {apiGet, apiPost} from "@api/index.ts";

export const apiLike = (musicId: number): Promise<IsLiked> => {
    return apiPost(`/like/${musicId}`, {})
}

export const apiGetLiked = (name: string = '', page: number = 1, limit: number = 21): Promise<TrackResponse> => {
    const params = new URLSearchParams({
        name,
        page: String(page),
        limit: String(limit),
    })

    return apiGet(`/like/list?${params}`)
}

export const apiCheckLike = (musicId: number): Promise<IsLiked> => {
    return apiGet(`/like/check/${musicId}`)
}