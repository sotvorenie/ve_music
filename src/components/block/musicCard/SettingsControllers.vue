<script setup lang="ts">
import {computed, onMounted, watch} from "vue";

import RandomBtn from "@components/musicCard/RandomBtn.vue";

import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import SoundOffIcon from "@icons/SoundOffIcon.vue";
import SoundOnIcon from "@icons/SoundOnIcon.vue";
import RepeatIcon from "@icons/RepeatIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();

const volumePercent = computed(() => audioStore.volume * 100)

const handleVolume = () => {
  audioStore.volume = audioStore.volume > 0 ? 0 : audioStore.oldVolume || 1
}
const handleIsRepeat = () => {
  controllersStore.isRepeat = !controllersStore.isRepeat
  localStorage.setItem('isRepeat', JSON.stringify(controllersStore.isRepeat))
}

const getVolumeFromLocStore = () => {
  audioStore.volume = JSON.parse(localStorage.getItem('volume') || '1')
  audioStore.oldVolume = audioStore.volume
}
const getIsRandomFromLocStore = () => {
  controllersStore.isRandom = JSON.parse(localStorage.getItem('isRandom') || 'false')
}
const getIsRepeatFromLocStore = () => {
  controllersStore.isRepeat = JSON.parse(localStorage.getItem('isRepeat') || 'false')
}

watch(
    () => audioStore.volume,
    (newVal) => {
      audioStore.audio.volume = newVal
      localStorage.setItem('volume', JSON.stringify(audioStore.volume))
      if (newVal > 0) audioStore.oldVolume = newVal
    }
)

onMounted(() => {
  getVolumeFromLocStore()
  getIsRandomFromLocStore()
  getIsRepeatFromLocStore()
})
</script>

<template>

  <div class="flex items-center justify-between gap-2.5">
    <div class="relative flex items-center group">
          <span class="tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
            {{Number(audioStore.volume)?.toFixed(1)}}
          </span>

      <Tooltip>
        <template #activator>
          <button class="controllers__small-btn recolor-svg flex-center"
                  @click="handleVolume"
                  type="button"
          >
            <Icon v-if="audioStore.volume > 0"
                  :name="SoundOnIcon"
                  :size="30"
            />
            <Icon v-else :name="SoundOffIcon" :size="30"/>
          </button>
        </template>

        <template #default>
          Вкл/выкл звук
        </template>
      </Tooltip>

      <input class="controllers__sound-range range-slider !h-1 opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto w-18 3xl:w-25"
             v-model="audioStore.volume"
             :style="{'--percent': `${volumePercent}%`}"
             :min="0"
             :max="1"
             :step="0.1"
             type="range"
      >
    </div>

    <div class="flex gap-2.5">
      <RandomBtn/>

      <Tooltip>
        <template #activator>
          <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.isRepeat && 'bg-dark-15'
                    ]"
                  @click="handleIsRepeat"
                  type="button"
          >
            <Icon :name="RepeatIcon" :size="27"/>
          </button>
        </template>

        <template #default>
          Повтор композиции
        </template>
      </Tooltip>
    </div>
  </div>

</template>