import {Like, IsLiked} from "../../types/like.ts";
import {MusicList} from "../../types/music.ts";

import {apiGet, apiPost} from "../index.ts";

export const apiLike = async (musicId: number): Promise<Like> => {
    return await apiPost(`/like/${musicId}`, {})
}

export const apiCheckIsLike = async (musicId: number): Promise<IsLiked> => {
    return await apiGet(`/like/is_liked/${musicId}`)
}

export const apiGetAllLiked = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/like/all?page=${page}&limit=${limit}`)
}