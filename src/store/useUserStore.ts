import {defineStore} from "pinia";
import {ref} from "vue";

import {User, UserRoles} from "@/types/user.ts";

const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({
        id: -1,
        name: '',
        avatarUrl: '',
        role: UserRoles.USER,
    })

    const isLogged = ref<boolean>(false)

    const clear = () => {
        user.value = {
            id: -1,
            name: '',
            avatarUrl: '',
            role: UserRoles.USER,
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