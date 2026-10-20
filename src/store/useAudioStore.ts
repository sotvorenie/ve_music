import {defineStore} from "pinia";
import {reactive, ref} from "vue";

import {Track} from "@/types/music.ts";

import {BASE_URL} from "@api/url.ts";
import {apiGetMusic} from "@api/music/music.ts";

import useControllersStore from "@store//useControllersStore.ts";
import useItemsStore from "@store/useItemsStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const controllersStore = useControllersStore();
    const itemsStore = useItemsStore();

    const audio = new Audio()
    audio.onloadedmetadata = () => {
        activeTrack.duration = Math.round(audio.duration)
    }
    audio.ontimeupdate = () => {
        currentTime.value = Math.floor(audio.currentTime)
    }
    audio.onended = async () => {
        if (controllersStore.isRepeat) {
            audio.currentTime = 0
            audio.play().then(() => {})
        } else if (itemsStore.musicList?.music && itemsStore.musicList.music.length > 1) {
            await controllersStore.nextItem()
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
    const activeTrack = reactive<Track>({
        id: -1,
        name: '',
        duration: 0,
        url: '',
        auditionsCount: 0,
        likesCount: 0,
        previewUrl: '',
        videoClipUrl: '',
        isLiked: false,
        artists: [{id: -1, name: '', avatarUrl: ''}],
        genre: {id: -1, name: ''}
    })

    // уровень громкости
    const volume = ref<number>(1)
    // старый уровень громкости
    const oldVolume = ref<number>(1)


    // загружаем данные о музыке
    const loadAndPlay = () => {
        currentTime.value = 0
        audio.src = `${BASE_URL}${activeTrack.url}`
        audio.load()

        if (isPlaying.value) {
            audio.play().catch(() => {})
        }
    }

    // функция для загрузки музыки по id
    const updateMusic = async (id: number | undefined, music: Track | null = null) => {
        try {
            controllersStore.isLoading = true

            let data = music
            if (id) data = await apiGetMusic(id)

            if (data) {
                Object.assign(activeTrack, data)
                loadAndPlay()

                if (controllersStore.mode === 'video' && !activeTrack.videoClipUrl) {
                    controllersStore.mode = 'img'
                }
            }
        } finally {
            controllersStore.isLoading = false
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

        updateMusic,
    }
})

export default useAudioStore;