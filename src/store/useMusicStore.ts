import {defineStore} from "pinia";
import {ref} from "vue";

import {Track, TrackPreview} from "@/types/music.ts";
import {Meta} from "@/types/meta.ts";

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
        previewX480Url: null,
        videoClipUrl: '',
        isLiked: false,
        artists: [{id: -1, name: '', avatarUrl: ''}],
        genre: {id: -1, name: ''},
        segmentsCount: 0,
        bitrates: [],
    })

    const tracks = ref<TrackPreview[]>([])

    const isLoading = ref<boolean>(false)
    const meta = ref<Meta>({
        page: 1,
        limit: 21,
        total: 0,
        hasMore: true,
    })

    const randomIds = ref<number[]>([])
    const randomSeed = ref<number>((Math.random() * 2) - 1)
    const randomIndex = ref<number>(0)

    const getMusic = async (isClear: boolean = false) => {
        if (isClear) {
            tracks.value = []
            meta.value = {
                page: 1,
                limit: 21,
                total: 0,
                hasMore: true,
            }
        }

        try {
            isLoading.value = true

            const allApis = {
                genres: () => MusicService.getTracks(
                    searchStore.searchName,
                    artistStore.currentArtist?.id,
                    genresStore.currentGenre?.id,
                    meta.value.page,
                    meta.value.limit,
                ),

                history: () => HistoryService.getHistory(
                    searchStore.searchName,
                    meta.value.page,
                    meta.value.limit,
                ),

                favorites: () => LikeService.getLikedTracks(
                    searchStore.searchName,
                    meta.value.page,
                    meta.value.limit,
                ),
            }

            const response = await allApis?.[menuStore.menuMode]?.()

            tracks.value.push(...response.data)
            meta.value = {
                ...response.meta,
                page: response.meta.page + 1
            }
        } catch (err: any) {
            await showError(
                'Что-то пошло не так',
                err?.detail ?? 'Не удалось загрузить треки..'
            )
        } finally {
            isLoading.value = false
        }
    }

    const saveMusicInLocStore = (musicId: number) => {
        if (!Number.isNaN(musicId)) {
            localStorage.setItem('last-track', String(musicId))
        }
    }

    const updateMusic = async (
        id: number | undefined,
        music: Track | null = null,
        setView: boolean = true,
    ) => {
        if (activeTrack.value.id === id) return

        try {
            controllersStore.isLoading = true

            let data = music

            if (data) {
                Object.assign(activeTrack.value, data)
            }

            if (id) {
                data = await MusicService.getTrack(id, setView)
            }

            if (data) {
                saveMusicInLocStore(data.id)
                Object.assign(activeTrack.value, data)
                audioStore.loadAndPlay()

                if (controllersStore.mode === 'video' && !activeTrack.value.videoClipUrl) {
                    controllersStore.mode = 'img'
                }
            }
        } catch {} finally {
            controllersStore.isLoading = false
        }
    }

    return {
        activeTrack,
        tracks,

        meta,
        isLoading,

        randomIds,
        randomSeed,
        randomIndex,

        getMusic,
        updateMusic,
    }
})

export default useMusicStore;