import {ArtistsList} from "@/types/artist.ts";

import {apiGet} from "@api/index.ts";

export const apiGetAllArtists = async(page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    return apiGet(`/artist/all?page=${page}&limit=${limit}`)
}

export const apiSearchArtist = async (name: string, page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    return apiGet(`/artist/search?name=${name}&page=${page}&limit=${limit}`)
}