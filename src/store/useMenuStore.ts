import {defineStore} from "pinia";
import {ref} from "vue";

const useMenuStore = defineStore("menuStore", () => {
    const listMode = ref<'music' | 'artists'>('music')

    const menuMode = ref<'genres' | 'history' | 'favorites'>('genres')

    return {
        listMode,
        menuMode,
    }
})

export default useMenuStore;