<script setup lang="ts">
import ListMusic from "@components/list/ListMusic.vue";
import ListArtists from "@components/list/ListArtists.vue";

import ButtonUi from "@ui/ButtonUi.vue";
import MusicListSkeleton from "@ui/skeletons/MusicListSkeleton.vue";

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

const listComponents = {
  music: ListMusic,
  artists: ListArtists,
}

const handleTracksTab = async () => {
  artistStore.abort()
  genresStore.currentGenre = genresStore.genres[0]
  menuStore.listMode = 'music';
}

const handleArtistsTab = async () => {
  tracksStore.abort()
  menuStore.listMode = 'artists'
}
</script>

<template>

  <div :class="[
           'list-wrapper absolute z-10 top-15 left-66 3xl:left-100 w-100 h-[80vh] transition-[transform,height] duration-500',
           searchStore.isOpen && 'h-[70vh] translate-y-20'
       ]"
  >
    <div :class="[
              'flex justify-center gap-5 mb-4 overflow-hidden transition-[max-height,opacity] duration-600',
              menuStore.menuMode !== 'genres' ? 'max-h-0 opacity-0' : 'max-h-50',
          ]"
    >
      <ButtonUi :is-active="menuStore.listMode === 'music'"
                @click="handleTracksTab"
      >
        Музыка
      </ButtonUi>

      <ButtonUi :is-active="menuStore.listMode === 'artists'"
                @click="handleArtistsTab"
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
    </template>

    <div v-if="menuStore.listMode === 'artists'" class="mb-2.5">
      Исполнителей: {{artistStore.meta.total || 0}}
    </div>

    <Suspense timeout="0">
      <template #default>
        <Component :is="listComponents[menuStore.listMode]"/>
      </template>
      <template #fallback>
        <MusicListSkeleton/>
      </template>
    </Suspense>
  </div>

</template>