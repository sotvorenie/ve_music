<script setup lang="ts">
import {computed} from "vue";

import {apiSearchMusic} from "../../api/music/music.ts";
import {apiSearchArtist, apiSearchArtistsMusic} from "../../api/artist/artist.ts";

import SearchIcon from "../../assets/icons/SearchIcon.vue";
import CrossIcon from "../../assets/icons/CrossIcon.vue";

import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "../../store/useArtistStore.ts";
import {apiSearchGenresMusic} from "../../api/genre/genre.ts";
const artistStore = useArtistStore();


const allPlaceholders = {
  all: 'Поиск по всем трекам',
  genre: 'Поиск треков в жанре',
  artists: 'Поиск исполнителя',
  artistSong: 'Поиск треков исполнителя'
}

const placeholder = computed(() => {
  if (menuStore.listMode === menuStore.allListModes.music && menuStore.activeGenreIndex === 0)
    return allPlaceholders.all
  if (menuStore.listMode === menuStore.allListModes.music && menuStore.activeGenreIndex > 0)
    return allPlaceholders.genre + ' ' + menuStore.activeGenreName
  if (menuStore.listMode === menuStore.allListModes.artists)
    return allPlaceholders.artists
  if (menuStore.listMode === menuStore.allListModes.artistMusic)
    return allPlaceholders.artistSong + ' ' + artistStore.artistName
})


const handleSearch = async () => {
  menuStore.musicIndex = 0

  if (menuStore.listMode === menuStore.allListModes.music) {
    if (menuStore.activeGenreId < 0) {
      itemsStore.musicList = await apiSearchMusic(searchStore.searchName, itemsStore.page, 21)
    } else {
      itemsStore.musicList = await apiSearchGenresMusic(searchStore.searchName, menuStore.activeGenreId, itemsStore.page, 21)
    }
  } else if (menuStore.listMode === menuStore.allListModes.artists) {
    itemsStore.artistsList = await apiSearchArtist(searchStore.searchName, itemsStore.page, 21)
  } else if (menuStore.listMode === menuStore.allListModes.artistMusic) {
    itemsStore.musicList = await apiSearchArtistsMusic(searchStore.searchName, artistStore.artistId, itemsStore.page, 21)
  }
}

</script>

<template>

  <Transition name="scale">
    <button class="search__open recolor-svg position-absolute hover-color-accent z-10"
            type="button"
            title="Открыть блок поиска"
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
               :key="`${menuStore.listMode}-${menuStore.activeGenreIndex}`"
               v-model="searchStore.searchName"
               :title="searchStore.searchName"
               :placeholder="placeholder"
               @keydown.enter="handleSearch"
        >
      </Transition>

      <Transition name="scale">
        <button class="search__clear recolor-svg hover-color-accent position-absolute"
                type="button"
                title="Очистить поле"
                v-if="searchStore.searchName"
                @click="searchStore.searchName = ''"
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