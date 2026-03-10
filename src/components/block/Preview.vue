<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useModeStore from "../../store/useModeStore.ts";
const modeStore = useModeStore();

const visibleImage = computed(() => {
  return modeStore.mode === modeStore.modesList.img && audioStore.activeTrack.preview_url
})

const videoRef = ref<HTMLVideoElement | null>(null)

const visibleVideo = computed(() => {
  return modeStore.mode === modeStore.modesList.video && audioStore.activeTrack.video_clip_url
})

const onPlay = () => {
  if (!videoRef.value) return
  videoRef.value?.play()
}

const onPause = () => {
  if (!videoRef.value) return
  videoRef.value?.pause()
}

const onSeeked = () => {
  if (audioStore.audio && videoRef.value) {
    videoRef.value.currentTime = audioStore.audio.currentTime
    if (audioStore.isPlaying)videoRef.value.play()
  }
}

onMounted(() => {
  audioStore.audio?.addEventListener("play", onPlay)
  audioStore.audio?.addEventListener("pause", onPause)
  audioStore.audio?.addEventListener("seeked", onSeeked)
})

onUnmounted(() => {
  audioStore.audio?.removeEventListener("play", onPlay)
  audioStore.audio?.removeEventListener("pause", onPause)
  audioStore.audio?.removeEventListener("seeked", onSeeked)
})

watch(
    () => modeStore.mode,
    async () => {
      await nextTick()
      onSeeked()
    }
)
</script>

<template>

  <Transition name="fade">
    <div :key="`${audioStore.activeTrack.id}-${modeStore.mode}`"
         class="music__img-container img-container position-absolute"
         :class="{'is-active': audioStore.isPlaying && (modeStore.mode !== modeStore.modesList.video)}"
    >
      <img v-if="visibleImage"
           :src="`http://localhost:81/${audioStore.activeTrack.preview_url}`"
           :alt="audioStore.activeTrack?.name"
           draggable="false"
      >
      <video v-if="visibleVideo"
             :src="`http://localhost:81/${audioStore.activeTrack?.video_clip_url}`"
             muted
             ref="videoRef"
      >
        <track src="" kind="captions" srclang="en" label="No captions">
      </video>
    </div>
  </Transition>

</template>