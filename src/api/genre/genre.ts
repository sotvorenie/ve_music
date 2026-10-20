import {GenresResponse} from "@/types/genre.ts";

import {apiGet} from "@api/index.ts";

export const apiGetAllGenres = (): Promise<GenresResponse> => {
    return apiGet(`/genre/all`)
}