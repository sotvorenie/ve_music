import {MusicList, Music} from "../../types/music.ts";

import {apiGet} from "../index.ts";

export const apiGetAllMusic = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/music/all?page=${page}&limit=${limit}`)
}

export const apiGetMusic = async (musicId: number): Promise<Music> => {
    return await apiGet(`/music/${musicId}`)
}

export const apiSearchMusic = async (name: string, page: number = 1, limit: number = 21): Promise<Music> => {
    return await apiGet(`/music/search?name=${name}&page=${page}&limit=${limit}`)
}