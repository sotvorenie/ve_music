<script setup lang="ts">
import {computed, watch} from "vue";

import PlayButton from "@components/musicCard/PlayButton.vue";

import Icon from "@ui/Icon.vue";

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
    <button class="square-12 3xl:square-12.5 flex-center bg-transparent rounded-full border-2 border-current rotate-180 p-1 hover:text-accent"
            :disabled="disabledControlButton"
            @click="controllersStore.prevItem"
            type="button"
    >
      <Icon class="-mr-1" :name="ArrowIcon" :size="30"/>
    </button>

    <PlayButton :disabled="audioStore.activeTrack.id < 0" class="square-15 3xl:square-20"/>

    <button class="square-12 3xl:square-12.5 flex-center bg-transparent rounded-full border-2 border-current p-1 hover:text-accent"
            :disabled="disabledControlButton"
            @click="controllersStore.nextItem"
            type="button"
    >
      <Icon class="-mr-1" :name="ArrowIcon" :size="30"/>
    </button>
  </div>

</template>