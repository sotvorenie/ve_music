import {defineStore} from "pinia";
import {ref} from "vue";

const useModeStore = defineStore("modeStore", () => {
    // все виды модов
    const modesList: Record<string, string> = {
        img: 'img',
        video: 'video',
    }

    // активный мод
    const mode = ref<string>(modesList.img)


    return {
        modesList,
        mode,
    }
})

export default useModeStore;