<script setup lang="ts">

import {apiLike} from "@api/like/like.ts";

import Like from "@ui/Like.vue";
import Tooltip from "@ui/Tooltip.vue";
import Modal from "@ui/Modal.vue";

import ViewIcon from "@icons/ViewIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();

const handleLike = async () => {
  try {
    const response = await apiLike(audioStore.activeTrack.id)

    audioStore.activeTrack.isLiked = response.isLiked
    if (response?.isLiked) {
      audioStore.activeTrack.likesCount = audioStore.activeTrack.likesCount + 1
    } else {
      audioStore.activeTrack.likesCount = Math.max(audioStore.activeTrack.likesCount - 1, 0)
    }
  } catch (err) {
    console.error(err)
    audioStore.activeTrack.isLiked = false
  }
}
</script>

<template>

  <div class="info__statistics flex flex-align-center">
    <Tooltip>
      <template #activator>
        <Modal close-visible>
          <template #activator="{open}">
            <button class="info__statistics-item recolor-svg hover-color-accent flex flex-align-center"
                    type="button"
                    @click="userStore.user.id >= 0 ? handleLike() : open()"
            >
              <Like :is-liked="audioStore.activeTrack?.isLiked && userStore.isLogged"/>
              {{audioStore.activeTrack?.likesCount || 0}}
            </button>
          </template>

          <template #default>
            <p class="text-center">Чтобы добавить трек в избранное необходимо авторизоваться</p>
          </template>
        </Modal>
      </template>
      <template #default>
        {{audioStore.activeTrack?.isLiked ? 'Удалить из Избранного' : 'Добавить в Избранное'}}
      </template>
    </Tooltip>

    <Tooltip>
      <template #activator>
        <div class="info__statistics-item recolor-svg flex flex-align-center">
          <ViewIcon/>
          {{(audioStore.activeTrack?.auditionsCount || 0).toLocaleString()}}
        </div>
      </template>
      <template #default>
        Кол-во прослушиваний
      </template>
    </Tooltip>
  </div>

</template>