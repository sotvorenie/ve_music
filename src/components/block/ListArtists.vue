<script setup lang="ts">
import {ref, watchEffect} from "vue";

import {apiGetAllArtists, apiSearchArtist} from "../../api/artist/artist.ts";

import FoxIcon from "../../assets/icons/FoxIcon.vue";

import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "../../store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();


itemsStore.artistsList = itemsStore.artistsList && artistStore.artistId >= 0 ? itemsStore.artistsList : await apiGetAllArtists(1, 21)

const handleArtist = (artistId: number, artistName: string) => {
  artistStore.artistId = artistId
  artistStore.artistName = artistName

  menuStore.listMode = menuStore.allListModes.artistMusic
}

const observerLi = ref<HTMLLIElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)

let observer: IntersectionObserver | null = null

const isFetching = ref<boolean>(false)

const addNewArtists = async () => {
  if (isFetching.value) return
  isFetching.value = true

  const page = itemsStore.artistsList!.page + 1

  let data

  if (searchStore.searchName) {
    data = await apiSearchArtist(searchStore.searchName, page)
  } else {
    data = await apiGetAllArtists(page)
  }

  if (data) {
    itemsStore.artistsList = {
      artists: [...itemsStore.artistsList!.artists, ...data.artists],
      total: data.total,
      page: data.page,
      limit: data.limit,
      has_more: data.has_more,
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
      if (entry.isIntersecting) {
        addNewArtists()
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
  if (!listRef.value || !itemsStore.artistsList?.artists?.length || !itemsStore.artistsList?.has_more) return

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

  <ul class="list" ref="listRef">
    <li v-for="(item, index) in itemsStore.artistsList?.artists"
        :key="item.id"
        class="list__item flex flex-align-center cursor-pointer"
        @click="handleArtist(item.id, item.name)"
        :ref="(el) => { if (index === itemsStore.artistsList!.artists.length - 2) observerLi = el as HTMLLIElement }"
    >
      <div class="list__artist-img-container img-container">
        <img v-if="item?.avatar_url" :src="`http://localhost:81/${item?.avatar_url}`" :alt="item?.name">
        <FoxIcon v-else/>
      </div>

      <p class="list__artist-name text-ellipsis">
        {{item?.name}}
      </p>
    </li>
  </ul>

</template>