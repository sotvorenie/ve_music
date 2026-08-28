import {defineStore} from "pinia";
import {ref} from "vue";
import {Artist} from "@/types/artist.ts";

const useArtistStore = defineStore("artistStore", () => {
    //выбранный исполнитель
    const currentArtist = ref<Artist>({
        id: -1,
        name: '',
        avatarUrl: '',
    })

    return {
        currentArtist,
    }
})

export default useArtistStore;