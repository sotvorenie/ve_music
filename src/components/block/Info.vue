<script setup lang="ts">
import {nextTick, ref, watch} from "vue";

import {apiCheckIsLike, apiLike} from "../../api/like/like.ts";

import {showArtists} from "../../composables/useShowArtists.ts";

import Tooltip from "../common/Tooltip.vue";
import Like from "../ui/Like.vue";
import Modal from "../common/Modal.vue";

import ViewIcon from "../../assets/icons/ViewIcon.vue";

import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useUserStore from "../../store/useUserStore.ts";
const userStore = useUserStore();

const nameTrackRef = ref<HTMLDivElement | null>(null)

const isNameOverflow = ref(false)
const isNameShadow = ref(false)

const timer = ref<number | null>(null)

const isLiked = ref<boolean>(false)

const handleLike = async () => {
  try {
    isLiked.value = !isLiked.value

    const response = await apiLike(audioStore.activeTrack.id)

    if (response?.liked) {
      audioStore.activeTrack.likes = audioStore.activeTrack.likes + 1
    } else {
      audioStore.activeTrack.likes = Math.max(audioStore.activeTrack.likes - 1, 0)
    }
  } catch (err) {
    console.error(err)

    isLiked.value = false
  }
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

const checkIsLiked = async () => {
  if (audioStore.activeTrack?.id < 0 || userStore.user.id < 0) return

  const check = await apiCheckIsLike(audioStore.activeTrack.id)

  isLiked.value = check?.is_liked ? check.is_liked : false
}

watch(
    () => audioStore.activeTrack,
    () => {
      checkWidth()
      checkIsLiked()
    },
    {immediate: true, deep: true}
)
</script>

<template>

  <Transition name="list">
    <div class="info" :key="audioStore.activeTrack?.name">
      <div class="info__statistics flex flex-align-center">
        <Tooltip>
          <template #activator>
            <Modal close-visible>
              <template #activator="{open}">
                <button class="info__statistics-item recolor-svg hover-color-accent flex flex-align-center"
                        type="button"
                        @click="userStore.user.id >= 0 ? handleLike : open()"
                >
                  <Like :is-liked="isLiked"/>
                  {{audioStore.activeTrack?.likes || 0}}
                </button>
              </template>

              <template #default>
                <p class="text-center">Чтобы добавить трек в избранное необходимо авторизоваться</p>
              </template>
            </Modal>
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