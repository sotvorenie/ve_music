import {defineStore} from "pinia";
import {ref} from "vue";

import {Track} from "@/types/music.ts";

import {isCanceledErr} from "@/api";
import {MusicService} from "@api/music/MusicService.ts";

import {abortableRequest} from "@utils/abortableRequest.ts";

interface UpdateTrackParams {
    id: number | undefined
    trackData?: Track | null
    setView?: boolean
}

const useCurrentTrackStore = defineStore("currentTrackStore", () => {
    const {nextSignal, isCurrent, abort} = abortableRequest()

    const track = ref<Track>({
        id: -1,
        name: '',
        duration: 0,
        url: '',
        auditionsCount: 0,
        likesCount: 0,
        previewUrl: '',
        previewX480Url: null,
        videoClipUrl: '',
        isLiked: false,
        artists: [{id: -1, name: '', avatarUrl: ''}],
        genre: {id: -1, name: ''},
        segmentsCount: 0,
        bitrates: [],
    })

    const isLoading = ref(false)

    const saveMusicInLocStore = (musicId: number) => {
        if (!Number.isNaN(musicId)) {
            localStorage.setItem('last-track', String(musicId))
        }
    }

    const updateTrack = async ({id, trackData = null, setView = true}: UpdateTrackParams) => {
        if (track.value.id === id) return

        const signal = nextSignal()
        isLoading.value = true

        try {
            const data = id ? await MusicService.getTrack(id, setView, signal) : trackData
            if (!data) return

            saveMusicInLocStore(data.id)
            Object.assign(track.value, data)
        } catch (err: unknown) {
            if (isCanceledErr(err)) return
        } finally {
            if (isCurrent(signal)) {
                isLoading.value = false
            }
        }
    }

    return {
        track,

        isLoading,

        abort,

        updateTrack,
    }
})

export default useCurrentTrackStore;