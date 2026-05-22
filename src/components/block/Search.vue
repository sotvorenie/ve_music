<script setup lang="ts">
import {computed} from "vue";

import {debounce} from "../../composables/useDebounce.ts";

import SearchIcon from "../../assets/icons/SearchIcon.vue";
import CrossIcon from "../../assets/icons/CrossIcon.vue";

import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "../../store/useArtistStore.ts";
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
  if (menuStore.menuMode === menuStore.allMenuModes.genres) {
    if (menuStore.listMode === menuStore.allListModes.music && menuStore.activeGenreId === -1)
      return allPlaceholders.all
    if (menuStore.listMode === menuStore.allListModes.music && menuStore.activeGenreId >= 0)
      return allPlaceholders.genre + ' ' + menuStore.activeGenreName
    if (menuStore.listMode === menuStore.allListModes.artists)
      return allPlaceholders.artists
    if (menuStore.listMode === menuStore.allListModes.artistMusic)
      return allPlaceholders.artistSong + ' ' + artistStore.artistName
  }
  if (menuStore.menuMode === menuStore.allMenuModes.history)
    return allPlaceholders.history
  if (menuStore.menuMode === menuStore.allMenuModes.favorites)
    return allPlaceholders.favorites
})

const handleClear = () => {
  searchStore.searchName = ''
  itemsStore.getMusicList()
}

const inputSearchName = debounce(() => {
  itemsStore.getMusicList()
}, 500)

const handleSearch = () => {
  itemsStore.getMusicList()
}
</script>

<template>

  <Transition name="scale">
    <button class="search__open recolor-svg position-absolute hover-color-accent z-10"
            type="button"
            :title="searchStore.isOpen ? 'Закрыть блок поиска' : 'Открыть блок поиска'"
            @click="searchStore.isOpen = !searchStore.isOpen"
            :key="`${searchStore.isOpen}`"
    >
      <SearchIcon v-if="!searchStore.isOpen"/>
      <CrossIcon v-else/>
    </button>
  </Transition>

  <Transition name="list">
    <div class="search__content position-absolute z-10 flex overflow-hidden"
         v-if="searchStore.isOpen"
    >
      <Transition name="fade" mode="out-in">
        <input type="text"
               class="search__input w-100"
               :key="`${menuStore.menuMode}-${menuStore.listMode}-${menuStore.activeGenreId}`"
               v-model="searchStore.searchName"
               :title="searchStore.searchName"
               :placeholder="placeholder"
               @keydown.enter="handleSearch"
               @input="inputSearchName"
        >
      </Transition>

      <Transition name="scale">
        <button class="search__clear recolor-svg hover-color-accent position-absolute"
                type="button"
                title="Очистить поле"
                v-if="searchStore.searchName"
                @click="handleClear"
        >
          <CrossIcon/>
        </button>
      </Transition>

      <button class="search__submit recolor-svg hover-color-accent position-absolute flex-center"
              :class="{'is-active': searchStore.searchName}"
              type="button"
              title="Поиск"
              @click="handleSearch"
      >
        <SearchIcon/>
      </button>
    </div>
  </Transition>

</template>