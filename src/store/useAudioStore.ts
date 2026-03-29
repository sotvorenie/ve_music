import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import useMenuStore from "./useMenuStore.ts";
import {Music} from "../types/music.ts";
import useControllersStore from "./useControllersStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const menuStore = useMenuStore();
    const controllersStore = useControllersStore();

    // аудио
    const audio = new Audio()
    audio.onloadedmetadata = () => {
        activeTrack.duration = Math.round(audio.duration)
    }
    audio.ontimeupdate = () => {
        currentTime.value = Math.floor(audio.currentTime)
    }
    audio.onended = () => {
        if (controllersStore.isRepeat) {
            audio.currentTime = 0
            audio.play().then(() => {})
        } else if (menuStore.musicIndex < menuStore.musicListLength - 1) {
            menuStore.musicIndex++
        } else {
            isPlaying.value = false
            currentTime.value = 0
        }
    }

    // играет музыка или нет (стоит на паузе)
    const isPlaying = ref<boolean>(false)

    // активное время музыки
    const currentTime = ref<number>(0)

    // активный трек
    const activeTrack = reactive<Music>({
        id: -1,
        name: '',
        duration: 0,
        audio_url: '',
        auditions: 0,
        likes: 0,
        preview_url: '',
        video_clip_url: '',
        genre_id: -1,
        genre: {
            id: -1,
            name: '',
        },
        artists: [{id: -1, name: '', avatar_url: ''}]
    })

    // уровень громкости
    const volume = ref<number>(1)
    // старый уровень громкости
    const oldVolume = ref<number>(1)


    // загружаем данные о музыке
    const loadAndPlay = () => {
        currentTime.value = 0
        audio.src = `http://localhost:81/${activeTrack.audio_url}`
        audio.load()

        if (isPlaying.value) {
            audio.play().catch(() => {})
        }
    }

    return {
        audio,

        isPlaying,

        currentTime,

        activeTrack,

        volume,
        oldVolume,

        loadAndPlay,
    }
})

export default useAudioStore;