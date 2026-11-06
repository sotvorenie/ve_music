import {ListResponse} from "@/types/response.ts";
import {Search} from "@/types/search.ts";

import {apiDelete, apiGet, apiPost} from "@/api";

export const SearchService = {
    getList(): Promise<ListResponse<Search>> {
        return apiGet('/search/list')
    },

    create(
        search: string,
    ): Promise<Search> {
        const payload = {
            search,
        }
        return apiPost('/search/set', payload)
    },

    delete(
        id: number,
    ): Promise<void> {
        return apiDelete(`/search/delete/${id}`)
    },
}