import {defineStore} from "pinia";
import {ref} from "vue";

const useSearchStore = defineStore("searchStore", () => {

    // видимость блока поиска
    const isOpen = ref(false)

    // значение поля поиска
    const searchName = ref<string>('')

    return {
        isOpen,
        searchName,
    }
})

export default useSearchStore;