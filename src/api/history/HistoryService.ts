import {PaginatedResponse} from "@/types/response.ts";
import {TrackPreview} from "@/types/music.ts";

import {apiGet} from "@/api";

export const HistoryService = {
    getHistory(
        name: string = '',
        page: number = 1,
        limit: number = 21,
    ): Promise<PaginatedResponse<TrackPreview>> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (name) params.append('name', name)

        return apiGet(`/history/list?${params}`)
    },
}