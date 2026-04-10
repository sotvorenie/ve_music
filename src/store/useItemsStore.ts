import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {MusicForList, MusicList} from "../types/music.ts";
import {ArtistsList} from "../types/artist.ts";

const useItemsStore = defineStore("itemsStore", () => {

    // список музыки
    const musicList = ref<MusicList>()

    // активная страница для апи
    const page = ref(1)

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

    return {
        musicList,
        page,
        randomMusicList,
        artistsList,
    }
})

export default useItemsStore;