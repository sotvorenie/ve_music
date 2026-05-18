import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {Music, MusicForList, MusicList} from "../types/music.ts";
import {ArtistsList} from "../types/artist.ts";
import {apiGetMusicList} from "../api/music/music.ts";
import {apiGetHistory} from "../api/history/history.ts";
import {apiGetAllLiked} from "../api/like/like.ts";
import useMenuStore from "./useMenuStore.ts";

const useItemsStore = defineStore("itemsStore", () => {
    const menuStore = useMenuStore();

    // список музыки
    const musicList = ref<MusicList>({
        music: [] as Music[],
        page: 1 as number,
        limit: 21 as number,
        has_more: false as boolean,
        total: 0 as number
    })

    // seed для случайного порядка проигрывания музыки
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    // список музыки в случайном порядке
    const randomMusicList = ref<MusicForList[]>()
    const mulberry32 = (seed: number) => {
        return () => {
            let t = (seed += 0x6d2b79f5)
            t = Math.imul(t ^ (t >>> 15), t | 1)
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
    }
    const shuffleWithSeed = (list: MusicList, seed: number): MusicForList[] => {
        const copy = [...list.music]
        const rng = mulberry32(seed * 100000)

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy
    }
    watch(
        [musicList, randomSeed],
        ([newList, newSeed]) => {
            if (newList && newList.music.length > 0) {
                randomMusicList.value = shuffleWithSeed(newList, newSeed)
            } else {
                randomMusicList.value = []
            }
        },
        { immediate: true, deep: true }
    )

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
            musicList.value.music = [...musicList.value.music, ...data.music]
            musicList.value.page = data.page
            musicList.value.limit = data.limit
            musicList.value.has_more = data.has_more
            musicList.value.total = data.total
        }
    }

    return {
        musicList,
        randomMusicList,
        artistsList,

        getMusicList,
    }
})

export default useItemsStore;