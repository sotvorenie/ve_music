import {defineStore} from "pinia";
import {ref} from "vue";

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

    // индекс активного жанра
    const activeGenreIndex = ref<number>(0)
    // название активного жанра
    const activeGenreName = ref<string>('')
    // id активного жанра
    const activeGenreId = ref<number>(-1)

    // индекс активной музыки
    const musicIndex = ref<number>(0)

    // количество всех песен
    const musicListLength = ref<number>(0)

    return {
        allListModes,
        listMode,
        allMenuModes,
        menuMode,
        activeGenreIndex,
        activeGenreName,
        activeGenreId,
        musicIndex,
        musicListLength,
    }
})

export default useMenuStore;