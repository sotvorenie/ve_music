<script setup lang="ts">
import {watch} from "vue";

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
      if (menuStore.listMode === 'artistMusic') menuStore.clearGenre()
    }
)
</script>

<template>

  <div :class="[
           'list-wrapper absolute z-10 top-15',
           searchStore.isOpen && 'is-active'
       ]"
  >
    <div :class="[
              'list-tabs flex justify-center gap-5 mb-4 overflow-hidden max-h-50',
              menuStore.menuMode !== 'genres' && 'max-h-0 opacity-0'
          ]"
    >
      <ButtonUi :is-active="menuStore.listMode === 'music'"
                :is-disabled="!itemsStore.musicList.music?.length"
                @click="handleMusic"
      >
        Музыка
      </ButtonUi>

      <ButtonUi :is-active="menuStore.listMode === 'artists'"
                :is-disabled="!itemsStore.musicList.music?.length"
                @click="menuStore.listMode = 'artists'"
      >
        Исполнители
      </ButtonUi>
    </div>

    <span v-if="menuStore.listMode === 'artistMusic'"
          class="mb-10 text-ellipsis"
    >
      Музыка исполнителя {{artistStore.currentArtist.name}}
    </span>

    <div v-if="menuStore.listMode !== 'artists'"
         class="mb-2.5"
    >
      Треков: {{itemsStore.musicList?.total || 0}}
    </div>

    <div v-if="menuStore.listMode === 'artists'"
         class="mb-2.5"
    >
      Исполнителей: {{itemsStore.artistsList?.total || 0}}
    </div>

    <ListMusic v-if="menuStore.listMode !== 'artists'"/>

    <ListArtists v-else/>
  </div>

</template>