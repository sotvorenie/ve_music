import {defineStore} from "pinia";
import {ref} from "vue";

import {TrackPreview} from "@/types/music.ts";
import {Meta} from "@/types/meta.ts";

import {getErrMessage, isCanceledErr} from "@/api";
import {MusicService} from "@api/music/MusicService.ts";
import {HistoryService} from "@api/history/HistoryService.ts";
import {LikeService} from "@api/like/LikeService.ts";

import {showError} from "@utils/modals.ts";
import {abortableRequest} from "@utils/abortableRequest.ts";

interface GetTracksParams {
    mode: 'genres' | 'history' | 'favorites'
    searchName: string
    artistId?: number
    genreId?: number
    page: number
    limit: number
}

const useTracksStore = defineStore("tracksStore", () => {
    const {nextSignal, isCurrent, abort} = abortableRequest()

    const tracks = ref<TrackPreview[]>([])

    const isLoading = ref<boolean>(false)
    const meta = ref<Meta>({
        page: 1,
        limit: 21,
        total: 0,
        hasMore: true,
    })

    const clear = () => {
        tracks.value = []
        meta.value = {
            page: 1,
            limit: 21,
            total: 0,
            hasMore: true,
        }
    }

    const getTracks = async (params: GetTracksParams) => {
        const signal = nextSignal()
        isLoading.value = true

        try {
            const allApis = {
                genres: () => MusicService.getTracks(
                    params.searchName,
                    params.artistId,
                    params.genreId,
                    params.page,
                    params.limit,
                    signal,
                ),

                history: () => HistoryService.getHistory(
                    params.searchName,
                    params.page,
                    params.limit,
                    signal,
                ),

                favorites: () => LikeService.getLikedTracks(
                    params.searchName,
                    params.page,
                    params.limit,
                    signal,
                ),
            }

            const response = await allApis[params.mode]()

            tracks.value.push(...response.data)
            meta.value = {
                ...response.meta,
                page: response.meta.page + 1
            }
        } catch (err: unknown) {
            if (isCanceledErr(err)) return
            await showError(
                'Что-то пошло не так',
                getErrMessage(err, 'Не удалось загрузить треки..')
            )
        } finally {
            if (isCurrent(signal)) {
                isLoading.value = false
            }
        }
    }

    return {
        tracks,

        meta,
        isLoading,

        abort,

        clear,
        getTracks,
    }
})

export default useTracksStore;