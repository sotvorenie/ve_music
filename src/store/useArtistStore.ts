import {defineStore} from "pinia";
import {ref} from "vue";

import {apiGetArtists} from "@api/artist/artist.ts";

import {Artist, ArtistsResponse} from "@/types/artist.ts";

import useSearchStore from "@store/useSearchStore.ts";

const useArtistStore = defineStore("artistStore", () => {
    const searchStore = useSearchStore();

    const currentArtist = ref<Artist>({
        id: -1,
        name: '',
        avatarUrl: '',
    })

    const artists = ref<Artist[]>([])

    const page = ref<number>(1)
    const limit = ref<number>(21)
    const total = ref<number>(0)
    const hasMore = ref<boolean>(true)

    const getArtists = async (p: number = 1) => {
        page.value = p

        try {
            const response: ArtistsResponse = await apiGetArtists(searchStore.searchName, page.value, limit.value)

            if (response) {
                artists.value = page.value === 1 ? response.artists : [...artists.value, ...response.artists]
                limit.value = response.limit
                hasMore.value = response.hasMore
                total.value = response.total
            }
        } catch (err) {
            console.error(err)
        }
    }

    return {
        currentArtist,

        artists,

        page,
        limit,
        total,
        hasMore,

        getArtists,
    }
})

export default useArtistStore;