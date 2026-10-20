<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";

import {formatTime} from "@composables/useFormatTime.ts";

import PlayButton from "@ui/PlayButton.vue";
import Tooltip from "@ui/Tooltip.vue";

import ImgIcon from "@/components/icons/ImgIcon.vue";
import VideoIcon from "@/components/icons/VideoIcon.vue";
import RandomIcon from "@/components/icons/RandomIcon.vue";
import RepeatIcon from "@/components/icons/RepeatIcon.vue";
import SoundOnIcon from "@/components/icons/SoundOnIcon.vue";
import SoundOffIcon from "@/components/icons/SoundOffIcon.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();


const progressStyle = computed(() => {
  if (!audioStore.currentTime) return ``

  const progress = (audioStore.currentTime / audioStore.activeTrack.duration) * 100
  return {
    background: `linear-gradient(to right, var(--color-accent) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
  }
})

const volumeStyle = computed(() => {
  const volume = audioStore.volume * 100
  return {
    background: `linear-gradient(to right, var(--color-accent) ${volume}%, rgba(255, 255, 255, 0.15) ${volume}%)`
  }
})

const disabledControlButton = computed(() => {
  return audioStore.activeTrack.id < 0 || controllersStore.isLoading
})

const cursorTime = ref(0)
const timelineInfoRef = ref<HTMLDivElement | null>(null)
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
  const target = event.target as HTMLInputElement

  audioStore.currentTime = +target.value
  audioStore.audio.currentTime = audioStore.currentTime
}

const setVolumeToLocStore = () => {
  localStorage.setItem('volume', JSON.stringify(audioStore.volume))
}
const getVolumeFromLocStore = () => {
  audioStore.volume = JSON.parse(localStorage.getItem('volume') || '1')
  audioStore.oldVolume = audioStore.volume
}
const handleVolume = () => {
  const volume = audioStore.volume
  audioStore.volume = volume > 0 ? 0 : audioStore.oldVolume || 1
}

const setIsRandomToLocStore = () => {
  localStorage.setItem('isRandom', JSON.stringify(controllersStore.isRandom))
}
const getIsRandomFromLocStore = () => {
  controllersStore.isRandom = JSON.parse(localStorage.getItem('isRandom') || 'false')
}
const handleIsRandom = async () => {
  controllersStore.isRandom = !controllersStore.isRandom
  setIsRandomToLocStore()
}

const setIsRepeatToLocStore = () => {
  localStorage.setItem('isRepeat', JSON.stringify(controllersStore.isRepeat))
}
const getIsRepeatFromLocStore = () => {
  controllersStore.isRepeat = JSON.parse(localStorage.getItem('isRepeat') || 'false')
}
const handleIsRepeat = () => {
  controllersStore.isRepeat = !controllersStore.isRepeat
  setIsRepeatToLocStore()
}

watch(
    () => audioStore.volume,
    (newVal) => {
      audioStore.audio.volume = newVal
      setVolumeToLocStore()
      if (newVal > 0) {
        audioStore.oldVolume = newVal
      }
    }
)

watch(
    () => audioStore.isPlaying,
    (newVal) => {
      newVal ? audioStore.audio.play() : audioStore.audio.pause()
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

  <div class="controllers">
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

    <div class="controllers__btn-bar flex-center">
      <div class="controllers__settings absolute flex items-center left-0 3xl:left-6">
        <div class="relative flex items-center group">
          <span class="tabular-nums opacity-0 transition-opacity group-hover:opacity-0">
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

          <input class="controllers__sound-range absolute opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                 v-model="audioStore.volume"
                 :style="volumeStyle"
                 :min="0"
                 :max="1"
                 :step="0.1"
                 type="range"
          >
        </div>

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

      <button class="prev flex-center bg-transparent rounded-full text-light border-2 border-current rotate-180 p-1"
              :disabled="disabledControlButton"
              @click="controllersStore.prevItem"
              type="button"
      >
        <ArrowIcon class="-mr-1"/>
      </button>

      <PlayButton :disabled="audioStore.activeTrack.id < 0"/>

      <button class="next flex-center bg-transparent rounded-full text-light border-2 border-current p-1"
              :disabled="disabledControlButton"
              @click="controllersStore.nextItem"
              type="button"
      >
        <ArrowIcon class="-mr-1"/>
      </button>

      <div v-if="audioStore.activeTrack.id >= 0"
           class="controllers__modes absolute flex items-center w-1/5"
      >
        <Tooltip>
          <template #activator>
            <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.mode === 'img' && 'bg-dark-15'
                    ]"
                    @click="controllersStore.mode = 'img'"
                    type="button"
            >
              <ImgIcon/>
            </button>
          </template>

          <template #default>
            Постер
          </template>
        </Tooltip>

        <Tooltip>
          <template #activator>
            <Transition name="scale">
              <button v-if="audioStore.activeTrack.videoClipUrl"
                      :class="[
                          'controllers__small-btn recolor-svg flex-center',
                          controllersStore.mode === 'video' && 'bg-dark-15'
                      ]"
                      @click="controllersStore.mode = 'video'"
                      type="button"
              >
                <VideoIcon/>
              </button>
            </Transition>
          </template>

          <template #default>
            Клип
          </template>
        </Tooltip>
      </div>
    </div>
  </div>

</template>