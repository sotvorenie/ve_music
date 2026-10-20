<script setup lang="ts">
import {ref} from "vue";

import {Artist} from "@/types/artist.ts";

import {BASE_URL} from "@api/url.ts";

import {useObserve} from "@composables/useObserve.ts";

import FoxIcon from "@icons/FoxIcon.vue";

import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

await artistStore.getArtists()

const handleArtist = async (artist: Artist) => {
  artistStore.currentArtist = artist

  await musicStore.getMusic()

  menuStore.listMode = 'artistMusic'
}

const listRef = ref<HTMLUListElement | null>(null)
const lastLiRef = ref<HTMLLIElement | null>(null)

useObserve(
    lastLiRef,
    () => artistStore.getArtists(),
    artistStore.hasMore
)
</script>

<template>

  <ul class="grid overflow-y-auto max-h-[80vh] pr-2.5 overflow-x-hidden h-full"
      ref="listRef"
      v-auto-animate
  >
    <li v-for="item in artistStore.artists"
        :key="item.id"
        class="list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] w-100 group hover:bg-[color-mix(in_srgb,_var(--dark-15),_transparent_50%)]"
        @click="handleArtist(item)"
    >
      <div class="img-container square-20 3xl:square-22 rounded-full bg-dark-15">
        <img v-if="item?.avatarUrl"
             :src="`${BASE_URL}${item?.avatarUrl}`"
             :alt="item?.name"
        >

        <FoxIcon v-else/>
      </div>

      <p class="truncate">
        {{item?.name}}
      </p>
    </li>

    <li class="h-[1px]" ref="lastLiRef"/>
  </ul>

</template>