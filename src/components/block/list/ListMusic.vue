<script setup lang="ts">
import {ref, watchEffect} from "vue";

import {BASE_URL} from "@api/url.ts";

import {showArtists} from "@composables/useShowArtists.ts";
import {formatTime} from "@composables/useFormatTime.ts";
import {useObserve} from "@composables/useObserve.ts";

import Empty from "@ui/empty/Empty.vue";
import Icon from "@ui/Icon.vue";

import ArrowIcon from "@icons/ArrowIcon.vue";
import MusicRecordIcon from "@icons/MusicRecordIcon.vue";

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
    () => musicStore.getMusic(),
    musicStore.hasMore
)

const arrowVisible = ref<boolean>(false)
const arrowPosition = ref<'top' | 'bottom'>('top')

const scrollToActive = () => {
  activeLiRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const updateArrow = () => {
  const list = listRef.value
  const li = activeLiRef.value
  if (!list || !li) return

  const itemTop = li.offsetTop
  const itemBottom = itemTop + li.offsetHeight
  const viewTop = list.scrollTop
  const viewBottom = viewTop + list.clientHeight

  if (itemBottom < viewTop) {
    arrowVisible.value = true
    arrowPosition.value = 'top'
  } else if (itemTop > viewBottom) {
    arrowVisible.value = true
    arrowPosition.value = 'bottom'
  } else {
    arrowVisible.value = false
  }
}

watchEffect((onCleanup) => {
  const list = listRef.value
  if (!list || audioStore.activeTrack.id < 0) return
  if (searchStore.searchName) {
    arrowVisible.value = false
    return
  }

  updateArrow()
  list.addEventListener('scroll', updateArrow, { passive: true })
  onCleanup(() => list.removeEventListener('scroll', updateArrow))
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
              'list__item flex cursor-pointer items-center relative gap-4 rounded-regular transition-[background-color] w-100 group hover:bg-[color-mix(in srgb, var(--color-dark-15), transparent 50%)]',
              item.id === audioStore.activeTrack.id && 'is-active pointer-events-none bg-[color-mix(in srgb, var(--color-dark-15), transparent 25%)] '
          ]"
          @click="audioStore.updateMusic(item.id)"
      >
        <div class="square-20 3xl:square-25 shrink-0 rounded-regular img-container z-[100]">
          <img v-if="item?.previewUrl"
               class="transition-transform group-hover:will-change-transform group-hover:scale-110"
               :src="`${BASE_URL}${item?.previewUrl}`"
               :alt="item?.name"
          >
        </div>

        <Transition name="record">
          <Icon v-if="item.id === audioStore.activeTrack.id"
                :class="[
                    'list__item-record abs-y z-10 rounded-full ml-12.5 left-0 text-accent bg-[color-mix(in srgb, var(--color-dark-15), transparent 25%)]',
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
          <p class="font-medium text-ellipsis">{{item?.name}}</p>
          <p class="opacity-50 text-[0.9em] text-ellipsis">{{showArtists(item?.artists)}}</p>
          <p class="opacity-50 text-[0.9em]">{{formatTime(item.duration)}}</p>
        </div>
      </li>

      <li style="height: 1px;" ref="lastLiRef"/>
    </ul>

    <Transition name="list">
      <Empty v-if="!musicStore.music.length"/>
    </Transition>

    <Transition name="fade-small">
      <button v-if="arrowVisible"
              :class="[
                  'button square-9.5 rounded-full flex-center absolute left-[calc(100% + 0.625rem)] top-2.5',
                  arrowPosition === 'top' ? '-rotate-90' : 'rotate-90'
              ]"
              @click="scrollToActive"
              type="button"
      >
        <Icon :name="ArrowIcon" :size="20"/>
      </button>
    </Transition>
  </div>
</template>