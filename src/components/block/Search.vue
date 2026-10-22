<script setup lang="ts">
import {computed} from "vue";

import {debounce} from "@composables/useDebounce.ts";

import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import SearchIcon from "@/components/icons/SearchIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";

import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useGenreStore from "@store/useGenreStore.ts";
const genreStore = useGenreStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();


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
    if (menuStore.listMode === 'music' && genreStore.currentGenre.id === -1)
      return allPlaceholders.all
    if (menuStore.listMode === 'music' && genreStore.currentGenre.id >= 0)
      return allPlaceholders.genre + ' ' + genreStore.currentGenre.name
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
  menuStore.listMode === 'artists' ? artistStore.getArtists() : musicStore.getMusic()
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

  <div class="search">
    <Tooltip class="search__open !absolute z-10"
             position="bottom-right"
             has-delay
    >
      <template #activator>
        <Transition name="scale" mode="out-in">
          <button :key="`${searchStore.isOpen}`"
                  class="recolor-svg square-9 3xl:square-10 origin-right"
                  :disabled="!searchStore.isOpen && !searchStore.searchName && !musicStore.music?.length"
                  @click="searchStore.isOpen = !searchStore.isOpen"
                  title="Очистить поле"
                  type="button"
          >
            <SearchIcon v-if="!searchStore.isOpen"/>
            <CrossIcon v-else/>
          </button>
        </Transition>
      </template>

      <template #default>
        <Transition name="fade-fast" mode="out-in">
          <span :key="`${searchStore.isOpen}`">
            {{searchStore.isOpen ? 'Закрыть блок поиска' : 'Открыть блок поиска'}}
          </span>
        </Transition>
      </template>
    </Tooltip>

    <Transition name="list">
      <div v-if="searchStore.isOpen"
           class="search__content absolute z-10 flex overflow-hidden top-15 w-105 bg-dark-15 rounded-[1rem] border border-light"
      >
        <Transition :name="searchStore.searchName ? '' : 'fade'" mode="out-in">
          <input :key="`${menuStore.menuMode}-${menuStore.listMode}-${genreStore.currentGenre.id}`"
                 class="search__input w-full bg-transparent h-full !pr-25 3xl:!pr-27"
                 v-model="searchStore.searchName"
                 :placeholder="placeholder"
                 @keydown.enter="search"
                 @input="inputSearchName"
          >
        </Transition>

        <Transition name="scale">
          <button v-if="searchStore.searchName"
                  class="recolor-svg square-6 3xl:square-8 abs-y right-[14%] 3xl:right-[17%] flex-center"
                  @click="handleClear"
                  title="Очистить поле"
                  type="button"
          >
            <Icon :name="CrossIcon" :size="30" :laptop-size="24"/>
          </button>
        </Transition>

        <button :class="[
                  'recolor-svg absolute flex-center top-0 right-0 w-[12%] 3xl:w-[15%] h-full p-4 bg-dark-alt !transition-[translate,opacity]',
                  searchStore.searchName ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                ]"
                @click="search"
                title="Поиск"
                type="button"
        >
          <Icon :name="SearchIcon" :size="20"/>
        </button>
      </div>
    </Transition>
  </div>

</template>