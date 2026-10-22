<script setup lang="ts">
import {computed, onMounted, watch} from "vue";

import Tooltip from "@ui/Tooltip.vue";

import SoundOffIcon from "@icons/SoundOffIcon.vue";
import RandomIcon from "@icons/RandomIcon.vue";
import SoundOnIcon from "@icons/SoundOnIcon.vue";
import RepeatIcon from "@icons/RepeatIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const volumePercent = computed(() => audioStore.volume * 100)

const handleVolume = () => {
  audioStore.volume = audioStore.volume > 0 ? 0 : audioStore.oldVolume || 1
}
const handleIsRandom = async () => {
  controllersStore.isRandom = !controllersStore.isRandom
  localStorage.setItem('isRandom', JSON.stringify(controllersStore.isRandom))
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

watch(
    () => controllersStore.isRandom,
    () => {
      musicStore.randomIds = []
      musicStore.offset = -1
      musicStore.randomSeed = (Math.random() * 2) - 1
    }
)

onMounted(() => {
  getVolumeFromLocStore()
  getIsRandomFromLocStore()
  getIsRepeatFromLocStore()
})
</script>

<template>

  <div class="controllers__settings flex items-center justify-between">
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
            <SoundOnIcon v-if="audioStore.volume > 0"/>
            <SoundOffIcon v-else/>
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

    <div class="flex controllers__settings-list">
      <Tooltip>
        <template #activator>
          <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.isRandom && 'bg-dark-15'
                    ]"
                  @click="handleIsRandom"
                  type="button"
          >
            <RandomIcon/>
          </button>
        </template>

        <template #default>
          Воспроизведение в случайном порядке
        </template>
      </Tooltip>

      <Tooltip>
        <template #activator>
          <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.isRepeat && 'bg-dark-15'
                    ]"
                  @click="handleIsRepeat"
                  type="button"
          >
            <RepeatIcon/>
          </button>
        </template>

        <template #default>
          Повтор композиции
        </template>
      </Tooltip>
    </div>
  </div>

</template>