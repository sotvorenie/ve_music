import {defineStore} from "pinia";
import {ref} from "vue";
import {MusicForList, MusicList} from "@/types/music.ts";
import {ArtistsList} from "@/types/artist.ts";
import {apiGetMusicList} from "@api/music/music.ts";
import {apiGetHistory} from "@api/history/history.ts";
import {apiGetAllLiked} from "@api/like/like.ts";
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
        let data: MusicList
        if (menuStore.menuMode === menuStore.allMenuModes.genres) {
            data = await apiGetMusicList(page, limit)
        } else if (menuStore.menuMode === menuStore.allMenuModes.history) {
            data = await apiGetHistory(page, limit)
        } else {
            data = await apiGetAllLiked(page, limit)
        }

        if (data) {
            musicList.value.music = page === 1 ? data.music : [...musicList.value.music, ...data.music]
            musicList.value.page = data.page
            musicList.value.limit = data.limit
            musicList.value.hasMore = data.hasMore
            musicList.value.total = data.total
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