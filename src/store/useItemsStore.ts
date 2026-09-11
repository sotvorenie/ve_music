import {defineStore} from "pinia";
import {ref} from "vue";
import {MusicForList, MusicList} from "@/types/music.ts";
import {ArtistsList} from "@/types/artist.ts";
import {apiGetMusicList} from "@api/music/music.ts";
import {apiGetHistory} from "@api/history/history.ts";
import {apiGetLiked} from "@api/like/like.ts";
import useMenuStore from "@store/useMenuStore.ts";

const useItemsStore = defineStore("itemsStore", () => {
    const menuStore = useMenuStore();

    // список музыки
    const musicList = ref<MusicList>({
        music: [] as MusicForList[],
        page: 1,
        limit: 21,
        hasMore: false,
        total: 0
    })

    // seed для случайного порядка проигрывания музыки
    const randomSeed = ref<number>((Math.random() * 2) - 1)

    // список исполнителей
    const artistsList = ref<ArtistsList>()

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

    return {
        musicList,
        artistsList,
        randomSeed,

        getMusicList,
    }
})

export default useItemsStore;