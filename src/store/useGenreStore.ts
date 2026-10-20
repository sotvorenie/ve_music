import {defineStore} from "pinia";
import {ref} from "vue";

import {Genre} from "@/types/genre.ts";

const useGenreStore = defineStore("genreStore", () => {
    const currentGenre = ref<Genre>({
        id: -1,
        name: ''
    })

    const clearGenre = () => {
        currentGenre.value = {
            id: -2,
            name: '',
        }
    }

    return {
        currentGenre,

        clearGenre,
    }
})

export default useGenreStore;