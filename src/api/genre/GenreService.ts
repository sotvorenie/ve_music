import {ListResponse} from "@/types/response.ts";
import {Genre} from "@/types/genre.ts";

import {apiGet} from "@/api";

export const GenreService = {
    getGenres(): Promise<ListResponse<Genre>> {
        return apiGet(`/genre/all`)
    },
}