<script setup lang="ts">
import {computed} from "vue";

import {apiSearchMusic} from "../../api/music/music.ts";

import SearchIcon from "../../assets/icons/SearchIcon.vue";
import CrossIcon from "../../assets/icons/CrossIcon.vue";

import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useMusicStore from "../../store/useMusicStore.ts";
const musicStore = useMusicStore();


const allPlaceholders = {
  all: 'Поиск по всем песням',
  genre: 'Поиск песен в жанре',
  artists: 'Поиск исполнителя',
  artistSong: 'Поиск песен исполнителя'
}

const placeholder = computed(() => {
  if (menuStore.mode === menuStore.allModes.music && menuStore.activeGenreIndex === 0)
    return allPlaceholders.all
  if (menuStore.mode === menuStore.allModes.music && menuStore.activeGenreIndex > 0)
    return allPlaceholders.genre + ' ' + menuStore.activeGenreName
  if (menuStore.mode === menuStore.allModes.artists)
    return allPlaceholders.artists
  if (menuStore.mode === menuStore.allModes.artists && searchStore.activeArtistName)
    return allPlaceholders.artistSong + ' ' + searchStore.activeArtistName
})


const handleSearch = async () => {
  menuStore.musicIndex = 0

  if (menuStore.mode === menuStore.allModes.music) {
    musicStore.musicList = await apiSearchMusic(searchStore.searchName, 1, 21)
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
               :key="`${menuStore.mode}-${menuStore.activeGenreIndex}-${searchStore.activeArtistName}`"
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