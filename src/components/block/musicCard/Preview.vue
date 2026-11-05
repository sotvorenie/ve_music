<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";

import {BASE_URL} from "@api/url.ts";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const visibleImage = computed(() => {
  return controllersStore.mode === 'img' && !!musicStore.activeTrack.previewUrl
})

const videoRef = ref<HTMLVideoElement | null>(null)

const visibleVideo = computed(() => {
  return controllersStore.mode === 'video' && !!musicStore.activeTrack.videoClipUrl
})

const onPlay = () => {
  videoRef.value?.play().catch(() => {})
}

const onPause = () => {
  videoRef.value?.pause()
}

const syncVideoTime = () => {
  const audio = audioStore.audio
  const video = videoRef.value
  if (!audio || !video) return

  video.currentTime = audio.currentTime
  if (audioStore.isPlaying) video.play().catch(() => {})
}

const onCanPlay = () => {
  if (audioStore.isPlaying) videoRef.value?.play().catch(() => {})
}

watchEffect((onCleanup) => {
  const audio = audioStore.audio
  if (!audio) return

  audio.addEventListener("play", onPlay)
  audio.addEventListener("pause", onPause)
  audio.addEventListener("seeked", syncVideoTime)

  onCleanup(() => {
    audio.removeEventListener("play", onPlay)
    audio.removeEventListener("pause", onPause)
    audio.removeEventListener("seeked", syncVideoTime)
  })
})
</script>

<template>

  <TransitionGroup name="fade-absolute"
                   tag="div"
                   :class="[
                        'img-container absolute right-0 h-screen aspect-square transition-[scale,width] duration-1200',
                        audioStore.isPlaying && (controllersStore.mode === 'img') && 'will-change-transform scale-105',
                        controllersStore.mode === 'video' ? 'w-[75vw]' : 'w-[100vh]',
                    ]"
  >
    <img v-if="visibleImage"
         :key="`image-${musicStore.activeTrack.id}`"
         :src="`${BASE_URL}${musicStore.activeTrack.previewUrl}`"
         :alt="musicStore.activeTrack?.name"
         draggable="false"
    >
    <video v-if="visibleVideo"
           :key="`video-${musicStore.activeTrack.id}`"
           :src="`${BASE_URL}${musicStore.activeTrack?.videoClipUrl}`"
           muted
           ref="videoRef"
           preload="auto"
           @loadeddata="syncVideoTime"
           @canplay="onCanPlay"
    />
  </TransitionGroup>

</template>