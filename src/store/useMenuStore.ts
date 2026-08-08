import {defineStore} from "pinia";
import {reactive, ref} from "vue";

const useMenuStore = defineStore("menuStore", () => {

    // все виды модов вывода: музыки, артистов или музыки определенного артиста
    const allListModes = {
        music: 'music',
        artists: 'artists',
        artistMusic: 'artistMusic',
    }
    // мод: музыка, артисты или музыка артиста
    const listMode = ref<string>(allListModes.music)

    // все виды модов меню: жанры, история, избранное
    const allMenuModes = {
        genres: 'genres',
        history: 'history',
        favorites: 'favorites',
    }
    // мод: жанры, история или избранное
    const menuMode = ref<string>(allMenuModes.genres)

    // активный жанр
    const activeGenre = reactive({
        name: '',
        id: -1
    })

    return {
        allListModes,
        listMode,
        allMenuModes,
        menuMode,
        activeGenre,
    }
})

export default useMenuStore;