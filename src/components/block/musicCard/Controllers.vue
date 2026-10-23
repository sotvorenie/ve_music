<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";

import SettingsControllers from "@components/musicCard/SettingsControllers.vue";
import TrackControllers from "@components/musicCard/TrackControllers.vue";
import ModesControllers from "@components/musicCard/ModesControllers.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const allKeyCodes = {
  space: 'Space',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
}

const handleKey = (e: KeyboardEvent) => {
  const audio = audioStore.audio

  const activeEl = document.activeElement
  if (activeEl instanceof HTMLInputElement && activeEl.type === 'text') return

  switch (e.code) {
    case allKeyCodes.space:
      e.preventDefault()
      audioStore.isPlaying = !audioStore.isPlaying
      break
    case allKeyCodes.arrowLeft:
      if (Number.isNaN(audio.duration)) break
      e.preventDefault()
      audio.currentTime = Math.max(0, audio.currentTime - 5)
      break
    case allKeyCodes.arrowRight:
      if (Number.isNaN(audio.duration)) break
      e.preventDefault()
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
      break
  }
}

onMounted(async () => globalThis.addEventListener("keydown", handleKey, true))
onUnmounted(() => globalThis.removeEventListener("keydown", handleKey, true))
</script>

<template>

  <div class="controllers grid grid-cols-[1fr_auto_1fr] gap-8 3xl:gap-12.5 items-center">
    <SettingsControllers/>

    <TrackControllers/>

    <ModesControllers v-if="audioStore.activeTrack.id >= 0"/>
  </div>

</template>