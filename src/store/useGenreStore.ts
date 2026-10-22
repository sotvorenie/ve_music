import {defineStore} from "pinia";
import {ref} from "vue";

import {Genre} from "@/types/genre.ts";

const useGenreStore = defineStore("genreStore", () => {
    const genres = ref<Genre[]>([])

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
        genres,
        currentGenre,

        clearGenre,
    }
})

export default useGenreStore;