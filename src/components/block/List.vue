<script setup lang="ts">
import {ref, watch} from "vue";

import {apiGetAllMusic, apiGetMusic} from "../../api/music/music.ts";

import {showArtists} from "../../composables/useShowArtists.ts";
import formatTime from "../../composables/useFormatTime.ts";

import ButtonUi from "../ui/ButtonUi.vue";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "../../store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMusicStore from "../../store/useMusicStore.ts";
const musicStore = useMusicStore();


const musicActive = ref<HTMLLIElement | null>(null)

const updateMusicBlock = () => {
  if (!musicActive.value) return

  musicActive.value.style.setProperty('--active-index', String(menuStore.musicIndex))
}

const updateMusic = async (id?: number) => {
  if (!musicStore.musicList?.music?.length || !musicStore.musicList?.music[menuStore.musicIndex]?.id) return

  updateMusicBlock()

  const usedId = id || musicStore.musicList.music[menuStore.musicIndex].id
  const data = await apiGetMusic(usedId)
  if (data) {
    Object.assign(audioStore.activeTrack, data)
    audioStore.loadAndPlay()

    if (controllersStore.mode === controllersStore.modesList.video && !audioStore.activeTrack.video_clip_url) {
      controllersStore.mode = controllersStore.modesList.img
    }
  }
}

const handleMusicItem = (index: number, id: number) => {
  menuStore.musicIndex = index
  updateMusic(id)
}

musicStore.musicList = await apiGetAllMusic()

watch(
    () => musicStore.musicList,
    async () => {
      await updateMusic()
      menuStore.musicListLength = musicStore.musicList?.total ? musicStore.musicList.total : 0
    },
    {immediate: true}
)
</script>

<template>

  <div class="list-wrapper position-absolute z-10" :class="{'is-active': searchStore.isOpen}">
    <div class="list-tabs flex flex-justify-center">
      <ButtonUi :is-active="menuStore.mode === menuStore.allModes.music"
                @click="menuStore.mode = menuStore.allModes.music"
      >Музыка</ButtonUi>
      <ButtonUi :is-active="menuStore.mode === menuStore.allModes.artists"
                @click="menuStore.mode = menuStore.allModes.artists"
      >Исполнители</ButtonUi>
    </div>

    <span class="list-number">Треков: {{musicStore.musicList?.total}}</span>

    <ul class="list" v-if="musicStore.musicList?.music?.length">
      <li v-for="(item, index) in musicStore.musicList?.music"
          :key="item.id"
          class="list__item flex cursor-pointer flex-align-center"
          :class="{'is-active': menuStore.musicIndex === index}"
          @click="handleMusicItem(index, item.id)"
      >
        <div class="list__left img-container">
          <img v-if="item?.preview_url" :src="`http://localhost:81/${item?.preview_url}`" :alt="item?.name">
        </div>
        <div class="list__right overflow-hidden">
          <p class="list__name text-w500 w-100 overflow-hidden text-nowrap">{{item?.name}}</p>
          <p class="list__artist w-100 overflow-hidden text-nowrap">{{showArtists(item?.artists)}}</p>
          <p class="list__duration">{{formatTime(item.duration)}}</p>
        </div>
      </li>
      <li class="list__active active-index position-absolute w-100" ref="musicActive"/>
    </ul>
  </div>

</template>