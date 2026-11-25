import {defineStore} from "pinia";
import {ref} from "vue";

const useRandomStore = defineStore("randomStore", () => {
    const randomIds = ref<number[]>([])
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    const randomIndex = ref<number>(0)

    return {
        randomIds,
        randomSeed,
        randomIndex,
    }
})

export default useRandomStore;