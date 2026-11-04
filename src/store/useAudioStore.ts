import {defineStore} from "pinia";
import Hls from "hls.js";
import {ref} from "vue";

import {Track} from "@/types/music.ts";

import {BASE_URL} from "@api/url.ts";
import {apiGetMusic} from "@api/music/music.ts";

import useControllersStore from "@store//useControllersStore.ts";
import useMusicStore from "@store/useMusicStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const controllersStore = useControllersStore();
    const musicStore = useMusicStore();

    let hls: Hls | null = null
    const loadedPercent = ref(0)

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
        genre: {id: -1, name: ''},
        segmentsCount: 0,
    })

    const volume = ref<number>(1)
    const oldVolume = ref<number>(1)

    const audio = new Audio()
    audio.preload = 'auto'
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
        loadedPercent.value = 0
        currentTime.value = 0
        const url = `${BASE_URL}${activeTrack.value.url}`

        if (hls) {
            hls.destroy()
            hls = null
        }

        if (Hls.isSupported() && activeTrack.value.url.includes(".m3u8")) {
            if (!hls) hls = new Hls()

            hls.loadSource(url)
            hls.attachMedia(audio)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isPlaying.value) audio.play().catch(() => {})
            })
            hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
                const currentSn = Number(data.frag.sn)
                const totalFrags = activeTrack.value.segmentsCount

                if (totalFrags > 0 && !Number.isNaN(currentSn)) {
                    loadedPercent.value = Math.min(100, Math.round(((currentSn + 1) / totalFrags) * 100))
                }
            })
        } else {
            audio.src = url
            audio.load()
            if (isPlaying.value) audio.play().catch(() => {})
        }
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

        loadedPercent,

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