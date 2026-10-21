import {defineStore} from "pinia";
import {ref} from "vue";

import {TrackPreview} from "@/types/music.ts";

import {apiGetRandomMusic} from "@api/music/music.ts";

import useAudioStore from "@store/useAudioStore.ts";
import useSearchStore from "@store/useSearchStore.ts";
import useArtistStore from "@store/useArtistStore.ts";
import useGenreStore from "@store/useGenreStore.ts";
import useMusicStore from "@store/useMusicStore.ts";

const useControllersStore = defineStore("controllersStore", () => {
    const audioStore = useAudioStore();
    const searchStore = useSearchStore();
    const artistStore = useArtistStore();
    const genreStore = useGenreStore();
    const musicStore = useMusicStore();

    const isLoading = ref<boolean>(false)

    const mode = ref<'img' | 'video'>('img')

    const isRandom = ref(false)
    const isRepeat = ref(false)

    const getCurrentIndex = (): number => {
        return musicStore.music.findIndex((m: TrackPreview) => m.id === audioStore.activeTrack.id)
    }

    const prevItem = async () => {
        if (audioStore.currentTime > 20) {
            audioStore.audio.currentTime = 0
            return
        }

        try {
            isLoading.value = true

            if (isRandom.value) {
                musicStore.offset = Math.max(-1, musicStore?.offset - 1)
                const id = musicStore.randomIds[musicStore.offset]
                if (id && id !== audioStore.activeTrack.id) await audioStore.updateMusic(id)
                return
            }

            const currentIndex = getCurrentIndex()

            const prevIndexInCurrentList = (currentIndex - 1 + musicStore.music.length) % musicStore.music.length
            await audioStore.updateMusic(musicStore.music[prevIndexInCurrentList].id)
        } finally {
            isLoading.value = false
        }
    }
    const nextItem = async () => {
        if (isRandom.value) {
            try {
                musicStore.offset += 1
                if (musicStore.offset === 0) musicStore.randomIds[-1] = audioStore.activeTrack.id

                const id = musicStore.randomIds[musicStore.offset]

                if (id === audioStore.activeTrack.id) return
                if (id) {
                    await audioStore.updateMusic(id)
                } else {
                    const music = await apiGetRandomMusic(
                        musicStore.randomIds[-1],
                        searchStore.searchName,
                        artistStore.currentArtist?.id,
                        genreStore.currentGenre?.id
                    )
                    if (music) {
                        musicStore.randomIds[musicStore.offset] = music.id
                        await audioStore.updateMusic(undefined, music)
                    }
                }
            } catch {
                musicStore.offset -= 1
            } finally {
                isLoading.value = false
            }
        } else {
            try {
                isLoading.value = true

                const currentIndex = getCurrentIndex()

                const nextIndexInCurrentList = (currentIndex + 1) % musicStore.music.length
                await audioStore.updateMusic(musicStore.music[nextIndexInCurrentList].id)
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