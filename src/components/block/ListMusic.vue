<script setup lang="ts">
import {ref, watchEffect} from "vue";

import {BASE_URL} from "@api/url.ts";

import {showArtists} from "@composables/useShowArtists.ts";
import {formatTime} from "@composables/useFormatTime.ts";

import Empty from "@ui/empty/Empty.vue";

import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const observerLi = ref<HTMLLIElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)

let observer: IntersectionObserver | null = null

const initObserver = () => {
  const observerOptions = {
    root: listRef.value,
    rootMargin: '400px',
    threshold: 0,
  }
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        itemsStore.getMusicList(itemsStore.musicList!.page + 1)
      }
    })
  }

  observer = new IntersectionObserver(observerCallback, observerOptions)
  if (observerLi.value) observer.observe(observerLi.value)
}

const clearObserver = () => {
  if (observer) observer.disconnect()
}

watchEffect((onCleanup) => {
  if (!listRef.value || !itemsStore.musicList?.music?.length || !itemsStore.musicList?.hasMore) return

  initObserver()

  if (observerLi.value) {
    observer?.observe(observerLi.value)
  }

  onCleanup(() => {
    clearObserver()
  })
})
</script>

<template>
  <ul class="list position-relative"
      v-if="itemsStore.musicList?.music?.length"
      ref="listRef"
  >
    <li v-for="(item, index) in itemsStore.musicList?.music"
        :key="item.id"
        class="list__item flex cursor-pointer flex-align-center"
        :class="{'is-active': item.id === audioStore.activeTrack.id}"
        @click="audioStore.updateMusic(item.id)"
        :ref="(el) => { if (index === itemsStore.musicList!.music.length - 2) observerLi = el as HTMLLIElement }"
    >
      <div class="list__left img-container">
        <img v-if="item?.previewUrl" :src="`${BASE_URL}${item?.previewUrl}`" :alt="item?.name">
      </div>
      <div class="list__right overflow-hidden">
        <p class="list__name text-w500 text-ellipsis">{{item?.name}}</p>
        <p class="list__artist text-ellipsis">{{showArtists(item?.artists)}}</p>
        <p class="list__duration">{{formatTime(item.duration)}}</p>
      </div>
    </li>
  </ul>

  <Transition name="list">
    <Empty v-if="!itemsStore.musicList?.music?.length"/>
  </Transition>
</template>