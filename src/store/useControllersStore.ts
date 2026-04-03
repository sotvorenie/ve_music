import {defineStore} from "pinia";
import {ref} from "vue";

const useControllersStore = defineStore("controllersStore", () => {
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

    return {
        modesList,
        mode,

        isRandom,
        isRepeat,
    }
})

export default useControllersStore;