<script setup lang="ts">
import {computed} from "vue";

import {usePlayerControllers} from "@composables/usePlayerControllers.ts";

import PlayButton from "@components/musicCard/PlayButton.vue";

import Icon from "@ui/Icon.vue";

import ArrowIcon from "@icons/ArrowIcon.vue";

import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
const currentTrackStore = useCurrentTrackStore();

const {prev, next} = usePlayerControllers()

const disabledControlButton = computed(() => {
  return currentTrackStore.track.id < 0 || currentTrackStore.isLoading
})
</script>

<template>

  <div class="flex-center gap-4">
    <button class="square-12 3xl:square-12.5 flex-center bg-transparent rounded-full border-2 border-current rotate-180 p-1 hover:text-accent"
            :disabled="disabledControlButton"
            @click="prev"
            type="button"
    >
      <Icon class="-mr-1" :name="ArrowIcon" :size="30"/>
    </button>

    <PlayButton :disabled="currentTrackStore.track.id < 0" class="square-15 3xl:square-19"/>

    <button class="square-12 3xl:square-12.5 flex-center bg-transparent rounded-full border-2 border-current p-1 hover:text-accent"
            :disabled="disabledControlButton"
            @click="next"
            type="button"
    >
      <Icon class="-mr-1" :name="ArrowIcon" :size="30"/>
    </button>
  </div>

</template>