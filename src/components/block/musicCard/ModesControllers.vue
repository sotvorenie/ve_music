<script setup lang="ts">
import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import ImgIcon from "@icons/ImgIcon.vue";
import VideoIcon from "@icons/VideoIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
</script>

<template>

  <div v-if="audioStore.activeTrack.id >= 0"
       class="flex items-center gap-2.5 w-1/5"
  >
    <Tooltip>
      <template #activator>
        <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.mode === 'img' && 'bg-dark-15 pointer-events-none'
                    ]"
                @click="controllersStore.mode = 'img'"
                type="button"
        >
          <Icon :name="ImgIcon" :size="27"/>
        </button>
      </template>

      <template #default>
        Постер
      </template>
    </Tooltip>

    <Tooltip>
      <template #activator>
        <Transition name="scale">
          <button v-if="audioStore.activeTrack.videoClipUrl"
                  :class="[
                          'controllers__small-btn recolor-svg flex-center',
                          controllersStore.mode === 'video' && 'bg-dark-15 pointer-events-none'
                      ]"
                  @click="controllersStore.mode = 'video'"
                  type="button"
          >
            <Icon :name="VideoIcon" :size="27"/>
          </button>
        </Transition>
      </template>

      <template #default>
        Клип
      </template>
    </Tooltip>
  </div>

</template>