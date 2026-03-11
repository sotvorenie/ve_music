<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";

import formatTime from "../../composables/useFormatTime.ts";
import ArrowIcon from "../../assets/icons/ArrowIcon.vue";
import PlayButton from "../ui/PlayButton.vue";
import ImgIcon from "../../assets/icons/ImgIcon.vue";
import VideoIcon from "../../assets/icons/VideoIcon.vue";
import RandomIcon from "../../assets/icons/RandomIcon.vue";
import RepeatIcon from "../../assets/icons/RepeatIcon.vue";
import SoundOnIcon from "../../assets/icons/SoundOnIcon.vue";
import SoundOffIcon from "../../assets/icons/SoundOffIcon.vue";
import Tooltip from "../ui/Tooltip.vue";


import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useControllersStore from "../../store/useControllersStore.ts";
const controllersStore = useControllersStore();


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

const disabledPrevButton = computed(() => {
  return menuStore.musicIndex === 0 || audioStore.activeTrack.id < 0
})
const disabledNextButton = computed(() => {
  return menuStore.musicIndex === menuStore.musicListLength - 1 || audioStore.activeTrack.id < 0
})

const cursorTime = ref(0)
const timelineInfoRef = ref<HTMLDivElement | null>(null)
const mouseMoveTimeline = (e: MouseEvent) => {
  if (!timelineInfoRef.value) return

  const timelineWrapper = e.currentTarget as HTMLDivElement
  const timelineWrapperRect = timelineWrapper.getBoundingClientRect()
  const percent = (e.clientX - timelineWrapperRect.left) / timelineWrapperRect.width
  cursorTime.value = audioStore.audio.duration * percent

  timelineInfoRef.value.style.left = `${Math.round(percent * 100)}%`
}

const prevItem = () => {
  if (menuStore.musicIndex === undefined) return
  if (audioStore.currentTime > 20) {
    audioStore.audio.currentTime = 0
  } else {
    menuStore.musicIndex = Math.max(0, menuStore.musicIndex - 1)
  }
}
const nextItem = () => {
  if (menuStore.musicIndex === undefined) return
  menuStore.musicIndex = Math.min(menuStore.musicListLength - 1, menuStore.musicIndex + 1)
}

const handleModeBtn = (mode: string) => {
  controllersStore.mode = mode
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
const handleIsRandom = () => {
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

onMounted(() => {
  getVolumeFromLocStore()
  getIsRandomFromLocStore()
  getIsRepeatFromLocStore()
})
</script>

<template>

  <div class="controllers">
    <div class="controllers__timeline-wrapper position-relative"
         @mousemove="mouseMoveTimeline"
    >
      <span class="controllers__timeline-info position-absolute text-numeric" ref="timelineInfoRef">
      {{formatTime(cursorTime)}}
    </span>
      <input class="controllers__timeline w-100"
             type="range"
             v-model="audioStore.currentTime"
             :max="audioStore.activeTrack.duration"
             :style="progressStyle"
             @input="handleTimeline"
      >
    </div>

    <div class="controllers__time flex flex-between">
      <span>{{formatTime(audioStore.currentTime || 0)}}</span>
      <span>{{formatTime(audioStore.activeTrack.duration)}}</span>
    </div>

    <div class="controllers__btn-bar flex-center">
      <div class="controllers__settings position-absolute flex flex-align-center">
        <div class="controllers__sound position-relative flex flex-align-center">
          <span class="controllers__sound-number text-numeric">
            {{Number(audioStore.volume)?.toFixed(1)}}
          </span>
          <Tooltip>
            <template #activator>
              <button class="controllers__settings-btn controllers__small-btn recolor-svg hover-color-accent flex-center"
                      type="button"
                      @click="handleVolume"
              >
                <SoundOnIcon v-if="audioStore.volume > 0"/>
                <SoundOffIcon v-else/>
              </button>
            </template>
            <template #default>
              Вкл/выкл звук
            </template>
          </Tooltip>
          <input type="range"
                 class="controllers__sound-range position-absolute"
                 :style="volumeStyle"
                 :min="0"
                 :max="1"
                 :step="0.1"
                 v-model="audioStore.volume"
          >
        </div>

        <Tooltip>
          <template #activator>
            <button class="controllers__settings-btn controllers__small-btn recolor-svg hover-color-accent flex-center"
                    :class="{'is-active': controllersStore.isRandom}"
                    type="button"
                    @click="handleIsRandom"
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
            <button class="controllers__settings-btn controllers__small-btn recolor-svg hover-color-accent flex-center"
                    :class="{'is-active': controllersStore.isRepeat}"
                    type="button"
                    @click="handleIsRepeat"
            >
              <RepeatIcon/>
            </button>
          </template>
          <template #default>
            Повтор композиции
          </template>
        </Tooltip>
      </div>

      <button class="controllers__btn prev"
              type="button"
              :disabled="disabledPrevButton"
              @click="prevItem"
      >
        <ArrowIcon/>
      </button>

      <PlayButton v-model="audioStore.isPlaying" :disabled="audioStore.activeTrack.id < 0"/>

      <button class="controllers__btn next"
              type="button"
              :disabled="disabledNextButton"
              @click="nextItem"
      >
        <ArrowIcon/>
      </button>

      <div class="controllers__modes position-absolute flex flex-align-center" v-if="audioStore.activeTrack.id >= 0">
        <Tooltip>
          <template #activator>
            <button class="controllers__mode-btn controllers__small-btn recolor-svg hover-color-accent flex-center"
                    :class="{'is-active': controllersStore.mode === controllersStore.modesList.img}"
                    type="button"
                    @click="handleModeBtn(controllersStore.modesList.img)"
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
              <button class="controllers__mode-btn controllers__small-btn recolor-svg hover-color-accent flex-center"
                      v-if="audioStore.activeTrack.video_clip_url"
                      :class="{'is-active': controllersStore.mode === controllersStore.modesList.video}"
                      type="button"
                      @click="handleModeBtn(controllersStore.modesList.video)"
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