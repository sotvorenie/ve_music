<script setup lang="ts">
import {computed, ref} from "vue";

import {formatTime} from "@composables/useFormatTime.ts";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const inputRef = ref<HTMLInputElement | null>(null)

const cursorPosition = ref<number>(0)
const cursorTimePercent = ref<number>(0)

const getPercent = (progress: number): number => {
  if (!inputRef.value) return 0

  const inputRect = inputRef.value.getBoundingClientRect()

  const thumbWidth = parseFloat(getComputedStyle(inputRef.value).getPropertyValue('--thumb-size')) * 16
  const width = inputRect.width
  return (progress * (width - thumbWidth)/width + (thumbWidth / 2)/width) * 100
}

const progressPercent = computed(() => getPercent(audioStore.currentTime / audioStore.duration))

const mouseMoveTimeline = (e: MouseEvent) => {
  if (!inputRef.value || audioStore.activeTrack.id < 0) return

  const inputRect = inputRef.value.getBoundingClientRect()

  const percent = (e.clientX - inputRect.left) / inputRect.width

  cursorTimePercent.value = percent
  cursorPosition.value = getPercent(percent)
}

const handleTimeline = (event: Event) => {
  audioStore.audio.currentTime = +(event.target as HTMLInputElement).value
}
</script>

<template>

  <div class="timeline">
    <div :class="[
              'relative group',
              audioStore.activeTrack.id < 0 && 'pointer-events-none'
          ]"
         @mousemove="mouseMoveTimeline"
    >
      <span class="absolute tabular-nums bottom-[95%] bg-dark-15 rounded-regular p-2.5 transition-[opacity,translate] opacity-0 [translate:-50%_10px] pointer-events-none group-hover:opacity-100 group-hover:[translate:-50%_0]"
            :style="{left: `${cursorPosition}%`}"
      >
        {{formatTime(cursorTimePercent * audioStore.duration)}}
      </span>

      <input class="range-slider w-full m-0"
             v-model="audioStore.currentTime"
             :max="audioStore.activeTrack.duration"
             :style="{'--percent': `${progressPercent || 0}%`}"
             @input="handleTimeline"
             type="range"
             ref="inputRef"
      >
    </div>

    <div class="flex justify-between mb-4">
      <span>{{formatTime(audioStore.currentTime || 0)}}</span>
      <span>{{formatTime(audioStore.activeTrack.duration)}}</span>
    </div>
  </div>

</template>