<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

import {showArtists} from "../../composables/useShowArtists.ts";
import formatTime from "../../composables/useFormatTime.ts";

import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "../../store/useControllersStore.ts";
import {apiGetMusic} from "../../api/music/music.ts";
const controllersStore = useControllersStore();


const musicActive = ref<HTMLLIElement | null>(null)

const handleMusicItem = (index: number, id: number) => {
  menuStore.musicIndex = index
  updateMusic(id)
}

const updateMusicBlock = () => {
  if (!musicActive.value) return

  musicActive.value.style.setProperty('--active-index', String(menuStore.musicIndex))
}

const updateMusic = async (id?: number) => {
  if (!itemsStore.musicList?.music?.length || !itemsStore.musicList?.music[menuStore.musicIndex]?.id) return

  updateMusicBlock()

  const usedId = id || itemsStore.musicList.music[menuStore.musicIndex].id
  const data = await apiGetMusic(usedId)

  if (data) {
    Object.assign(audioStore.activeTrack, data)
    audioStore.loadAndPlay()

    if (controllersStore.mode === controllersStore.modesList.video && !audioStore.activeTrack.video_clip_url) {
      controllersStore.mode = controllersStore.modesList.img
    }
  }
}


watch(
    () => [itemsStore.musicList, menuStore.musicIndex],
    async () => {
      await updateMusic()
      menuStore.musicListLength = itemsStore.musicList?.total ? itemsStore.musicList.total : 0
    },
    {immediate: true}
)

onMounted(() => updateMusicBlock())
</script>

<template>
  <ul class="list position-relative" v-if="itemsStore.musicList?.music?.length">
    <li v-for="(item, index) in itemsStore.musicList?.music"
        :key="item.id"
        class="list__item flex cursor-pointer flex-align-center"
        :class="{'is-active': menuStore.musicIndex === index}"
        @click="handleMusicItem(index, item.id)"
    >
      <div class="list__left img-container">
        <img v-if="item?.preview_url" :src="`http://localhost:81/${item?.preview_url}`" :alt="item?.name">
      </div>
      <div class="list__right overflow-hidden">
        <p class="list__name text-w500 text-ellipsis">{{item?.name}}</p>
        <p class="list__artist text-ellipsis">{{showArtists(item?.artists)}}</p>
        <p class="list__duration">{{formatTime(item.duration)}}</p>
      </div>
    </li>
    <li class="list__active active-index position-absolute w-100" ref="musicActive"/>
  </ul>
</template>