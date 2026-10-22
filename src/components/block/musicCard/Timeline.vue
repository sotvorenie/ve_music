<script setup lang="ts">
import {computed, ref, watch} from "vue";

import {formatTime} from "@composables/useFormatTime.ts";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const inputRef = ref<HTMLInputElement | null>(null)

const cursorPosition = ref<number>(0)
const cursorTimePercent = ref<number>(0)

const getThumbWidth = (): number => {
  if (!inputRef.value) return 0
  return parseFloat(getComputedStyle(inputRef.value).getPropertyValue('--thumb-size')) * 16
}

const progressPercent = computed(() => {
  if (!inputRef.value) return 0

  const rect = inputRef.value.getBoundingClientRect()
  const width = rect.width
  const thumbWidth = getThumbWidth()
  const progress = audioStore.currentTime / audioStore.duration

  return (progress * (width - thumbWidth)/width + (thumbWidth / 2)/width) * 100
})

const setCursorTime = (percent: number) => {
  if (!inputRef.value) return

  const rect = inputRef.value.getBoundingClientRect()
  const width = rect.width
  const thumbWidth = getThumbWidth()

  cursorTimePercent.value = (percent - (thumbWidth / 2) / width) / ((width - thumbWidth) / width)
}

const mouseMoveTimeline = (e: MouseEvent) => {
  if (!inputRef.value || audioStore.activeTrack.id < 0) return

  const inputRect = inputRef.value.getBoundingClientRect()

  const percent = (e.clientX - inputRect.left) / inputRect.width

  cursorPosition.value = percent * 100

  setCursorTime(percent)
}

watch(
    () => audioStore.isMoving,
    (val) => {
      if (!val) audioStore.audio.currentTime = audioStore.currentTime
    }
)
</script>

<template>

  <div class="timeline flex flex-col gap-2.5">
    <div :class="[
              'relative group leading-[0]',
              audioStore.activeTrack.id < 0 && 'pointer-events-none'
          ]"
         @pointerdown="audioStore.isMoving = true"
         @pointerup="audioStore.isMoving = false"
         @mousemove="mouseMoveTimeline"
    >
      <Transition name="fade-small">
        <div v-if="cursorPosition >= 0"
              class="absolute tabular-nums -top-11 bg-dark-15 rounded-regular p-2.5 transition-[opacity,translate] opacity-0 [translate:-50%_10px] pointer-events-none group-hover:opacity-100 group-hover:[translate:-50%_0] leading-none"
              :style="{left: `${cursorPosition}%`}"
        >
          {{formatTime(cursorTimePercent * audioStore.duration)}}
        </div>
      </Transition>

      <input class="range-slider w-full m-0"
             v-model="audioStore.currentTime"
             :max="audioStore.activeTrack.duration"
             :style="{'--percent': `${progressPercent || 0}%`}"
             type="range"
             ref="inputRef"
      >
    </div>

    <div class="flex justify-between mb-4">
      <span>{{formatTime(audioStore.audio.currentTime || 0)}}</span>
      <span>{{formatTime(audioStore.activeTrack.duration)}}</span>
    </div>
  </div>

</template>