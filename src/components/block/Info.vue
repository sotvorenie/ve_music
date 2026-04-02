<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {showArtists} from "../../composables/useShowArtists.ts";

import Like from "../ui/Like.vue";

import ViewIcon from "../../assets/icons/ViewIcon.vue";

import useAudioStore from "../../store/useAudioStore.ts";
import Tooltip from "../ui/Tooltip.vue";
const audioStore = useAudioStore();

const nameTrackRef = ref<HTMLDivElement | null>(null)

const isNameOverflow = ref(false)
const isNameShadow = ref(false)

const timer = ref<number | null>(null)

const isLiked = ref<boolean>(false)

const handleLike = () => {
  isLiked.value = !isLiked.value
}

const checkWidth = async () => {
  isNameOverflow.value = false
  isNameShadow.value = false

  await nextTick()

  if (nameTrackRef.value) {
    const containerWidth = nameTrackRef.value.parentElement?.clientWidth
    const contentWidth = nameTrackRef.value.scrollWidth

    if (timer.value) clearTimeout(timer.value)

    if (!containerWidth || !contentWidth) return

    const check = contentWidth > containerWidth

    if (!check) return

    isNameShadow.value = check
    nameTrackRef.value.style.animationDuration = `${contentWidth / containerWidth * 20}s`
    timer.value = setTimeout(() => {
      isNameOverflow.value = check
    }, 1000)
  }
}

watch(
    () => audioStore.activeTrack,
    () => checkWidth(),
    {immediate: true, deep: true}
)
</script>

<template>

  <Transition name="list">
    <div class="info" :key="audioStore.activeTrack?.name">
      <div class="info__statistics flex flex-align-center">
        <Tooltip>
          <template #activator>
            <button class="info__statistics-item recolor-svg hover-color-accent flex flex-align-center"
                    type="button"
                    @click="handleLike"
            >
              <Like :is-liked="isLiked"/>
              {{audioStore.activeTrack?.likes || 0}}
            </button>
          </template>
          <template #default>
            {{isLiked ? 'Удалить из Избранного' : 'Добавить в Избранное'}}
          </template>
        </Tooltip>

        <Tooltip>
          <template #activator>
            <div class="info__statistics-item recolor-svg flex flex-align-center">
              <ViewIcon/>
              {{(audioStore.activeTrack?.auditions || 0).toLocaleString()}}
            </div>
          </template>
          <template #default>
            Кол-во прослушиваний
          </template>
        </Tooltip>
      </div>

      <div class="info__title text-w700 w-100 overflow-hidden position-relative text-nowrap"
           :class="{'shadow': isNameShadow}"
      >
        <div class="info__track" :class="{ 'animate': isNameOverflow }" ref="nameTrackRef">
          <span>{{ audioStore.activeTrack?.name }}</span>
          <span v-if="isNameOverflow" class="info__spacer">{{ audioStore.activeTrack?.name }}</span>
        </div>
      </div>

      <div class="info__author w-100 overflow-hidden position-relative text-nowrap">
        {{ showArtists(audioStore.activeTrack?.artists) }}
      </div>
    </div>
  </Transition>

</template>