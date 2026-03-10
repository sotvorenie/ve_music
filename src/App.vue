<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";

import Menu from "./components/block/Menu.vue";
import Info from "./components/block/Info.vue";
import Controls from "./components/block/Controllers.vue";
import List from "./components/block/List.vue";
import Vignette from "./components/ui/Vignette.vue";
import Aside from "./components/block/Aside.vue";
import GenresSkeleton from "./components/ui/skeletons/GenresSkeleton.vue";
import MusicListSkeleton from "./components/ui/skeletons/MusicListSkeleton.vue";
import Preview from "./components/block/Preview.vue";

import useAudioStore from "./store/useAudioStore.ts";
const audioStore = useAudioStore();


const visible = ref(false)

const videoRef = ref<HTMLVideoElement | null>(null)

const handleKey = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable) return

  e.preventDefault()
  audioStore.isPlaying = !audioStore.isPlaying
}

watch(
    () => audioStore.isPlaying,
    (newVal) => {
      if (newVal) {
        audioStore.audio.play()
        if (videoRef.value) videoRef.value.play()
      } else {
        audioStore.audio.pause()
        if (videoRef.value) videoRef.value.pause()
      }
    }
)

onMounted(() => {
  globalThis.addEventListener("keydown", handleKey)

  setTimeout(() => {
    visible.value = true
  }, 1000)
})

onUnmounted(() => {
  globalThis.removeEventListener("keydown", handleKey)
})
</script>

<template>

  <Transition name="fade">
    <div class="music" v-if="visible">
      <Vignette/>

      <Aside/>

      <Suspense>
        <template #default>
          <Menu/>
        </template>
        <template #fallback>
          <GenresSkeleton/>
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <List/>
        </template>
        <template #fallback>
          <MusicListSkeleton/>
        </template>
      </Suspense>

      <Preview/>

      <div class="music__card position-absolute z-10">
        <Info v-if="audioStore.activeTrack.id >= 0"/>

        <Controls/>
      </div>
    </div>
  </Transition>

</template>