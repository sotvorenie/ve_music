import {IsLiked} from "@/types/like.ts";
import {MusicList} from "@/types/music.ts";

import {apiGet, apiPost} from "@api/index.ts";

export const apiLike = async (musicId: number): Promise<IsLiked> => {
    return apiPost(`/like/${musicId}`, {})
}

export const apiGetAllLiked = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    return apiGet(`/like/all?page=${page}&limit=${limit}`)
}