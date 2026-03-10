<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {showArtists} from "../../composables/useShowArtists.ts";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();

const nameTrackRef = ref<HTMLDivElement | null>(null)

const isNameOverflow = ref(false)
const isNameShadow = ref(false)

const timer = ref<number | null>(null)

const checkWidth = async () => {
  isNameOverflow.value = false
  isNameShadow.value = false

  await nextTick()

  if (nameTrackRef.value) {
    const containerWidth = nameTrackRef.value.parentElement?.clientWidth
    const contentWidth = nameTrackRef.value.scrollWidth

    if (timer.value) clearTimeout(timer.value)

    if (!containerWidth || !contentWidth) return

    const check = contentWidth > containerWidth

    if (!check) return

    isNameShadow.value = check
    nameTrackRef.value.style.animationDuration = `${contentWidth / containerWidth * 20}s`
    timer.value = setTimeout(() => {
      isNameOverflow.value = check
    }, 1000)
  }
}

watch(
    () => audioStore.activeTrack,
    () => checkWidth(),
    {immediate: true, deep: true}
)
</script>

<template>

  <Transition name="list">
    <div class="info" :key="audioStore.activeTrack?.name">
      <div class="info__title text-w700 w-100 overflow-hidden position-relative text-nowrap"
           :class="{'shadow': isNameShadow}"
      >
        <div class="info__track" :class="{ 'animate': isNameOverflow }" ref="nameTrackRef">
          <span>{{ audioStore.activeTrack?.name }}</span>
          <span v-if="isNameOverflow" class="info__spacer">{{ audioStore.activeTrack?.name }}</span>
        </div>
      </div>

      <div class="info__author w-100 overflow-hidden position-relative text-nowrap">
        {{ showArtists(audioStore.activeTrack?.artists) }}
      </div>
    </div>
  </Transition>

</template>