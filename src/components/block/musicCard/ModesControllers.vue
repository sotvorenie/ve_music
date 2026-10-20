<script setup lang="ts">
import Tooltip from "@ui/Tooltip.vue";

import ImgIcon from "@icons/ImgIcon.vue";
import VideoIcon from "@icons/VideoIcon.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
</script>

<template>

  <div v-if="audioStore.activeTrack.id >= 0"
       class="controllers__modes flex items-center w-1/5"
  >
    <Tooltip>
      <template #activator>
        <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.mode === 'img' && 'bg-dark-15'
                    ]"
                @click="controllersStore.mode = 'img'"
                type="button"
        >
          <ImgIcon/>
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
                          controllersStore.mode === 'video' && 'bg-dark-15'
                      ]"
                  @click="controllersStore.mode = 'video'"
                  type="button"
          >
            <VideoIcon/>
          </button>
        </Transition>
      </template>

      <template #default>
        Клип
      </template>
    </Tooltip>
  </div>

</template>