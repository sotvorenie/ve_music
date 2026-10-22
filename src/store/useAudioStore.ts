import {defineStore} from "pinia";
import {ref} from "vue";

import {Track} from "@/types/music.ts";

import {BASE_URL} from "@api/url.ts";
import {apiGetMusic} from "@api/music/music.ts";

import useControllersStore from "@store//useControllersStore.ts";
import useMusicStore from "@store/useMusicStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const controllersStore = useControllersStore();
    const musicStore = useMusicStore();

    const isPlaying = ref<boolean>(false)
    const isMoving = ref<boolean>(false)

    const currentTime = ref<number>(0)
    const duration = ref<number>(0)

    const activeTrack = ref<Track>({
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

    const volume = ref<number>(1)
    const oldVolume = ref<number>(1)

    const audio = new Audio()
    audio.onloadedmetadata = () => {
        duration.value = Math.round(audio.duration)
    }
    audio.ontimeupdate = () => {
        if (!isMoving.value) currentTime.value = Math.floor(audio.currentTime)
    }
    audio.onended = async () => {
        if (controllersStore.isRepeat) {
            audio.currentTime = 0
            audio.play().then(() => {})
        } else if ((musicStore?.music && musicStore.music.length > 1) || controllersStore.isRandom) {
            await controllersStore.nextItem()
        } else {
            isPlaying.value = false
            currentTime.value = 0
        }
    }

    const loadAndPlay = () => {
        currentTime.value = 0
        audio.src = `${BASE_URL}${activeTrack.value.url}`
        audio.load()

        if (isPlaying.value) audio.play().catch(() => {})
    }

    const updateMusic = async (
        id: number | undefined,
        music: Track | null = null
    ) => {
        try {
            controllersStore.isLoading = true

            let data = music
            if (id) data = await apiGetMusic(id)

            if (data) {
                Object.assign(activeTrack.value, data)
                loadAndPlay()

                if (controllersStore.mode === 'video' && !activeTrack.value.videoClipUrl) controllersStore.mode = 'img'
            }
        } finally {
            controllersStore.isLoading = false
        }
    }

    return {
        audio,

        isPlaying,
        isMoving,

        currentTime,
        duration,

        activeTrack,

        volume,
        oldVolume,

        loadAndPlay,

        updateMusic,
    }
})

export default useAudioStore;