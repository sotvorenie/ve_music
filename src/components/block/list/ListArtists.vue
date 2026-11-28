<script setup lang="ts">
import {ref} from "vue";

import {Artist} from "@/types/artist.ts";

import {BASE_URL} from "@api/url.ts";

import {useObserve} from "@composables/useObserve.ts";
import {useArtistsLoader} from "@composables/useArtistsLoader.ts";

import Empty from "@ui/empty/Empty.vue";

import FoxIcon from "@icons/FoxIcon.vue";

import useArtistsStore from "@store/useArtistsStore.ts";
const artistStore = useArtistsStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useGenresStore from "@store/useGenresStore.ts";
const genresStore = useGenresStore();

const {load, loadMore} = useArtistsLoader()

const listRef = ref<HTMLUListElement | null>(null)
const lastLiRef = ref<HTMLLIElement | null>(null)

const handleArtist = async (artist: Artist) => {
  artistStore.currentArtist = {...artist}
  genresStore.clear()

  menuStore.listMode = 'music'
}

if (!artistStore.artists.length) await load()

useObserve(
    lastLiRef,
    loadMore,
    () => artistStore.meta.hasMore,
    () => artistStore.isLoading,
)
</script>

<template>

  <div class="relative h-full">
    <ul class="flex flex-col overflow-y-auto max-h-[80vh] pr-2.5 h-full"
        ref="listRef"
        v-auto-animate
    >
      <li v-for="item in artistStore.artists"
          :key="item.id"
          class="list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] group hover:bg-[color-mix(in_srgb,_var(--dark-15),_transparent_50%)]"
          @click="handleArtist(item)"
      >
        <div class="img-container square-17 3xl:square-22 rounded-full bg-dark-15">
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

    <Empty v-if="!artistStore.artists.length"/>
  </div>

</template>