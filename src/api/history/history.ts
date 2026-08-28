import {MusicList} from "@/types/music.ts";

import {apiGet} from "@api/index.ts";

export const apiGetHistory = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    return apiGet(`/history/all?page=${page}&limit=${limit}`)
}