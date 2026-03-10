import {GenresList} from "../../types/genre.ts";
import {MusicList} from "../../types/music.ts";

import {apiGet} from "../index.ts";

export const apiGetAllGenres = async (): Promise<GenresList> => {
    return await apiGet(`/genre/all`)
}

export const apiGetGenresMusic = async (genreId: number, page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/genre/${genreId}?page=${page}&limit=${limit}`)
}

export const apiSearchGenresMusic = async (name: string, genreId: number, page: number = 1, limit: number = 21): Promise<MusicList> => {
    return await apiGet(`/genre/search_music?name=${name}&genre_id=${genreId}&page=${page}&limit=${limit}`)
}