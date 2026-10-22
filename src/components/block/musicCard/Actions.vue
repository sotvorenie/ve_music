<script setup lang="ts">
import {apiLike} from "@api/like/like.ts";

import Like from "@ui/Like.vue";
import Tooltip from "@ui/Tooltip.vue";
import Modal from "@ui/Modal.vue";
import Icon from "@ui/Icon.vue";

import ViewIcon from "@icons/ViewIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();

const handleLike = async () => {
  const activeTrack = audioStore.activeTrack

  try {
    const response = await apiLike(audioStore.activeTrack.id)

    activeTrack.isLiked = response.isLiked
    activeTrack.likesCount = response.isLiked ? activeTrack.likesCount + 1 : Math.max(activeTrack.likesCount - 1, 0)
  } catch {
    activeTrack.isLiked = false
  }
}
</script>

<template>

  <div class="flex gap-2.5">
    <Tooltip>
      <template #activator>
        <Modal close-visible>
          <template #activator="{open}">
            <button class="recolor-svg h-full flex-center gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums"
                    @click="userStore.isLogged ? handleLike() : open()"
                    type="button"
            >
              <Like class="aspect-square w-6 3xl:w-7.5 h-auto"
                    :is-liked="audioStore.activeTrack?.isLiked && userStore.isLogged"
              />

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
        <div class="recolor-svg h-full flex-center gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums">
          <Icon :name="ViewIcon" :size="25" :laptop-size="23"/>

          {{(audioStore.activeTrack?.auditionsCount || 0).toLocaleString()}}
        </div>
      </template>

      <template #default>
        Кол-во прослушиваний
      </template>
    </Tooltip>

    <Tooltip>
      <template #activator>
        <span class="h-full flex-center text-accent gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums">
          {{audioStore.activeTrack?.genre?.name}}
        </span>
      </template>

      <template #default>
        Жанр трека
      </template>
    </Tooltip>
  </div>

</template>