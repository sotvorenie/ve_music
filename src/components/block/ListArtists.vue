<script setup lang="ts">
import {ref} from "vue";

import {Artist} from "@/types/artist.ts";

import {BASE_URL} from "@api/url.ts";
import {apiGetArtists} from "@api/artist/artist.ts";

import {useObserve} from "@composables/useObserve.ts";

import FoxIcon from "@/components/icons/FoxIcon.vue";

import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();

itemsStore.artistsList = await apiGetArtists(1, 21)

const handleArtist = async (artist: Artist) => {
  artistStore.currentArtist = artist

  await itemsStore.getMusicList()

  menuStore.listMode = 'artistMusic'
}

const listRef = ref<HTMLUListElement | null>(null)
const lastLiRef = ref<HTMLLIElement | null>(null)

useObserve(
    lastLiRef,
    () => itemsStore.getArtistsList(),
    itemsStore.artistsList?.hasMore
)
</script>

<template>

  <ul class="list" ref="listRef" v-auto-animate>
    <li v-for="item in itemsStore.artistsList?.artists"
        :key="item.id"
        class="list__item flex flex-align-center cursor-pointer"
        @click="handleArtist(item)"
    >
      <div class="list__artist-img-container img-container">
        <img v-if="item?.avatarUrl" :src="`${BASE_URL}${item?.avatarUrl}`" :alt="item?.name">
        <FoxIcon v-else/>
      </div>

      <p class="list__artist-name text-ellipsis">
        {{item?.name}}
      </p>
    </li>

    <li style="height: 1px" ref="lastLiRef"/>
  </ul>

</template>