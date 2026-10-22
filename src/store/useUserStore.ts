import {defineStore} from "pinia";
import {ref} from "vue";

import {User} from "@/types/user.ts";

const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({
        id: -1,
        name: '',
        avatarUrl: ''
    })

    const isLogged = ref<boolean>(false)

    const clear = () => {
        user.value = {
            id: -1,
            name: '',
            avatarUrl: ''
        }
        isLogged.value = false
    }

    return {
        user,
        isLogged,

        clear,
    }
})

export default useUserStore;