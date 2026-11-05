<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {showArtists} from "@composables/useShowArtists.ts";

import Actions from "@components/musicCard/Actions.vue";

import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const nameTrackRef = ref<HTMLDivElement | null>(null)

const isNameOverflow = ref(false)
const isNameShadow = ref(false)

const checkWidth = async () => {
  isNameOverflow.value = false
  isNameShadow.value = false

  await nextTick()

  if (nameTrackRef.value) {
    const containerWidth = nameTrackRef.value.parentElement?.clientWidth
    const contentWidth = nameTrackRef.value.scrollWidth

    if (!containerWidth || !contentWidth) return

    if (contentWidth > containerWidth) {
      isNameShadow.value = true
      nameTrackRef.value.style.animationDuration = `${contentWidth / containerWidth * 20}s`
    }
  }
}

watch(
    () => musicStore.activeTrack.id,
    checkWidth,
    {immediate: true, flush: 'post'}
)
</script>

<template>

  <Transition name="list"
              @after-leave="isNameOverflow = isNameShadow"
  >
    <div :key="musicStore.activeTrack?.name"
         class="info mb-4"
    >
      <Actions v-if="musicStore.activeTrack.id >= 0"/>

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
            {{ musicStore.activeTrack?.name }}
          </span>

          <span v-if="isNameOverflow"
                class="ml-37.5"
          >
            {{ musicStore.activeTrack?.name }}
          </span>
        </div>
      </div>

      <div v-if="musicStore.activeTrack.id >= 0"
           class="text-[1.8rem] 3xl:text-[2.625rem] leading-[1.2] w-full overflow-hidden relative text-nowrap truncate"
      >
        {{ showArtists(musicStore.activeTrack?.artists) }}
      </div>
    </div>
  </Transition>

</template>