<script setup lang="ts">
import {ref, watchEffect} from "vue";

import {Artist} from "@/types/artist.ts";

import {BASE_URL} from "@api/url.ts";
import {apiGetArtists} from "@api/artist/artist.ts";

import FoxIcon from "@/components/icons/FoxIcon.vue";

import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();

itemsStore.artistsList = await apiGetArtists(1, 21)

const handleArtist = async (artist: Artist) => {
  artistStore.currentArtist = artist

  await itemsStore.getMusicList()

  menuStore.listMode = 'artistMusic'
}

const observerLi = ref<HTMLLIElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)

let observer: IntersectionObserver | null = null

const isFetching = ref<boolean>(false)

const addNewArtists = async () => {
  if (isFetching.value) return
  isFetching.value = true

  const page = itemsStore.artistsList!.page + 1

  const response = await apiGetArtists(page)

  if (response) {
    itemsStore.artistsList = {
      artists: [...itemsStore.artistsList!.artists, ...response.artists],
      total: response.total,
      page: response.page,
      limit: response.limit,
      hasMore: response.hasMore,
    }
  }

  isFetching.value = false
}

const initObserver = () => {
  const observerOptions = {
    root: listRef.value,
    rootMargin: '400px',
    threshold: 0,
  }
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) addNewArtists()
    })
  }

  observer = new IntersectionObserver(observerCallback, observerOptions)
  if (observerLi.value) observer.observe(observerLi.value)
}

const clearObserver = () => {
  if (observer) observer.disconnect()
}

watchEffect((onCleanup) => {
  if (!listRef.value || !itemsStore.artistsList?.artists?.length || !itemsStore.artistsList?.hasMore) return
  initObserver()
  if (observerLi.value) observer?.observe(observerLi.value)
  onCleanup(() => clearObserver())
})
</script>

<template>

  <ul class="list" ref="listRef" v-auto-animate>
    <li v-for="(item, index) in itemsStore.artistsList?.artists"
        :key="item.id"
        class="list__item flex flex-align-center cursor-pointer"
        @click="handleArtist(item)"
        :ref="(el) => { if (index === itemsStore.artistsList!.artists.length - 2) observerLi = el as HTMLLIElement }"
    >
      <div class="list__artist-img-container img-container">
        <img v-if="item?.avatarUrl" :src="`${BASE_URL}${item?.avatarUrl}`" :alt="item?.name">
        <FoxIcon v-else/>
      </div>

      <p class="list__artist-name text-ellipsis">
        {{item?.name}}
      </p>
    </li>
  </ul>

</template>