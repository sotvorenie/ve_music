import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {MusicForList, MusicList} from "@/types/music.ts";
import {Artist, ArtistsList} from "@/types/artist.ts";
import {apiGetMusicList} from "@api/music/music.ts";
import {apiGetHistory} from "@api/history/history.ts";
import {apiGetLiked} from "@api/like/like.ts";
import useMenuStore from "@store/useMenuStore.ts";
import {apiGetArtists} from "@api/artist/artist.ts";
import useControllersStore from "@store/useControllersStore.ts";

const useItemsStore = defineStore("itemsStore", () => {
    const menuStore = useMenuStore();
    const controllersStore = useControllersStore();

    // список музыки
    const musicList = ref<MusicList>({
        music: [] as MusicForList[],
        page: 1,
        limit: 21,
        hasMore: true,
        total: 0
    })

    // список исполнителей
    const artistsList = ref<ArtistsList>({
        artists: [] as Artist[],
        page: 1,
        limit: 21,
        hasMore: false,
        total: 0
    })

    // список id рандомных треков
    const randomMusicIds = ref<number[]>([])
    // seed для случайного порядка проигрывания музыки
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    // offset для случайного проигрывания музыки
    const offset = ref<number>(-1)

    // загрузка списка музыки
    const getMusicList = async (
        page: number = 1,
        limit: number = 21,
    ) => {
        try {
            const allApis = {
                genres: () => apiGetMusicList(page, limit),
                history: () => apiGetHistory(page, limit),
                favorites: () => apiGetLiked(page, limit),
            }

            const response: MusicList = await allApis?.[menuStore.menuMode]?.()

            if (response) {
                musicList.value.music = page === 1 ? response.music : [...musicList.value.music, ...response.music]
                musicList.value.page = response.page
                musicList.value.limit = response.limit
                musicList.value.hasMore = response.hasMore
                musicList.value.total = response.total
            }
        } catch (err) {
            console.error(err)
        }
    }

    // загрузка списка исполнителей
    const getArtistsList = async (
        page: number = 1,
        limit: number = 21,
    ) => {
        try {
            const response: ArtistsList = await apiGetArtists(page, limit)

            if (response) {
                artistsList.value.artists = page === 1 ? response.artists : [...artistsList.value.artists, ...response.artists]
                artistsList.value.page = response.page
                artistsList.value.limit = response.limit
                artistsList.value.hasMore = response.hasMore
                artistsList.value.total = response.total
            }
        } catch (err) {
            console.error(err)
        }
    }

    watch(
        () => controllersStore.isRandom,
        () => {
            randomMusicIds.value = []
            offset.value = -1
            randomSeed.value = (Math.random() * 2) - 1
        }
    )

    return {
        musicList,
        randomMusicIds,
        artistsList,
        randomSeed,
        offset,

        getMusicList,
        getArtistsList,
    }
})

export default useItemsStore;