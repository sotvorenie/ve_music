<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {showArtists} from "@composables/useShowArtists.ts";

import Actions from "@components/Actions.vue";

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
    {immediate: true, deep: true}
)
</script>

<template>

  <Transition name="list">
    <div :key="audioStore.activeTrack?.name"
         class="info mb-4"
    >
      <Actions/>

      <div :class="[
               'info__title font-bold w-full overflow-hidden relative text-nowrap leading-[1.2]',
               isNameShadow && 'shadow'
           ]"
      >
        <div :class="[
                 'info__track inline-flex',
                 isNameOverflow && 'animate'
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

      <div class="info__author leading-[1.2] w-full overflow-hidden relative text-nowrap text-ellipsis">
        {{ showArtists(audioStore.activeTrack?.artists) }}
      </div>
    </div>
  </Transition>

</template>