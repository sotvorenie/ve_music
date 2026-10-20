<script setup lang="ts">
import {computed, ref} from "vue";

import {formatTime} from "@composables/useFormatTime.ts";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const cursorTime = ref(0)
const timelineInfoRef = ref<HTMLDivElement | null>(null)

const progressStyle = computed(() => {
  if (!audioStore.currentTime) return ``

  const progress = (audioStore.currentTime / audioStore.duration) * 100
  return {
    background: `linear-gradient(to right, var(--color-accent) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
  }
})

const mouseMoveTimeline = (e: MouseEvent) => {
  if (!timelineInfoRef.value || audioStore.activeTrack.id < 0) return

  const input = e.currentTarget as HTMLInputElement
  const rect = input.getBoundingClientRect()

  const thumbWidth = 16
  const trackWidth = rect.width - thumbWidth
  let x = e.clientX - rect.left - (thumbWidth / 2)
  let percent = x / trackWidth
  percent = Math.min(Math.max(percent, 0), 1)
  cursorTime.value = audioStore.audio.duration * percent
  const visualPercent = (e.clientX - rect.left) / rect.width
  timelineInfoRef.value.style.left = `${visualPercent * 100}%`
}

const handleTimeline = (event: Event) => {
  audioStore.audio.currentTime = +(event.target as HTMLInputElement).value
}
</script>

<template>

  <div>
    <div :class="[
              'relative group',
              audioStore.activeTrack.id < 0 && 'pointer-events-none'
          ]"
         @mousemove="mouseMoveTimeline"
    >
      <span class="absolute tabular-nums bottom-[95%] bg-dark-15 rounded-regular p-2.5 transition-[opacity,translate] opacity-0 [translate:-50%_10px] pointer-events-none group-hover:opacity-100 group-hover:[translate:-50%_0]"
            ref="timelineInfoRef"
      >
        {{formatTime(cursorTime)}}
      </span>

      <input class="w-full m-0"
             v-model="audioStore.currentTime"
             :max="audioStore.activeTrack.duration"
             :style="progressStyle"
             @input="handleTimeline"
             type="range"
      >
    </div>

    <div class="flex justify-between mb-4">
      <span>{{formatTime(audioStore.currentTime || 0)}}</span>
      <span>{{formatTime(audioStore.activeTrack.duration)}}</span>
    </div>
  </div>

</template>