import {TrackResponse} from "@/types/music.ts";

import {apiGet} from "@api/index.ts";


export const apiGetHistory = (name: string = '', page: number = 1, limit: number = 21): Promise<TrackResponse> => {
    const params = new URLSearchParams({
        name,
        page: String(page),
        limit: String(limit),
    })

    return apiGet(`/history/list?${params}`)
}