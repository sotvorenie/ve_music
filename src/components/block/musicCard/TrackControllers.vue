<script setup lang="ts">
import {computed, watch} from "vue";

import PlayButton from "@ui/PlayButton.vue";

import ArrowIcon from "@icons/ArrowIcon.vue";

import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const disabledControlButton = computed(() => {
  return audioStore.activeTrack.id < 0 || controllersStore.isLoading
})

watch(
    () => audioStore.isPlaying,
    (newVal) => newVal ? audioStore.audio.play() : audioStore.audio.pause()
)
</script>

<template>

  <div class="flex-center gap-4">
    <button class="prev square-12.5 flex-center bg-transparent rounded-full text-light border-2 border-current rotate-180 p-1"
            :disabled="disabledControlButton"
            @click="controllersStore.prevItem"
            type="button"
    >
      <ArrowIcon class="-mr-1"/>
    </button>

    <PlayButton :disabled="audioStore.activeTrack.id < 0" class="square-20"/>

    <button class="next square-12.5 flex-center bg-transparent rounded-full text-light border-2 border-current p-1"
            :disabled="disabledControlButton"
            @click="controllersStore.nextItem"
            type="button"
    >
      <ArrowIcon class="-mr-1"/>
    </button>
  </div>

</template>