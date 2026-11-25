import {defineStore} from "pinia";
import {ref} from "vue";

const useControllersStore = defineStore("controllersStore", () => {
    const isLoading = ref<boolean>(false)

    const mode = ref<'img' | 'video'>('img')

    const isRandom = ref(false)
    const isRepeat = ref(false)

    return {
        isLoading,

        mode,

        isRandom,
        isRepeat,
    }
})

export default useControllersStore;