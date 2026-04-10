<script setup lang="ts">
import {watch} from "vue";

import {showArtists} from "../../composables/useShowArtists.ts";
import formatTime from "../../composables/useFormatTime.ts";

import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();

watch(
    () => itemsStore.musicList,
    () => {
      menuStore.musicListLength = itemsStore.musicList?.total ? itemsStore.musicList.total : 0
    },
    {immediate: true}
)
</script>

<template>
  <ul class="list position-relative" v-if="itemsStore.musicList?.music?.length">
    <li v-for="item in itemsStore.musicList?.music"
        :key="item.id"
        class="list__item flex cursor-pointer flex-align-center"
        :class="{'is-active': item.id === audioStore.activeTrack.id}"
        @click="audioStore.updateMusic(item.id)"
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

    <li class="list__active active-index position-absolute w-100"
        :style="{'--active-index': String(menuStore.musicIndex)}"
    />
  </ul>
</template>