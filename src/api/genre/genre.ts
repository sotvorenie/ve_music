import {GenresList} from "../../types/genre.ts";

import {apiGet} from "../index.ts";

export const apiGetAllGenres = async (): Promise<GenresList> => {
    return apiGet(`/genre/all`)
}