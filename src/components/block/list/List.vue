<script setup lang="ts">
import ListMusic from "@components/list/ListMusic.vue";
import ListArtists from "@components/list/ListArtists.vue";

import ButtonUi from "@ui/ButtonUi.vue";

import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();
import useGenreStore from "@store/useGenreStore.ts";
const genresStore = useGenreStore();

await musicStore.getMusic()

const handleMusicTab = async () => {
  artistStore.currentArtist.id = -1
  genresStore.currentGenre = genresStore.genres[0]
  await musicStore.getMusic()
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

    <div v-if="menuStore.listMode === 'artistMusic'"
         class="mb-2.5 truncate"
    >
      Музыка исполнителя {{artistStore.currentArtist.name}}
    </div>

    <div v-if="menuStore.listMode !== 'artists'"
         class="mb-2.5"
    >
      Треков: {{musicStore.total || 0}}
    </div>

    <div v-if="menuStore.listMode === 'artists'"
         class="mb-2.5"
    >
      Исполнителей: {{artistStore.total || 0}}
    </div>

    <ListMusic v-if="menuStore.listMode !== 'artists'"/>

    <ListArtists v-else/>
  </div>

</template>