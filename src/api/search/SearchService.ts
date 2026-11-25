import {ListResponse} from "@/types/response.ts";
import {Search} from "@/types/search.ts";

import {apiDelete, apiGet, apiPost} from "@/api";

export const SearchService = {
    getList(
        signal?: AbortSignal,
    ): Promise<ListResponse<Search>> {
        return apiGet('/search', {signal})
    },

    create(
        search: string,
        signal?: AbortSignal,
    ): Promise<Search> {
        const payload = {
            search,
        }
        return apiPost('/search', payload, {signal})
    },

    delete(
        id: number,
        signal?: AbortSignal,
    ): Promise<void> {
        return apiDelete(`/search/${id}`, {signal})
    },
}