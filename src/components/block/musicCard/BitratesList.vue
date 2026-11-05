<script setup lang="ts">
import {computed} from "vue";

import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const isVisible = defineModel('visible', {type: Boolean, required: true})

const handleBitrate = (bitrate: number) => {
  audioStore.setBitrate(bitrate)
  isVisible.value = false
}

const bitrates = computed(() => {
  return [
    {label: 'Авто', value: -1},
    ...[...musicStore.activeTrack.bitrates].sort((a, b) => b - a)?.map(bitrate => ({
      label: `${bitrate} Кб/с`,
      value: bitrate,
    }))
  ]
})
</script>

<template>

  <ul class="">
    <li v-for="bitrate in bitrates"
        :key="bitrate.value"
        class=""
    >
      <button class="py-2 pl-5 pr-3 hover:text-accent relative"
              type="button"
              @click="handleBitrate(bitrate.value)"
      >
        {{bitrate.label}}

        <span v-if="(bitrate.value * 1000 === audioStore.currentBitrate && !audioStore.isAutoBitrate) || (bitrate.value === - 1 && audioStore.isAutoBitrate)"
              class="abs-y left-0 text-base"
        >✔</span>
      </button>
    </li>
  </ul>

</template>