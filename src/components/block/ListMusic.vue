<script setup lang="ts">
import {ref, watch, watchEffect} from "vue";

import {apiGetAllMusic, apiSearchMusic} from "../../api/music/music.ts";
import {apiGetGenresMusic, apiSearchGenresMusic} from "../../api/genre/genre.ts";
import {apiGetArtistsMusic, apiSearchArtistsMusic} from "../../api/artist/artist.ts";

import {showArtists} from "../../composables/useShowArtists.ts";
import formatTime from "../../composables/useFormatTime.ts";

import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistStore from "../../store/useArtistStore.ts";
const artistStore = useArtistStore();


const observerLi = ref<HTMLLIElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)

let observer: IntersectionObserver | null = null

const isFetching = ref<boolean>(false)

const initObserver = () => {
  const observerOptions = {
    root: listRef.value,
    rootMargin: '400px',
    threshold: 0,
  }
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        addNewMusic()
      }
    })
  }

  observer = new IntersectionObserver(observerCallback, observerOptions)
  if (observerLi.value) observer.observe(observerLi.value)
}

const clearObserver = () => {
  if (observer) observer.disconnect()
}

const addNewMusic = async () => {
  if (isFetching.value) return
  isFetching.value = true

  const page = itemsStore.musicList!.page + 1

  let data

  if (artistStore.artistId >= 0) {
    if (searchStore.searchName) {
      data = await apiSearchArtistsMusic(searchStore.searchName, artistStore.artistId, page)
    } else {
      data = await apiGetArtistsMusic(artistStore.artistId, page)
    }
  } else if (menuStore.activeGenreId < 0) {
    if (searchStore.searchName) {
      data = await apiSearchMusic(searchStore.searchName, page)
    } else {
      data = await apiGetAllMusic(page)
    }
  } else if (searchStore.searchName) {
    data = await apiSearchGenresMusic(searchStore.searchName, menuStore.activeGenreId, page)
  } else {
    data = await apiGetGenresMusic(menuStore.activeGenreId, page)
  }

  if (data) {
    itemsStore.musicList = {
      music: [...itemsStore.musicList!.music, ...data.music],
      total: data.total,
      page: data.page,
      limit: data.limit,
      has_more: data.has_more,
    }
  }

  isFetching.value = false
}

watch(
    () => itemsStore.musicList,
    () => {
      menuStore.musicListLength = itemsStore.musicList?.total ? itemsStore.musicList.total : 0
    },
    {immediate: true}
)

watchEffect((onCleanup) => {
  if (!listRef.value || !itemsStore.musicList?.music?.length || !itemsStore.musicList?.has_more) return

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