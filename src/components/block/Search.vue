<script setup lang="ts">
import {computed} from "vue";

import {debounce} from "@composables/useDebounce.ts";

import SearchIcon from "@/components/icons/SearchIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";

import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();


const allPlaceholders = {
  all: 'Поиск по всем трекам',
  genre: 'Поиск треков в жанре',
  artists: 'Поиск исполнителя',
  artistSong: 'Поиск треков исполнителя',
  history: 'Поиск треков в истории',
  favorites: 'Поиск треков в избранном',
}

const placeholder = computed(() => {
  if (menuStore.menuMode === 'genres') {
    if (menuStore.listMode === 'music' && menuStore.activeGenre.id === -1)
      return allPlaceholders.all
    if (menuStore.listMode === 'music' && menuStore.activeGenre.id >= 0)
      return allPlaceholders.genre + ' ' + menuStore.activeGenre.name
    if (menuStore.listMode === 'artists')
      return allPlaceholders.artists
    if (menuStore.listMode === 'artistMusic')
      return allPlaceholders.artistSong + ' ' + artistStore.currentArtist.name
  }
  if (menuStore.menuMode === 'history')
    return allPlaceholders.history
  if (menuStore.menuMode === 'favorites')
    return allPlaceholders.favorites
})

const search = () => {
  menuStore.listMode === 'artists' ? itemsStore.getArtistsList() : itemsStore.getMusicList()
}

const handleClear = () => {
  searchStore.searchName = ''
  search()
}

const inputSearchName = debounce(() => {
  search()
}, 500)
</script>

<template>

  <Transition name="scale">
    <button :key="`${searchStore.isOpen}`"
            class="search__open square-35 3xl:square-40 recolor-svg absolute z-10"
            :title="searchStore.isOpen ? 'Закрыть блок поиска' : 'Открыть блок поиска'"
            :disabled="!itemsStore.musicList.music?.length"
            @click="searchStore.isOpen = !searchStore.isOpen"
            type="button"
    >
      <SearchIcon v-if="!searchStore.isOpen"/>
      <CrossIcon v-else/>
    </button>
  </Transition>

  <Transition name="list">
    <div v-if="searchStore.isOpen"
         class="search__content absolute z-10 flex overflow-hidden top-15 w-105 bg-dark-15 rounded-[1rem] border border-light"
    >
      <Transition name="fade" mode="out-in">
        <input :key="`${menuStore.menuMode}-${menuStore.listMode}-${menuStore.activeGenre?.id}`"
               class="search__input w-full bg-transparent h-full"
               v-model="searchStore.searchName"
               :title="searchStore.searchName"
               :placeholder="placeholder"
               @keydown.enter="search"
               @input="inputSearchName"
        >
      </Transition>

      <Transition name="scale">
        <button v-if="searchStore.searchName"
                class="recolor-svg square-25 3xl:square-30 abs-y right-[14%] 3xl:right-[20%] origin-top-right"
                @click="handleClear"
                title="Очистить поле"
                type="button"
        >
          <CrossIcon/>
        </button>
      </Transition>

      <button :class="[
                  'recolor-svg absolute flex-center top-0 right-0 w-[12%] 3xl:w-[15%] h-full p-4 bg-dark-alt transition-[transform,opacity] opacity-0 translate-x-full',
                  searchStore.searchName && 'translate-x-0 opacity-100'
              ]"
              @click="search"
              title="Поиск"
              type="button"
      >
        <SearchIcon class="w-full h-auto"/>
      </button>
    </div>
  </Transition>

</template>