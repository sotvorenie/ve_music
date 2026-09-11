<script setup lang="ts">
import ListMusic from "@components/ListMusic.vue";
import ListArtists from "@components/ListArtists.vue";

import ButtonUi from "@ui/ButtonUi.vue";

import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "@store/useArtistStore.ts";
import {watch} from "vue";
const artistStore = useArtistStore();

await itemsStore.getMusicList()

const handleMusic = async () => {
  artistStore.currentArtist.id = -1
  await itemsStore.getMusicList()
  menuStore.listMode = 'music';
}

watch(
    () => menuStore.listMode,
    () => {
      if (menuStore.listMode === 'artistMusic') {
        menuStore.activeGenre.name = ''
        menuStore.activeGenre.id = -1
      }
    }
)
</script>

<template>

  <div class="list-wrapper position-absolute z-10"
       :class="{
         'is-active': searchStore.isOpen
       }"
  >
    <div class="list-tabs flex flex-justify-center"
         :class="{'is-hidden': menuStore.menuMode !== 'genres'}"
    >
      <ButtonUi :is-active="menuStore.listMode === 'music'"
                @click="handleMusic"
      >Музыка</ButtonUi>
      <ButtonUi :is-active="menuStore.listMode === 'artists'"
                @click="menuStore.listMode = 'artists'"
      >Исполнители</ButtonUi>
    </div>

    <span v-if="menuStore.listMode === 'artistMusic'" class="mb-10 text-ellipsis">
      Музыка исполнителя {{artistStore.currentArtist.name}}
    </span>

    <span class="list-number" v-if="menuStore.listMode !== 'artists'">
      Треков: {{itemsStore.musicList?.total || 0}}
    </span>
    <span class="list-number" v-if="menuStore.listMode === 'artists'">
      Исполнителей: {{itemsStore.artistsList?.total || 0}}
    </span>

    <ListMusic v-if="menuStore.listMode !== 'artists'"/>

    <ListArtists v-else/>
  </div>

</template>