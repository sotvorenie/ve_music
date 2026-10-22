<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {showArtists} from "@composables/useShowArtists.ts";

import Actions from "@components/musicCard/Actions.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const nameTrackRef = ref<HTMLDivElement | null>(null)

const isNameOverflow = ref(false)
const isNameShadow = ref(false)

const timer = ref<number | null>(null)

const checkWidth = async () => {
  isNameOverflow.value = false
  isNameShadow.value = false

  await nextTick()

  if (nameTrackRef.value) {
    const containerWidth = nameTrackRef.value.parentElement?.clientWidth
    const contentWidth = nameTrackRef.value.scrollWidth

    if (timer.value) clearTimeout(timer.value)
    if (!containerWidth || !contentWidth) return

    if (contentWidth > containerWidth) {
      isNameShadow.value = true
      nameTrackRef.value.style.animationDuration = `${contentWidth / containerWidth * 20}s`
      timer.value = setTimeout(() => {
        isNameOverflow.value = true
      }, 1000)
    }
  }
}

watch(
    () => audioStore.activeTrack.id,
    () => checkWidth(),
    {immediate: true}
)
</script>

<template>

  <Transition name="list">
    <div :key="audioStore.activeTrack?.name"
         class="info mb-4"
    >
      <Actions/>

      <div :class="[
               'text-[4rem] 3xl:text-[6.25rem] font-bold w-full overflow-hidden relative text-nowrap leading-[1.2] transition-[transform] duration-500',
               isNameShadow && 'mask-[linear-gradient(90deg,transparent,var(--dark)_5%,#000_90%,transparent)]'
           ]"
      >
        <div :class="[
                 'info__track inline-flex',
                 isNameOverflow && 'animate-[music-animate_linear_infinite]'
             ]"
             ref="nameTrackRef"
        >
          <span>
            {{ audioStore.activeTrack?.name }}
          </span>

          <span v-if="isNameOverflow"
                class="ml-37.5"
          >
            {{ audioStore.activeTrack?.name }}
          </span>
        </div>
      </div>

      <div class="text-[1.8rem] 3xl:text-[2.625rem] leading-[1.2] w-full overflow-hidden relative text-nowrap truncate">
        {{ showArtists(audioStore.activeTrack?.artists) }}
      </div>
    </div>
  </Transition>

</template>