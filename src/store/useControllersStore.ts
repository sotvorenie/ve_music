import {defineStore} from "pinia";
import {ref} from "vue";

import {Track} from "@/types/music.ts";

import {apiGetRandomMusic} from "@api/music/music.ts";

import useItemsStore from "@store/useItemsStore.ts";
import useAudioStore from "@store/useAudioStore.ts";
import useSearchStore from "@store/useSearchStore.ts";
import useArtistStore from "@store/useArtistStore.ts";
import useGenreStore from "@store/useGenreStore.ts";

const useControllersStore = defineStore("controllersStore", () => {
    const itemsStore = useItemsStore();
    const audioStore = useAudioStore();
    const searchStore = useSearchStore();
    const artistStore = useArtistStore();
    const genreStore = useGenreStore();

    const isLoading = ref<boolean>(false)

    const mode = ref<'img' | 'video'>('img')

    const isRandom = ref(false)
    const isRepeat = ref(false)

    const getCurrentIndex = (): any => {
        return itemsStore.musicList?.music.findIndex((m: Track) => m.id === audioStore.activeTrack.id)
    }

    const prevItem = async () => {
        if (audioStore.currentTime > 20) {
            audioStore.audio.currentTime = 0
            return
        }

        try {
            isLoading.value = true

            if (isRandom.value) {
                itemsStore.offset = Math.max(-1, itemsStore?.offset - 1)
                const id = itemsStore.randomMusicIds[itemsStore.offset]
                if (id && id !== audioStore.activeTrack.id) await audioStore.updateMusic(id)
                return
            }

            const currentIndex = getCurrentIndex()
            const musicList = itemsStore.musicList?.music

            const prevIndexInCurrentList = (currentIndex - 1 + musicList?.length) % musicList?.length
            await audioStore.updateMusic(musicList?.[prevIndexInCurrentList].id)
        } finally {
            isLoading.value = false
        }
    }
    const nextItem = async () => {
        if (isRandom.value) {
            try {
                itemsStore.offset += 1
                if (itemsStore.offset === 0) itemsStore.randomMusicIds[-1] = audioStore.activeTrack.id

                const id = itemsStore.randomMusicIds[itemsStore.offset]

                if (id === audioStore.activeTrack.id) return
                if (id) {
                    await audioStore.updateMusic(id)
                } else {
                    const music = await apiGetRandomMusic(
                        itemsStore.randomMusicIds[-1],
                        searchStore.searchName,
                        artistStore.currentArtist?.id,
                        genreStore.currentGenre?.id
                    )
                    if (music) {
                        itemsStore.randomMusicIds[itemsStore.offset] = music.id
                        await audioStore.updateMusic(undefined, music)
                    }
                }
            } catch {
                itemsStore.offset -= 1
            } finally {
                isLoading.value = false
            }
        } else {
            try {
                isLoading.value = true

                const currentIndex = getCurrentIndex()
                const musicList = itemsStore.musicList?.music

                const nextIndexInCurrentList = (currentIndex + 1) % musicList?.length
                await audioStore.updateMusic(musicList?.[nextIndexInCurrentList].id)
            } finally {
                isLoading.value = false
            }
        }
    }

    return {
        isLoading,

        mode,

        isRandom,
        isRepeat,

        prevItem,
        nextItem,
    }
})

export default useControllersStore;