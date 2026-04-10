import {defineStore} from "pinia";
import {ref} from "vue";
import useItemsStore from "./useItemsStore.ts";
import useAudioStore from "./useAudioStore.ts";

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

    const getCurrentInfo = (): any => {
        const checkRandom =
            isRandom.value && itemsStore.randomMusicList?.length
        const currentList =
            checkRandom ? itemsStore.randomMusicList : itemsStore.musicList?.music

        if (!currentList?.length) return

        return {
            currentIndex: currentList.findIndex(m => m.id === audioStore.activeTrack.id),
            currentList
        }
    }
    const prevItem = async () => {
        if (audioStore.currentTime > 20) {
            audioStore.audio.currentTime = 0
            return
        }

        const {currentIndex, currentList} = getCurrentInfo()

        const prevIndexInCurrentList = (currentIndex - 1 + currentList.length) % currentList.length
        await audioStore.updateMusic(currentList[prevIndexInCurrentList].id)
    }
    const nextItem = async () => {
        const {currentIndex, currentList} = getCurrentInfo()

        const nextIndexInCurrentList = (currentIndex + 1) % currentList.length
        await audioStore.updateMusic(currentList[nextIndexInCurrentList].id)
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