import {defineStore} from "pinia";
import {ref} from "vue";

import {TrackPreview} from "@/types/music.ts";

import useAudioStore from "@store/useAudioStore.ts";
import useMusicStore from "@store/useMusicStore.ts";

const useControllersStore = defineStore("controllersStore", () => {
    const audioStore = useAudioStore();
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
                musicStore.randomIndex = Math.max(0, musicStore.randomIndex - 1)
                const id = musicStore.randomIds[musicStore.randomIndex]
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
                musicStore.randomIndex += 1
                if (musicStore.randomIndex === 1) musicStore.randomIds[0] = audioStore.activeTrack.id

                const id = musicStore.randomIds[musicStore.randomIndex]

                if (id === audioStore.activeTrack.id) return
                if (id) await audioStore.updateMusic(id)
            } catch {
                musicStore.randomIndex -= 1
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