import {ArtistsList} from "../../types/artist.ts";
import {MusicList} from "../../types/music.ts";

import {apiGet} from "../index.ts";

export const apiGetAllArtists = async(page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    return await apiGet(`/artist/all?page=${page}&limit=${limit}`)
}

export const apiGetArtistsMusic = async (artistId: number, page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/artist/${artistId}?page=${page}&limit=${limit}`)
}

export const apiSearchArtist = async (name: string, page: number = 1, limit: number = 21): Promise<ArtistsList> => {
    return await apiGet(`/artist/search?name=${name}&page=${page}&limit=${limit}`)
}

export const apiSearchArtistsMusic = async (name: string, artistId: number, page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/artist/search_music?name=${name}&artist_id=${artistId}&page=${page}&limit=${limit}`)
}