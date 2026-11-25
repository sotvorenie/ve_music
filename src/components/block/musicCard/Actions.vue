<script setup lang="ts">
import {computed, ref} from "vue";

import {isCanceledErr} from "@/api";
import {LikeService} from "@api/like/LikeService.ts";

import {useAbortableRequest} from "@composables/useAbortableRequest.ts";

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
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
const currentTrackStore = useCurrentTrackStore();

const {nextSignal} = useAbortableRequest()

const bitrateText = computed(() => {
  const bitrate = `${audioStore.currentBitrate / 1000} Кб/с`
  return audioStore.isAutoBitrate ? `Авто (${bitrate})` : bitrate
})

const visibleBitratesList = ref<boolean>(false)

const handleLike = async () => {
  const activeTrack = currentTrackStore.track

  const signal = nextSignal()

  try {
    const response = await LikeService.like(activeTrack.id, signal)

    activeTrack.isLiked = response.isLiked
    activeTrack.likesCount = response.isLiked ? activeTrack.likesCount + 1 : Math.max(activeTrack.likesCount - 1, 0)
  } catch (err: unknown) {
    if (isCanceledErr(err)) return
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
            <button class="recolor-svg h-full flex-center gap-2.5 bg-dark-15/35 py-1 px-2.5 rounded-regular tabular-nums"
                    @click="userStore.isLogged ? handleLike() : open()"
                    type="button"
            >
              <Like class="aspect-square w-6 3xl:w-7.5 h-auto"
                    :is-liked="currentTrackStore.track?.isLiked && userStore.isLogged"
              />

              {{currentTrackStore.track?.likesCount || 0}}
            </button>
          </template>

          <template #default>
            <p class="text-center">Чтобы добавить трек в избранное необходимо авторизоваться</p>
          </template>
        </Modal>
      </template>

      <template #default>
        {{currentTrackStore.track?.isLiked ? 'Удалить из Избранного' : 'Добавить в Избранное'}}
      </template>
    </Tooltip>

    <Transition name="fade">
      <Tooltip v-if="currentTrackStore.track?.auditionsCount">
        <template #activator>
          <div class="recolor-svg h-full flex-center gap-2.5 bg-dark-15/35 py-1 px-2.5 rounded-regular tabular-nums">
            <Icon :name="ViewIcon" :size="25" :laptop-size="23"/>

            {{currentTrackStore.track.auditionsCount.toLocaleString()}}
          </div>
        </template>

        <template #default>
          Кол-во прослушиваний
        </template>
      </Tooltip>
    </Transition>

    <Transition name="fade">
      <Tooltip v-if="currentTrackStore.track?.genre?.name">
        <template #activator>
        <span class="h-full flex-center text-accent gap-2.5 bg-dark-15/35 py-1 px-2.5 rounded-regular tabular-nums">
          {{currentTrackStore.track.genre.name}}
        </span>
        </template>

        <template #default>
          Жанр трека
        </template>
      </Tooltip>
    </Transition>

    <Transition name="fade">
      <Tooltip v-if="currentTrackStore.track?.bitrates?.length"
               v-model:show="visibleBitratesList"
               :has-hover="false"
      >
        <template #activator>
          <button class="h-full flex-center text-accent gap-2.5 bg-dark-15/35 py-1 px-2.5 rounded-regular tabular-nums hover:bg-dark-15/60"
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