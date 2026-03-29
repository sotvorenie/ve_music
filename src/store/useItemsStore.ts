import {defineStore} from "pinia";
import {ref} from "vue";
import {MusicList} from "../types/music.ts";
import {ArtistsList} from "../types/artist.ts";

const useItemsStore = defineStore("itemsStore", () => {

    // список музыки
    const musicList = ref<MusicList>()

    // список исполнителей
    const artistsList = ref<ArtistsList>()

    return {
        musicList,
        artistsList,
    }
})

export default useItemsStore;