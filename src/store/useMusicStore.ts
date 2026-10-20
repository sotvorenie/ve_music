import {defineStore} from "pinia";
import {ref} from "vue";

import {apiGetMusicList} from "@api/music/music.ts";
import {apiGetHistory} from "@api/history/history.ts";
import {apiGetLiked} from "@api/like/like.ts";

import {TrackPreview, TrackResponse} from "@/types/music.ts";

import useSearchStore from "@store/useSearchStore.ts";
import useArtistStore from "@store/useArtistStore.ts";
import useGenreStore from "@store/useGenreStore.ts";
import useMenuStore from "@store/useMenuStore.ts";

const useMusicStore = defineStore("musicStore", () => {
    const searchStore = useSearchStore()
    const artistStore = useArtistStore()
    const genreStore = useGenreStore()
    const menuStore = useMenuStore()

    const music = ref<TrackPreview[]>([])

    const page = ref<number>(1)
    const limit = ref<number>(21)
    const total = ref<number>(0)
    const hasMore = ref<boolean>(true)

    const randomIds = ref<number[]>([])
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    const offset = ref<number>(-1)

    const getMusic = async () => {
        try {
            const allApis = {
                genres: () => apiGetMusicList(
                    searchStore.searchName,
                    artistStore.currentArtist?.id,
                    genreStore.currentGenre?.id,
                    page.value,
                    limit.value
                ),

                history: () => apiGetHistory(
                    searchStore.searchName,
                    page.value,
                    limit.value
                ),

                favorites: () => apiGetLiked(
                    searchStore.searchName,
                    page.value,
                    limit.value
                ),
            }

            const response: TrackResponse = await allApis?.[menuStore.menuMode]?.()

            if (response) {
                music.value = page.value === 1 ? response.music : [...music.value, ...response.music]
                page.value = response.page
                limit.value = response.limit
                hasMore.value = response.hasMore
                total.value = response.total
            }
        } catch (err) {
            console.error(err)
        }
    }

    return {
        music,

        page,
        limit,
        total,
        hasMore,

        randomIds,
        randomSeed,
        offset,

        getMusic,
    }
})

export default useMusicStore;