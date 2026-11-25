<script setup lang="ts">
import ListMusic from "@components/list/ListMusic.vue";
import ListArtists from "@components/list/ListArtists.vue";

import ButtonUi from "@ui/ButtonUi.vue";

import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistsStore from "@store/useArtistsStore.ts";
const artistStore = useArtistsStore();
import useGenresStore from "@store/useGenresStore.ts";
const genresStore = useGenresStore();
import useTracksStore from "@store/music/useTracksStore.ts";
const tracksStore = useTracksStore();

const handleMusicTab = async () => {
  genresStore.currentGenre = genresStore.genres[0]
  menuStore.listMode = 'music';
}
</script>

<template>

  <div :class="[
           'list-wrapper absolute z-10 top-15 left-66 3xl:left-100 w-100 h-[80vh] transition-transform duration-500',
           searchStore.isOpen && 'is-active translate-y-20'
       ]"
  >
    <div :class="[
              'flex justify-center gap-5 mb-4 overflow-hidden transition-[max-height,opacity] duration-600',
              menuStore.menuMode !== 'genres' ? 'max-h-0 opacity-0' : 'max-h-50',
          ]"
    >
      <ButtonUi :is-active="menuStore.listMode === 'music'"
                @click="handleMusicTab"
      >
        Музыка
      </ButtonUi>

      <ButtonUi :is-active="menuStore.listMode === 'artists'"
                @click="menuStore.listMode = 'artists'"
      >
        Исполнители
      </ButtonUi>
    </div>

    <template v-if="menuStore.listMode === 'music'">
      <div v-if="artistStore.currentArtist.id >= 0"
           class="mb-2.5 truncate"
      >
        Музыка исполнителя {{artistStore.currentArtist.name}}
      </div>

      <div class="mb-2.5">
        Треков: {{tracksStore.meta.total || 0}}
      </div>

      <ListMusic/>
    </template>

    <template v-if="menuStore.listMode === 'artists'">
      <div class="mb-2.5">
        Исполнителей: {{artistStore.meta.total || 0}}
      </div>

      <ListArtists/>
    </template>
  </div>

</template>