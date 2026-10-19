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

import useItemsStore from "@store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();

const listRef = ref<HTMLUListElement | null>(null)

const lastLiRef = ref<HTMLLIElement | null>(null)
const activeLiRef = ref<HTMLLIElement | null>(null)

useObserve(
    lastLiRef,
    () => itemsStore.getMusicList(),
    itemsStore.musicList?.hasMore
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
  <div class="music-list position-relative h-100">
    <ul class="list position-relative"
        v-if="itemsStore.musicList?.music?.length"
        ref="listRef"
        v-auto-animate
    >
      <li v-for="item in itemsStore.musicList?.music"
          :key="item.id"
          class="list__item flex cursor-pointer flex-align-center position-relative"
          :class="{'is-active': item.id === audioStore.activeTrack.id}"
          @click="audioStore.updateMusic(item.id)"
      >
        <div class="list__left img-container z-100">
          <img v-if="item?.previewUrl" :src="`${BASE_URL}${item?.previewUrl}`" :alt="item?.name">
        </div>

        <Transition name="record">
          <Icon v-if="item.id === audioStore.activeTrack.id"
                :name="MusicRecordIcon"
                :size="70"
                recolor
                class="list__item-record position-absolute z-10"
                :class="!audioStore.isPlaying && 'paused'"
          />
        </Transition>

        <div class="list__right overflow-hidden"
             :class="item.id === audioStore.activeTrack.id && 'is-active'"
        >
          <p class="list__name text-w500 text-ellipsis">{{item?.name}}</p>
          <p class="list__artist text-ellipsis">{{showArtists(item?.artists)}}</p>
          <p class="list__duration">{{formatTime(item.duration)}}</p>
        </div>
      </li>

      <li style="height: 1px;" ref="lastLiRef"/>
    </ul>

    <Transition name="list">
      <Empty v-if="!itemsStore.musicList?.music?.length"/>
    </Transition>

    <Transition name="fade-small">
      <button v-if="arrowVisible"
              class="music-list__btn button flex-center position-absolute"
              :class="arrowPosition === 'top' ? 'is-top' : 'is-bottom'"
              @click="scrollToActive"
              type="button"
      >
        <ArrowIcon/>
      </button>
    </Transition>
  </div>
</template>