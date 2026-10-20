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

  <ul class="grid overflow-y-auto max-h-[80vh] pr-2.5 overflow-x-hidden h-full"
      ref="listRef"
      v-auto-animate
  >
    <li v-for="item in itemsStore.artistsList?.artists"
        :key="item.id"
        class="list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] w-100 group hover:bg-[color-mix(in srgb, var(--color-dark-15), transparent 50%)]"
        @click="handleArtist(item)"
    >
      <div class="img-container square-80 3xl:square-100 rounded-full bg-dark-15">
        <img v-if="item?.avatarUrl"
             :src="`${BASE_URL}${item?.avatarUrl}`"
             :alt="item?.name"
        >

        <FoxIcon v-else/>
      </div>

      <p class="text-ellipsis">
        {{item?.name}}
      </p>
    </li>

    <li class="h-[1px]" ref="lastLiRef"/>
  </ul>

</template>