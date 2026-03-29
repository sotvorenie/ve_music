<script setup lang="ts">

import {apiGetAllArtists} from "../../api/artist/artist.ts";

import FoxIcon from "../../assets/icons/FoxIcon.vue";

import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "../../store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();


itemsStore.artistsList = itemsStore.artistsList ? itemsStore.artistsList : await apiGetAllArtists(1, 21)

const handleArtist = (artistId: number, artistName: string) => {
  artistStore.artistId = artistId
  artistStore.artistName = artistName

  menuStore.listMode = menuStore.allListModes.artistMusic
}
</script>

<template>

  <ul class="list">
    <li v-for="item in itemsStore.artistsList?.artists"
        :key="item.id"
        class="list__item flex flex-align-center cursor-pointer"
        @click="handleArtist(item.id, item.name)"
    >
      <div class="list__artist-img-container img-container">
        <img v-if="item?.avatar_url" :src="`http://localhost:81/${item?.avatar_url}`" :alt="item?.name">
        <FoxIcon v-else/>
      </div>

      <p class="list__artist-name text-ellipsis">
        {{item?.name}}
      </p>
    </li>
  </ul>

</template>