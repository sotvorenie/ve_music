import {defineStore} from "pinia";
import {ref} from "vue";

const useArtistStore = defineStore("artistStore", () => {

    // id выбранного исполнителя
    const artistId = ref<number>(-1)

    // имя выбранного исполнителя
    const artistName = ref<string>('')

    return {
        artistId,
        artistName,
    }
})

export default useArtistStore;