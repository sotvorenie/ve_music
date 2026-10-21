<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";

import {BASE_URL} from "@api/url.ts";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();

const visibleImage = computed(() => {
  return controllersStore.mode === 'img' && audioStore.activeTrack.previewUrl
})

const videoRef = ref<HTMLVideoElement | null>(null)

const visibleVideo = computed(() => {
  return controllersStore.mode === 'video' && audioStore.activeTrack.videoClipUrl
})

const onPlay = () => {
  if (!videoRef.value || !audioStore.activeTrack.videoClipUrl) return
  videoRef.value?.play()
}

const onPause = () => {
  if (!videoRef.value) return
  videoRef.value?.pause()
}

const onSeeked = () => {
  if (audioStore.audio && videoRef.value) {
    videoRef.value.currentTime = audioStore.audio.currentTime
    if (audioStore.isPlaying && videoRef.value) videoRef.value?.play()
  }
}

watch(visibleVideo, async (visible) => {
  if (!visible) return
  await nextTick()
  if (!videoRef.value) return

  videoRef.value.currentTime = audioStore.audio.currentTime
  if (audioStore.isPlaying) videoRef.value.play().catch(() => {})
})

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
<!--  <div :key="audioStore.activeTrack.id"-->
<!--       :class="[-->
<!--            'img-container absolute right-0 h-screen aspect-square transition-[scale,width] duration-1200',-->
<!--            audioStore.isPlaying && (controllersStore.mode === 'img') && 'will-change-transform scale-105',-->
<!--            controllersStore.mode === 'video' ? 'w-[75vw]' : 'w-[100vh]',-->
<!--        ]"-->
<!--  >-->
<!--    <img :src="`${BASE_URL}${audioStore.activeTrack.previewUrl}`"-->
<!--         :alt="audioStore.activeTrack?.name"-->
<!--         draggable="false"-->
<!--         :class="[-->
<!--            'transition-[opacity]',-->
<!--            visibleImage ? 'opacity-100' : 'opacity-0 hidden'-->
<!--         ]"-->
<!--    >-->
<!--    <video :src="`${BASE_URL}${audioStore.activeTrack?.videoClipUrl}`"-->
<!--           muted-->
<!--           ref="videoRef"-->
<!--           preload="auto"-->
<!--           :class="[-->
<!--               'transition-[opacity]',-->
<!--               visibleVideo ? 'opacity-100' : 'opacity-0 hidden'-->
<!--           ]"-->
<!--    />-->
<!--  </div>-->

  <TransitionGroup name="fade-absolute"
                   mode="out-in"
                   tag="div"
                   :class="[
                        'img-container absolute right-0 h-screen aspect-square transition-[scale,width] duration-1200',
                        audioStore.isPlaying && (controllersStore.mode === 'img') && 'will-change-transform scale-105',
                        controllersStore.mode === 'video' ? 'w-[75vw]' : 'w-[100vh]',
                    ]"
  >
    <img v-if="visibleImage"
         :src="`${BASE_URL}${audioStore.activeTrack.previewUrl}`"
         :alt="audioStore.activeTrack?.name"
         draggable="false"
    >
    <video v-else
           :src="`${BASE_URL}${audioStore.activeTrack?.videoClipUrl}`"
           muted
           ref="videoRef"
           preload="auto"
    />
  </TransitionGroup>

</template>