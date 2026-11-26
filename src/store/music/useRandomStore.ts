import {defineStore} from "pinia";
import {ref} from "vue";

const useRandomStore = defineStore("randomStore", () => {
    const randomIds = ref<Map<number, number>>(new Map())
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    const randomIndex = ref<number>(-1)

    return {
        randomIds,
        randomSeed,
        randomIndex,
    }
})

export default useRandomStore;