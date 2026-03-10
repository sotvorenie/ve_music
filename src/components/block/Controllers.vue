<script setup lang="ts">
import {computed} from "vue";

import formatTime from "../../composables/useFormatTime.ts";
import ArrowIcon from "../../assets/icons/ArrowIcon.vue";
import PlayButton from "../ui/PlayButton.vue";
import ImgIcon from "../../assets/icons/ImgIcon.vue";
import VideoIcon from "../../assets/icons/VideoIcon.vue";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useModeStore from "../../store/useModeStore.ts";
const modeStore = useModeStore();

const progressStyle = computed(() => {
  if (!audioStore.currentTime) return ``

  const progress = (audioStore.currentTime / audioStore.activeTrack.duration) * 100
  return {
    background: `linear-gradient(to right, var(--color-accent) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
  }
})


const handleTimeline = (event: Event) => {
  const target = event.target as HTMLInputElement

  audioStore.currentTime = +target.value
  audioStore.audio.currentTime = audioStore.currentTime
}

const disabledPrevButton = computed(() => {
  return menuStore.musicIndex === 0 || audioStore.activeTrack.id < 0
})
const disabledNextButton = computed(() => {
  return menuStore.musicIndex === menuStore.musicListLength - 1 || audioStore.activeTrack.id < 0
})

const prevItem = () => {
  if (menuStore.musicIndex === undefined) return
  menuStore.musicIndex--
}
const nextItem = () => {
  if (menuStore.musicIndex === undefined) return
  menuStore.musicIndex++
}

const handleModeBtn = (mode: string) => {
  modeStore.mode = mode
}
</script>

<template>

  <div class="controllers">
    <input class="controllers__timeline w-100"
           type="range"
           v-model="audioStore.currentTime"
           :max="audioStore.activeTrack.duration"
           :style="progressStyle"
           @input="handleTimeline"
    >

    <div class="controllers__time flex flex-between">
      <span>{{formatTime(audioStore.currentTime || 0)}}</span>
      <span>{{formatTime(audioStore.activeTrack.duration)}}</span>
    </div>

    <div class="controllers__btn-bar flex-center">
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
        <button class="controllers__mode-btn recolor-svg hover-color-accent flex-center"
                :class="{'is-active': modeStore.mode === modeStore.modesList.img}"
                type="button"
                @click="handleModeBtn(modeStore.modesList.img)"
        >
          <ImgIcon/>
        </button>
        <Transition name="scale">
          <button class="controllers__mode-btn recolor-svg hover-color-accent flex-center"
                  v-if="audioStore.activeTrack.video_clip_url"
                  :class="{'is-active': modeStore.mode === modeStore.modesList.video}"
                  type="button"
                  @click="handleModeBtn(modeStore.modesList.video)"
          >
            <VideoIcon/>
          </button>
        </Transition>
      </div>
    </div>
  </div>

</template>