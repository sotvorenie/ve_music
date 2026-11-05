import {defineStore} from "pinia";
import {ref} from "vue";

import {Track, TrackPreview} from "@/types/music.ts";

import {MusicService} from "@api/music/MusicService.ts";
import {HistoryService} from "@api/history/HistoryService.ts";
import {LikeService} from "@api/like/LikeService.ts";

import {showError} from "@utils/modals.ts";

import useSearchStore from "@store/useSearchStore.ts";
import useArtistStore from "@store/useArtistStore.ts";
import useGenresStore from "@store/useGenresStore.ts";
import useMenuStore from "@store/useMenuStore.ts";
import useControllersStore from "@store/useControllersStore.ts";
import useAudioStore from "@store/useAudioStore.ts";

const useMusicStore = defineStore("musicStore", () => {
    const searchStore = useSearchStore();
    const artistStore = useArtistStore();
    const genresStore = useGenresStore();
    const menuStore = useMenuStore();
    const controllersStore = useControllersStore();
    const audioStore = useAudioStore();

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
        bitrates: [],
    })

    const tracks = ref<TrackPreview[]>([])

    const page = ref<number>(1)
    const limit = ref<number>(21)
    const total = ref<number>(0)
    const hasMore = ref<boolean>(true)

    const randomIds = ref<number[]>([])
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    const randomIndex = ref<number>(0)

    const getMusic = async (isClear: boolean = false) => {
        if (isClear) {
            tracks.value = []
            page.value = 1
            hasMore.value = true
            total.value = 0
        }

        try {
            const allApis = {
                genres: () => MusicService.getTracks(
                    searchStore.searchName,
                    artistStore.currentArtist?.id,
                    genresStore.currentGenre?.id,
                    page.value,
                    limit.value
                ),

                history: () => HistoryService.getHistory(
                    searchStore.searchName,
                    page.value,
                    limit.value
                ),

                favorites: () => LikeService.getLikedTracks(
                    searchStore.searchName,
                    page.value,
                    limit.value
                ),
            }

            const response = await allApis?.[menuStore.menuMode]?.()

            if (response) {
                tracks.value.push(...response.data)
                limit.value = response.meta.limit
                hasMore.value = response.meta.hasMore
                page.value += 1
                total.value = response.meta.total
            }
        } catch (err: any) {
            await showError(
                'Не удалось загрузить треки..',
                err?.detail
            )
        }
    }

    const saveMusicInLocStore = (musicId: number) => {
        if (!Number.isNaN(musicId)) localStorage.setItem('last-track', String(musicId))
    }

    const updateMusic = async (
        id: number | undefined,
        music: Track | null = null,
        setView: boolean = true,
    ) => {
        try {
            controllersStore.isLoading = true

            let data = music

            if (data) Object.assign(activeTrack.value, data)

            if (id) data = await MusicService.getTrack(id, setView)

            if (data) {
                saveMusicInLocStore(data.id)
                Object.assign(activeTrack.value, data)
                audioStore.loadAndPlay()

                if (controllersStore.mode === 'video' && !activeTrack.value.videoClipUrl) controllersStore.mode = 'img'
            }
        } finally {
            controllersStore.isLoading = false
        }
    }

    return {
        activeTrack,
        tracks,

        page,
        limit,
        total,
        hasMore,

        randomIds,
        randomSeed,
        randomIndex,

        getMusic,
        updateMusic,
    }
})

export default useMusicStore;