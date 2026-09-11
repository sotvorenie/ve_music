import {defineStore} from "pinia";
import {reactive, ref} from "vue";

const useMenuStore = defineStore("menuStore", () => {
    // мод: музыка, артисты или музыка артиста
    const listMode = ref<'music' | 'artists' | 'artistMusic'>('music')

    // мод: жанры, история или избранное
    const menuMode = ref<'genres' | 'history' | 'favorites'>('genres')

    // активный жанр
    const activeGenre = reactive({
        name: '',
        id: -1
    })

    const clearGenre = () => {
        activeGenre.name = ''
        activeGenre.id = -1
    }

    return {
        listMode,
        menuMode,
        activeGenre,

        clearGenre,
    }
})

export default useMenuStore;