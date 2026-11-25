import {defineStore} from "pinia";
import {ref} from "vue";

const useMessageStore = defineStore('messageStore', () => {
    const isVisible = ref<boolean>(false)

    const messageText = ref<string>('')

    let timer: number | null = null

    const show = (text: string) => {
        messageText.value = text
        isVisible.value = true

        if (timer) clearTimeout(timer)

        timer = setInterval(() => {
            isVisible.value = false
        }, 3000)
    }

    const hide = () => {
        isVisible.value = false
        if (timer) clearTimeout(timer)
    }

    return {
        isVisible,
        messageText,

        show,
        hide,
    }
})

export default useMessageStore;