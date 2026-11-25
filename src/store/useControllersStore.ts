import {defineStore} from "pinia";
import {ref} from "vue";

const useControllersStore = defineStore("controllersStore", () => {
    const mode = ref<'img' | 'video'>('img')

    const isRandom = ref(false)
    const isRepeat = ref(false)

    return {
        mode,

        isRandom,
        isRepeat,
    }
})

export default useControllersStore;