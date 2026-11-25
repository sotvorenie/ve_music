import {defineStore} from "pinia";
import {ref} from "vue";

import {Artist} from "@/types/artist.ts";
import {Meta} from "@/types/meta.ts";

import {getErrMessage, isCanceledErr} from "@/api";
import {ArtistService} from "@api/artist/ArtistService.ts";

import {showError} from "@utils/modals.ts";
import {abortableRequest} from "@utils/abortableRequest.ts";

interface GetArtistsParams {
    searchName: string
    page: number
    limit: number
}

const useArtistsStore = defineStore("artistsStore", () => {
    const {nextSignal, isCurrent, abort} = abortableRequest()

    const currentArtist = ref<Artist>({
        id: -1,
        name: '',
        avatarUrl: '',
    })

    const artists = ref<Artist[]>([])

    const isLoading = ref(false)
    const meta = ref<Meta>({
        page: 1,
        limit: 21,
        total: 0,
        hasMore: true,
    })

    const clear = () => {
        artists.value = []
        currentArtist.value = {
            id: -1,
            name: '',
            avatarUrl: '',
        }
        meta.value = {
            page: 1,
            limit: 21,
            total: 0,
            hasMore: true,
        }
    }

    const getArtists = async (params: GetArtistsParams) => {
        const signal = nextSignal()
        isLoading.value = true

        try {
            const response = await ArtistService.getArtists(
                params.searchName,
                params.page,
                params.limit,
                signal,
            )

            artists.value.push(...response.data)
            meta.value = {
                ...response.meta,
                page: response.meta.page + 1
            }
        } catch (err: unknown) {
            if (isCanceledErr(err)) return
            await showError(
                'Не удалось загрузить исполнителей..',
                getErrMessage(err)
            )
        } finally {
            if (isCurrent(signal)) {
                isLoading.value = false
            }
        }
    }

    return {
        currentArtist,

        artists,

        isLoading,
        meta,

        abort,

        clear,
        getArtists,
    }
})

export default useArtistsStore;