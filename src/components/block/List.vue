<script setup lang="ts">
import {ref, watch} from "vue";

import {apiGetArtistsMusic} from "../../api/artist/artist.ts";
import {apiGetAllMusic} from "../../api/music/music.ts";

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
const artistStore = useArtistStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();

itemsStore.musicList = await apiGetAllMusic()
await audioStore.updateMusic()

const isLoadingMusicList = ref<boolean>(false)

watch(
    () => menuStore.listMode,
    async (newVal: string, oldVal: string) => {

      isLoadingMusicList.value = true
      if (oldVal === menuStore.allListModes.artistMusic) {
        itemsStore.musicList = await apiGetAllMusic()

        if (itemsStore.musicList?.music?.length) {
          await audioStore.updateMusic()
        }
      } else if (newVal === menuStore.allListModes.artistMusic) {
        itemsStore.musicList = await apiGetArtistsMusic(artistStore.artistId)

        if (itemsStore.musicList?.music?.length) {
          await audioStore.updateMusic()
        }
      }

      isLoadingMusicList.value = false
    }
)
</script>

<template>

  <div class="list-wrapper position-absolute z-10" :class="{'is-active': searchStore.isOpen}">
    <div class="list-tabs flex flex-justify-center"
         :class="{'is-hidden': menuStore.menuMode !== menuStore.allMenuModes.genres}"
    >
      <ButtonUi :is-active="menuStore.listMode === menuStore.allListModes.music"
                @click="menuStore.listMode = menuStore.allListModes.music"
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

    <MusicListSkeleton v-if="isLoadingMusicList"/>

    <template v-else>
      <ListMusic v-show="menuStore.listMode !== menuStore.allListModes.artists"/>

      <ListArtists v-show="menuStore.listMode === menuStore.allListModes.artists"/>
    </template>
  </div>

</template>