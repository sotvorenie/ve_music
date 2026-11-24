import {defineStore} from "pinia";
import {ref} from "vue";

import {Search} from "@/types/search.ts";

const useSearchStore = defineStore("searchStore", () => {
    const isOpen = ref(false)

    const searchName = ref<string>('')

    const searchHistory = ref<Search[]>([])

    return {
        isOpen,
        searchName,
        searchHistory,
    }
})

export default useSearchStore;