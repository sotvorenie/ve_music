import {SuccessResponse} from "../../types/SuccessResponse.ts";
import {MusicList} from "../../types/music.ts";

import {apiGet, apiPost} from "../index.ts";

export const apiSetToHistory = async (musicId: number): Promise<SuccessResponse> => {
    return await apiPost(`/history/set/${musicId}`, {})
}

export const apiGetHistory = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/history/all?page=${page}&limit=${limit}`)
}