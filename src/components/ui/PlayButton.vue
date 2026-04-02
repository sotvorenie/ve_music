<script setup lang="ts">
import {ref, watch} from "vue";
import {createTimeline} from "animejs";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();

const pathRef = ref<SVGPathElement | null>(null)
const pausePath = "M6,5 L9.5,5 L9.5,19 L6,19 Z M14.5,5 L18,5 L18,19 L14.5,19 Z"
const playPath = "M8.5,5 L14,8.5 L14,15.5 L8.5,19 Z M14,8.5 L19.5,12 L19.5,12 L14,15.5 Z"

const animateMorph = () => {
  if (!pathRef.value) return

  const tl = createTimeline({
    defaults: {
      easing: "easeInOutQuad"
    } as any
  })

  tl.add(pathRef.value, {
    d: audioStore.isPlaying ? pausePath : playPath,
    duration: 180,
  })
}

watch(
    () => audioStore.isPlaying,
    () => animateMorph()
)

</script>

<template>

  <button class="controllers__btn play-pause"
          type="button"
          @click="audioStore.isPlaying = !audioStore.isPlaying"
  >
    <svg width="100" height="100" viewBox="0 0 24 24">
      <defs>
        <filter id="gooey-tight">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"
          />
        </filter>
      </defs>

      <path
          ref="pathRef"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
          style="filter: url(#gooey-tight)"
          :d="playPath"
      />
    </svg>
  </button>

</template>