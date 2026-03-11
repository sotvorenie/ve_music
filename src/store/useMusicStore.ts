import {defineStore} from "pinia";
import {ref} from "vue";
import {MusicList} from "../types/music.ts";

const useMusicStore = defineStore("musicStore", () => {

    // список музыки
    const musicList = ref<MusicList>()

    return {
        musicList
    }
})

export default useMusicStore;