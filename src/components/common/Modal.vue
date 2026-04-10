<script setup lang="ts">

import ButtonUi from "../ui/ButtonUi.vue";
import {onBeforeUnmount, onMounted} from "vue";

defineProps({
  closeVisible: {
    type: Boolean,
    default: false,
  },
  closeText: {
    type: String,
    default: 'Ок',
  },
  size: {
    type: Number,
    default: 400,
  },
})

const isVisible = defineModel({type: Boolean, default: false})

const open = () => {
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', handleEsc))
onBeforeUnmount(() => document.addEventListener('keydown', handleEsc))
</script>

<template>

  <slot name="activator" :open="open" :close="close"/>

  <Transition name="fade-small">
    <Teleport to="body">
      <div class="modal z-10000 flex-center" v-if="isVisible" @click="close">
        <div class="modal__content" :style="{width: `${size / 16}rem`}" @click.stop>
          <slot name="default" :close="close"/>

          <ButtonUi v-if="closeVisible"
                    class="modal__close text-upper"
                    @click="close"
          >
            {{closeText}}
          </ButtonUi>
        </div>
      </div>
    </Teleport>
  </Transition>

</template>