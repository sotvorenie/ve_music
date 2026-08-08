import {defineStore} from "pinia";
import {ref} from "vue";
import useItemsStore from "@store/useItemsStore.ts";
import useAudioStore from "@store/useAudioStore.ts";

const useControllersStore = defineStore("controllersStore", () => {
    const itemsStore = useItemsStore();
    const audioStore = useAudioStore();

    // все виды модов
    const modesList: Record<string, string> = {
        img: 'img',
        video: 'video',
    }
    // активный мод
    const mode = ref<string>(modesList.img)

    // активен ли "Рандом"
    const isRandom = ref(false)
    // активен ли "Повтор композиции"
    const isRepeat = ref(false)

    const getCurrentIndex = (): any => {
        return itemsStore.musicList?.music.findIndex(m => m.id === audioStore.activeTrack.id)
    }
    const prevItem = async () => {
        if (audioStore.currentTime > 20) {
            audioStore.audio.currentTime = 0
            return
        }

        const currentIndex = getCurrentIndex()
        const musicList = itemsStore.musicList?.music

        const prevIndexInCurrentList = (currentIndex - 1 + musicList?.length) % musicList.length
        await audioStore.updateMusic(musicList?.[prevIndexInCurrentList].id)
    }
    const nextItem = async () => {
        const currentIndex = getCurrentIndex()
        const musicList = itemsStore.musicList?.music

        const nextIndexInCurrentList = (currentIndex + 1) % musicList?.length
        await audioStore.updateMusic(musicList?.[nextIndexInCurrentList].id)
    }

    return {
        modesList,
        mode,

        isRandom,
        isRepeat,

        prevItem,
        nextItem,
    }
})

export default useControllersStore;