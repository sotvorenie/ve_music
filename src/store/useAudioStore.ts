import {defineStore} from "pinia";
import Hls from "hls.js";
import {ref} from "vue";

import {BASE_URL} from "@api/url.ts";

import {usePlayerControllers} from "@composables/usePlayerControllers.ts";

import useControllersStore from "@store//useControllersStore.ts";
import useTracksStore from "@store/music/useTracksStore.ts";
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const controllersStore = useControllersStore();
    const tracksStore = useTracksStore();
    const currentTrackStore = useCurrentTrackStore();

    const {next} = usePlayerControllers()

    let hls: Hls | null = null
    const loadedPercent = ref<number>(0)
    const currentBitrate = ref<number>(0)
    const isAutoBitrate = ref<boolean>(true)

    const isPlaying = ref<boolean>(false)
    const isMoving = ref<boolean>(false)

    const currentTime = ref<number>(0)
    const duration = ref<number>(0)

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
        } else if (tracksStore.tracks?.length > 1 || controllersStore.isRandom) {
            await next()
        } else {
            isPlaying.value = false
            currentTime.value = 0
        }
    }

    const loadAndPlay = () => {
        loadedPercent.value = 0
        currentTime.value = 0
        const url = `${BASE_URL}${currentTrackStore.track.url}`

        if (hls) {
            hls.destroy()
            hls = null
        }

        if (Hls.isSupported() && currentTrackStore.track.url.includes(".m3u8")) {
            if (!hls) hls = new Hls({
                maxBufferLength: 30,
                maxMaxBufferLength: 40,
            })

            hls.loadSource(url)
            hls.attachMedia(audio)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isPlaying.value) audio.play().catch(() => {})
            })
            hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
                const currentSn = Number(data.frag.sn)
                const totalFrags = currentTrackStore.track.segmentsCount

                if (totalFrags > 0 && !Number.isNaN(currentSn)) {
                    loadedPercent.value = Math.min(100, Math.round(((currentSn + 1) / totalFrags) * 100))
                }
            })
            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                const nominal = currentTrackStore.track.bitrates?.[data.level]
                currentBitrate.value = nominal
                    ? nominal * 1000
                    : (hls?.levels[data.level]?.bitrate ?? 0)
            })
            hls.on(Hls.Events.ERROR, (_, data) => {
                console.error(data)
            })
        } else {
            audio.src = url
            audio.load()
            if (isPlaying.value) audio.play().catch(() => {})
        }
    }

    const setBitrate = (bitrate: number) => {
        if (!hls) return

        if (bitrate === -1) {
            hls.currentLevel = -1
            isAutoBitrate.value = true
            return
        }

        const levelIndex = currentTrackStore.track.bitrates?.indexOf(bitrate) ?? -1

        if (levelIndex !== -1) {
            hls.currentLevel = levelIndex
            isAutoBitrate.value = false
            currentBitrate.value = bitrate * 1000
        }
    }

    return {
        audio,

        loadedPercent,
        currentBitrate,
        isAutoBitrate,

        isPlaying,
        isMoving,

        currentTime,
        duration,

        volume,
        oldVolume,

        loadAndPlay,
        setBitrate,
    }
})

export default useAudioStore;