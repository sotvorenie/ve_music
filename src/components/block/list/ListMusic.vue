<script setup lang="ts">
import {ref, watch} from "vue";

import {TrackPreview} from "@/types/music.ts";

import {BASE_URL} from "@api/url.ts";

import {useObserve} from "@composables/useObserve.ts";
import {useTracksLoader} from "@composables/useTracksLoader.ts";
import {getTrackInfoFromPreview} from "@utils/getTrackInfoFromPreview.ts";
import {showArtists} from "@utils/showArtist.ts";
import {formatTime} from "@utils/formatTime.ts";

import ToTrack from "@components/list/ToTrack.vue";

import Empty from "@ui/empty/Empty.vue";
import Icon from "@ui/Icon.vue";
import MusicListSkeleton from "@ui/skeletons/MusicListSkeleton.vue";

import MusicRecordIcon from "@icons/MusicRecordIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useGenresStore from "@store/useGenresStore.ts";
const genresStore = useGenresStore();
import useArtistsStore from "@store/useArtistsStore.ts";
const artistStore = useArtistsStore();
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
const currentTrackStore = useCurrentTrackStore();
import useTracksStore from "@store/music/useTracksStore.ts";
const tracksStore = useTracksStore();

const {load, loadMore} = useTracksLoader()

const listRef = ref<HTMLUListElement | null>(null)

const lastLiRef = ref<HTMLLIElement | null>(null)
const activeLiRef = ref<HTMLLIElement | null>(null)

const handleTrack = (item: TrackPreview) => {
  currentTrackStore.updateTrack({id: item.id, trackData: getTrackInfoFromPreview(item)})
}

await load(true)

useObserve(
    lastLiRef,
    loadMore,
    () => tracksStore.meta.hasMore,
    () => tracksStore.isLoading,
)

watch(
    () => [menuStore.menuMode, genresStore.currentGenre.id],
    () => {
      listRef.value?.scroll(0, 0)
      load(true)
    }
)
</script>

<template>
  <div class="relative h-full">
    <MusicListSkeleton v-if="tracksStore.isLoading"/>

    <template v-else>
      <ul v-if="tracksStore.tracks.length"
          class="relative flex flex-col overflow-y-auto h-full pr-2.5 transition-[max-height] duration-500"
          ref="listRef"
          v-auto-animate
      >
        <li v-for="item in tracksStore.tracks"
            :key="item.id"
            :class="[
              'list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] duration-300 group hover:bg-[color-mix(in_srgb,_var(--dark-15),_transparent_50%)]',
              item.id === currentTrackStore.track.id && 'is-active pointer-events-none bg-[color-mix(in_srgb,_var(--dark-15),_transparent_25%)] '
          ]"
            @click="handleTrack(item)"
            :ref="(el) => {
            if (currentTrackStore.track.id === item.id) activeLiRef = el as HTMLLIElement
          }"
        >
          <div class="square-20 3xl:square-22 shrink-0 rounded-regular img-container z-[100]">
            <img v-if="item?.previewX480Url ?? item?.previewUrl"
                 class="transition-transform duration-400 group-hover:will-change-transform group-hover:scale-110"
                 :src="`${BASE_URL}${item?.previewUrl}`"
                 :alt="item?.name"
            >
          </div>

          <Transition name="record">
            <Icon v-if="item.id === currentTrackStore.track.id"
                  :class="[
                    'list__item-record abs-y z-10 rounded-full ml-11 3xl:ml-14.5 left-0 text-accent bg-[color-mix(in srgb, var(--dark-15), transparent 25%)]',
                    !audioStore.isPlaying && 'paused'
                ]"
                  :name="MusicRecordIcon"
                  :size="75"
                  recolor
            />
          </Transition>

          <div :class="[
                  'overflow-hidden transition-[padding]',
                  item.id === currentTrackStore.track.id && 'pl-6'
              ]"
          >
            <p class="font-medium truncate">{{item?.name}}</p>
            <p class="opacity-50 text-[0.9em] truncate">{{showArtists(item?.artists)}}</p>
            <p class="opacity-50 text-[0.9em]">{{formatTime(item.duration)}}</p>
          </div>
        </li>

        <li class="h-[1px]" ref="lastLiRef"/>
      </ul>

      <Empty v-else/>

      <ToTrack :active-li-ref="activeLiRef"/>
    </template>
  </div>
</template>