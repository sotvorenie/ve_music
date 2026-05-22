<script setup lang="ts">
import ListMusic from "./ListMusic.vue";
import ListArtists from "./ListArtists.vue";

import ButtonUi from "../ui/ButtonUi.vue";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();
import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "../../store/useArtistStore.ts";
import {watch} from "vue";
const artistStore = useArtistStore();

await itemsStore.getMusicList()

const handleMusic = async () => {
  artistStore.artistId = -1
  await itemsStore.getMusicList()
  menuStore.listMode = menuStore.allListModes.music;
}

watch(
    () => menuStore.listMode,
    () => {
      if (menuStore.listMode === menuStore.allListModes.artistMusic) {
        menuStore.activeGenreId = -2
      }
    }
)
</script>

<template>

  <div class="list-wrapper position-absolute z-10"
       :class="{
         'is-active': searchStore.isOpen && menuStore.menuMode === menuStore.allMenuModes.genres
       }"
  >
    <div class="list-tabs flex flex-justify-center"
         :class="{'is-hidden': menuStore.menuMode !== menuStore.allMenuModes.genres}"
    >
      <ButtonUi :is-active="menuStore.listMode === menuStore.allListModes.music"
                @click="handleMusic"
      >Музыка</ButtonUi>
      <ButtonUi :is-active="menuStore.listMode === menuStore.allListModes.artists"
                @click="menuStore.listMode = menuStore.allListModes.artists"
      >Исполнители</ButtonUi>
    </div>

    <span v-if="menuStore.listMode === menuStore.allListModes.artistMusic" class="mb-10">
      Музыка исполнителя {{artistStore.artistName}}
    </span>

    <span class="list-number"
          v-if="menuStore.listMode !== menuStore.allListModes.artists"
    >
      Треков: {{itemsStore.musicList?.total || 0}}
    </span>
    <span class="list-number"
          v-if="menuStore.listMode === menuStore.allListModes.artists"
    >
      Исполнителей: {{itemsStore.artistsList?.total || 0}}
    </span>

    <ListMusic v-if="menuStore.listMode !== menuStore.allListModes.artists"/>

    <ListArtists v-else/>
  </div>

</template>