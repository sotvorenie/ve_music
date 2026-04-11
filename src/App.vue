<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";

import {checkMe} from "./utils/auth.ts";

import Menu from "./components/block/Menu.vue";
import Info from "./components/block/Info.vue";
import Controls from "./components/block/Controllers.vue";
import List from "./components/block/List.vue";
import Vignette from "./components/ui/Vignette.vue";
import Aside from "./components/block/Aside.vue";
import GenresSkeleton from "./components/ui/skeletons/GenresSkeleton.vue";
import MusicListSkeleton from "./components/ui/skeletons/MusicListSkeleton.vue";
import Preview from "./components/block/Preview.vue";
import Search from "./components/block/Search.vue";

import useAudioStore from "./store/useAudioStore.ts";
const audioStore = useAudioStore();


const visible = ref(false)

const allKeyCodes = {
  space: 'Space',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
}

const handleKey = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable) return


  const audio = audioStore.audio

  switch (e.code) {
    case allKeyCodes.space:
      e.preventDefault()
      audioStore.isPlaying = !audioStore.isPlaying
      break
    case allKeyCodes.arrowLeft:
      if (Number.isNaN(audio.duration)) break
      e.preventDefault()
      audio.currentTime = Math.max(0, audio.currentTime - 5)
      break
    case allKeyCodes.arrowRight:
      if (Number.isNaN(audio.duration)) break
      e.preventDefault()
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
      break
  }
}

watch(
    () => audioStore.isPlaying,
    (newVal) => {
      newVal ? audioStore.audio.play() : audioStore.audio.pause()
    }
)

onMounted(async () => {
  globalThis.addEventListener("keydown", handleKey)

  await checkMe()

  visible.value = true
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

      <Search/>

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