<script setup lang="ts">
import {computed, ref} from "vue";

import {LikeService} from "@api/like/LikeService.ts";

import BitratesList from "@components/musicCard/BitratesList.vue";

import Like from "@ui/Like.vue";
import Tooltip from "@ui/Tooltip.vue";
import Modal from "@ui/Modal.vue";
import Icon from "@ui/Icon.vue";

import ViewIcon from "@icons/ViewIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const bitrateText = computed(() => {
  const bitrate = `${audioStore.currentBitrate / 1000} Кб/с`
  return audioStore.isAutoBitrate ? `Авто (${bitrate})` : bitrate
})

const visibleBitratesList = ref<boolean>(false)

const handleLike = async () => {
  const activeTrack = musicStore.activeTrack

  try {
    const response = await LikeService.like(musicStore.activeTrack.id)

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
                    :is-liked="musicStore.activeTrack?.isLiked && userStore.isLogged"
              />

              {{musicStore.activeTrack?.likesCount || 0}}
            </button>
          </template>

          <template #default>
            <p class="text-center">Чтобы добавить трек в избранное необходимо авторизоваться</p>
          </template>
        </Modal>
      </template>

      <template #default>
        {{musicStore.activeTrack?.isLiked ? 'Удалить из Избранного' : 'Добавить в Избранное'}}
      </template>
    </Tooltip>

    <Transition name="fade">
      <Tooltip v-if="musicStore.activeTrack?.auditionsCount">
        <template #activator>
          <div class="recolor-svg h-full flex-center gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums">
            <Icon :name="ViewIcon" :size="25" :laptop-size="23"/>

            {{musicStore.activeTrack.auditionsCount.toLocaleString()}}
          </div>
        </template>

        <template #default>
          Кол-во прослушиваний
        </template>
      </Tooltip>
    </Transition>

    <Transition name="fade">
      <Tooltip v-if="musicStore.activeTrack?.genre?.name">
        <template #activator>
        <span class="h-full flex-center text-accent gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums">
          {{musicStore.activeTrack.genre.name}}
        </span>
        </template>

        <template #default>
          Жанр трека
        </template>
      </Tooltip>
    </Transition>

    <Transition name="fade">
      <Tooltip v-if="musicStore.activeTrack?.bitrates?.length"
               v-model:show="visibleBitratesList"
               :has-hover="false"
      >
        <template #activator>
          <button class="h-full flex-center text-accent gap-2.5 bg-[#26262650] py-1 px-2.5 rounded-regular tabular-nums"
                  type="button"
                  @click="visibleBitratesList = !visibleBitratesList"
          >
            {{bitrateText}}
          </button>
        </template>

        <template #default>
          <BitratesList v-model:visible="visibleBitratesList" />
        </template>
      </Tooltip>
    </Transition>
  </div>

</template>