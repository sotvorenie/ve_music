import {MusicList} from "@/types/music.ts";

import {apiGet} from "@api/index.ts";

import useSearchStore from "@store/useSearchStore.ts";

export const apiGetHistory = async (page: number = 1, limit: number = 21): Promise<MusicList> => {
    const searchStore = useSearchStore();

    return apiGet(`/history/list?name=${searchStore.searchName}&page=${page}&limit=${limit}`)
}