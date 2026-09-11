import {ArtistsList} from "@/types/artist.ts";

import {apiGet} from "@api/index.ts";

import useSearchStore from "@store/useSearchStore.ts";

export const apiGetArtists = async(page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    const searchStore = useSearchStore();

    return apiGet(`/artist/list?name=${searchStore.searchName}&page=${page}&limit=${limit}`)
}