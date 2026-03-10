import {defineStore} from "pinia";
import {ref} from "vue";

const useMenuStore = defineStore("menuStore", () => {

    // индекс активной музыки
    const musicIndex = ref<number>(0)

    // количество всех песен
    const musicListLength = ref<number>(0)

    return {
        musicIndex,
        musicListLength,
    }
})

export default useMenuStore;