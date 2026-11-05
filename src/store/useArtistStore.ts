import {defineStore} from "pinia";
import {ref} from "vue";

import {ArtistService} from "@api/artist/ArtistService.ts";

import {Artist} from "@/types/artist.ts";

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

    const getArtists = async (isClear: boolean = false) => {
       if (isClear) {
           artists.value = []
           page.value = 1
           hasMore.value = true
           total.value = 0
       }

        try {
            const response = await ArtistService.getArtists(searchStore.searchName, page.value, limit.value)

            if (response) {
                artists.value.push(...response.data)
                limit.value = response.meta.limit
                hasMore.value = response.meta.hasMore
                total.value = response.meta.total
                page.value += 1
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