import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import useMenuStore from "./useMenuStore.ts";
import {Music, MusicForList} from "../types/music.ts";
import useControllersStore from "./useControllersStore.ts";
import {apiGetMusic} from "../api/music/music.ts";
import useItemsStore from "./useItemsStore.ts";

const useAudioStore = defineStore('audioStore', () => {
    const menuStore = useMenuStore();
    const controllersStore = useControllersStore();
    const itemsStore = useItemsStore();

    // аудио
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

    // функция для загрузки музыки по id (причем при клике на музыку, при next/prev у нас передается id, а при первоначальной загрузке или при переходе между музыкой/музыкой_артиста мы просто берем id первого трека)
    const updateMusic = async (id?: number) => {
        if (!itemsStore.musicList?.music?.length) return

        const usedId = id || itemsStore.musicList.music[menuStore.musicIndex].id
        const data = await apiGetMusic(usedId)

        if (data) {
            Object.assign(activeTrack, data)
            loadAndPlay()

            menuStore.musicIndex = itemsStore.musicList?.music.findIndex((music: MusicForList) => music.id === activeTrack.id) ?? 0

            if (controllersStore.mode === controllersStore.modesList.video && !activeTrack.video_clip_url) {
                controllersStore.mode = controllersStore.modesList.img
            }
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