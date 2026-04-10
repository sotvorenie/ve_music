<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "../../store/useControllersStore.ts";
const controllersStore = useControllersStore();

const visibleImage = computed(() => {
  return controllersStore.mode === controllersStore.modesList.img && audioStore.activeTrack.preview_url
})

const videoRef = ref<HTMLVideoElement | null>(null)

const visibleVideo = computed(() => {
  return controllersStore.mode === controllersStore.modesList.video && audioStore.activeTrack.video_clip_url
})

const onPlay = () => {
  if (!videoRef.value || !audioStore.activeTrack.video_clip_url) return
  videoRef.value?.play()
}

const onPause = () => {
  if (!videoRef.value) return
  videoRef.value?.pause()
}

const onSeeked = () => {
  if (audioStore.audio && videoRef.value) {
    videoRef.value.currentTime = audioStore.audio.currentTime
    if (audioStore.isPlaying) videoRef.value.play()
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
</script>

<template>

  <div class="music__img-container img-container position-absolute"
       :class="{'is-active': audioStore.isPlaying && (controllersStore.mode !== controllersStore.modesList.video)}"
       :key="audioStore.activeTrack.id"
  >
    <img :src="`http://localhost:81/${audioStore.activeTrack.preview_url}`"
         :alt="audioStore.activeTrack?.name"
         draggable="false"
         :class="{'is-active': visibleImage}"
    >
    <video :src="`http://localhost:81/${audioStore.activeTrack?.video_clip_url}`"
           muted
           ref="videoRef"
           preload="auto"
           :class="{'is-active': visibleVideo}"
    >
      <track src="" kind="captions" srclang="en" label="No captions">
    </video>
  </div>

</template>