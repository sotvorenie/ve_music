<script setup lang="ts">
import {ref, watch} from "vue";

import {MusicList} from "../../types/music.ts";

import {apiGetAllMusic, apiGetMusic} from "../../api/music/music.ts";

import {showArtists} from "../../composables/useShowArtists.ts";
import formatTime from "../../composables/useFormatTime.ts";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "../../store/useControllersStore.ts";
const controllersStore = useControllersStore();


const musicActive = ref<HTMLLIElement | null>(null)

const musicList = ref<MusicList>()

const updateMusicBlock = () => {
  if (!musicActive.value) return

  musicActive.value.style.setProperty('--active-index', String(menuStore.musicIndex))
}

const updateMusic = async () => {
  if (!musicList.value?.music[menuStore.musicIndex].id) return

  updateMusicBlock()

  const id = musicList.value.music[menuStore.musicIndex].id
  const data = await apiGetMusic(id)
  if (data) {
    Object.assign(audioStore.activeTrack, data)
    audioStore.loadAndPlay()

    if (controllersStore.mode === controllersStore.modesList.video && !audioStore.activeTrack.video_clip_url) {
      controllersStore.mode = controllersStore.modesList.img
    }
  }
}

const handleMusicItem = (index: number) => {
  menuStore.musicIndex = index
}

musicList.value = await apiGetAllMusic()

watch(
    () => [menuStore.musicIndex, musicList.value],
    updateMusic,
    { immediate: true }
)
watch(
    () => musicList.value,
    () => menuStore.musicListLength = musicList.value?.total ? musicList.value.total : 0,
    {immediate: true}
)
</script>

<template>

  <ul class="list position-absolute z-10">
    <li v-for="(item, index) in musicList?.music"
        :key="item.id"
        class="list__item flex cursor-pointer flex-align-center"
        :class="{'is-active': menuStore.musicIndex === index}"
        @click="handleMusicItem(index)"
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

</template>