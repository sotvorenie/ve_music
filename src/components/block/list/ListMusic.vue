<script setup lang="ts">
import {ref, watchEffect} from "vue";

import {BASE_URL} from "@api/url.ts";

import {showArtists} from "@composables/useShowArtists.ts";
import {formatTime} from "@composables/useFormatTime.ts";
import {useObserve} from "@composables/useObserve.ts";

import Empty from "@ui/empty/Empty.vue";
import Icon from "@ui/Icon.vue";
import Tooltip from "@ui/Tooltip.vue";

import MusicRecordIcon from "@icons/MusicRecordIcon.vue";
import RadioIcon from "@icons/RadioIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const listRef = ref<HTMLUListElement | null>(null)

const lastLiRef = ref<HTMLLIElement | null>(null)
const activeLiRef = ref<HTMLLIElement | null>(null)

useObserve(
    lastLiRef,
    () => musicStore.getMusic(musicStore.page + 1),
    () => musicStore.hasMore
)

let observer: IntersectionObserver | null = null

const arrowVisible = ref<boolean>(false)

const scrollToActive = () => {
  activeLiRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const initObserver = () => {
  if (!activeLiRef.value) return

  observer?.disconnect()
  observer = null

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      arrowVisible.value = !entry.isIntersecting
    })
  }, {root: activeLiRef.value?.parentElement})

  observer.observe(activeLiRef.value)
}

watchEffect((onCleanup) => {
  if (audioStore.activeTrack.id < 0 || searchStore.searchName) return

  initObserver()

  onCleanup(() => {
    observer?.disconnect()
    arrowVisible.value = false
  })
})
</script>

<template>
  <div class="relative h-full">
    <ul class="list relative grid overflow-y-auto max-h-[80vh] pr-2.5 overflow-x-hidden"
        v-if="musicStore.music.length"
        ref="listRef"
        v-auto-animate
    >
      <li v-for="item in musicStore.music"
          :key="item.id"
          :class="[
              'list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] duration-300 w-100 group hover:bg-[color-mix(in_srgb,_var(--dark-15),_transparent_50%)]',
              item.id === audioStore.activeTrack.id && 'is-active pointer-events-none bg-[color-mix(in_srgb,_var(--dark-15),_transparent_25%)] '
          ]"
          @click="audioStore.updateMusic(item.id)"
          :ref="(el) => {
            if (audioStore.activeTrack.id === item.id) activeLiRef = el as HTMLLIElement
          }"
      >
        <div class="square-20 3xl:square-22 shrink-0 rounded-regular img-container z-[100]">
          <img v-if="item?.previewUrl"
               class="transition-transform duration-400 group-hover:will-change-transform group-hover:scale-110"
               :src="`${BASE_URL}${item?.previewUrl}`"
               :alt="item?.name"
          >
        </div>

        <Transition name="record">
          <Icon v-if="item.id === audioStore.activeTrack.id"
                :class="[
                    'list__item-record abs-y z-10 rounded-full ml-12.5 left-0 text-accent bg-[color-mix(in srgb, var(--dark-15), transparent 25%)]',
                    !audioStore.isPlaying && 'paused'
                ]"
                :name="MusicRecordIcon"
                :size="70"
                recolor
          />
        </Transition>

        <div :class="[
                  'overflow-hidden transition-[padding]',
                  item.id === audioStore.activeTrack.id && 'pl-6'
              ]"
        >
          <p class="font-medium truncate">{{item?.name}}</p>
          <p class="opacity-50 text-[0.9em] truncate">{{showArtists(item?.artists)}}</p>
          <p class="opacity-50 text-[0.9em]">{{formatTime(item.duration)}}</p>
        </div>
      </li>

      <li style="height: 1px;" ref="lastLiRef"/>
    </ul>

    <Empty v-if="!musicStore.music.length"/>

    <Transition name="fade-small">
      <Tooltip v-if="arrowVisible"
               class="!absolute left-[calc(100%_+_1rem)] top-4"
               position="right"
      >
        <template #activator>
          <button class="button !rounded-full flex-center !p-2 !bg-dark-15 recolor-svg hover:!text-accent"
                  @click="scrollToActive"
                  type="button"
          >
            <Icon :name="RadioIcon" :size="20"/>
          </button>
        </template>

        <template #default>
          К треку
        </template>
      </Tooltip>
    </Transition>
  </div>
</template>