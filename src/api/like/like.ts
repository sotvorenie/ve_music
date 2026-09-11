import {IsLiked} from "@/types/like.ts";
import {MusicList} from "@/types/music.ts";

import {apiGet, apiPost} from "@api/index.ts";

import useSearchStore from "@store/useSearchStore.ts";

export const apiLike = async (musicId: number): Promise<IsLiked> => {
    return apiPost(`/like/${musicId}`, {})
}

export const apiGetLiked = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    const searchStore = useSearchStore();

    return apiGet(`/like/list?name=${searchStore.searchName}&page=${page}&limit=${limit}`)
}

export const apiCheckLike = async (musicId: number): Promise<IsLiked> => {
    return apiGet(`/like/check/${musicId}`)
}