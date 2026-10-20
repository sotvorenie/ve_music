import {defineStore} from "pinia";
import {ref} from "vue";

const useSearchStore = defineStore("searchStore", () => {
    const isOpen = ref(false)

    const searchName = ref<string>('')

    return {
        isOpen,
        searchName,
    }
})

export default useSearchStore;