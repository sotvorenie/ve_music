import {ArtistsList} from "@/types/artist.ts";

import {apiGet} from "@api/index.ts";

export const apiGetArtists = async(name: string = '', page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    return apiGet(`/artist/list?name=${name}&page=${page}&limit=${limit}`)
}