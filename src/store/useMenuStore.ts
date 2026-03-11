import {defineStore} from "pinia";
import {ref} from "vue";

const useMenuStore = defineStore("menuStore", () => {

    // все виды модов
    const allModes = {
        music: 'music',
        artists: 'artists',
    }
    // мод: жанры или артисты
    const mode = ref<string>(allModes.music)

    // индекс активного жанра
    const activeGenreIndex = ref<number>(0)
    // название активного жанра
    const activeGenreName = ref<string>('')

    // индекс активной музыки
    const musicIndex = ref<number>(0)

    // количество всех песен
    const musicListLength = ref<number>(0)

    return {
        allModes,
        mode,
        activeGenreIndex,
        activeGenreName,
        musicIndex,
        musicListLength,
    }
})

export default useMenuStore;