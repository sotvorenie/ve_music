<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";

import ButtonUi from "@ui/ButtonUi.vue";

withDefaults(
    defineProps<{
      closeVisible?: boolean
      closeText?: string
      size?: number
    }>(), {
      closeVisible: false,
      closeText: 'Ок',
      size: 400,
    }
)

const isVisible = defineModel<boolean>({default: false})

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
onBeforeUnmount(() => document.removeEventListener('keydown', handleEsc))
</script>

<template>

  <slot name="activator" :open="open" :close="close"/>

  <Transition name="fade-small">
    <Teleport to="body">
      <div class="modal absolute inset-0 z-[10000] flex-center bg-[rgba(0,0,0,.6)] backdrop-blur-[5px]" v-if="isVisible" @click="close">
        <div class="bg-dark-15 p-5 rounded-medium"
             :style="{width: `${size / 16}rem`}"
             @click.stop
        >
          <slot name="default" :close="close"/>

          <ButtonUi v-if="closeVisible"
                    class="uppercase mt-7.5 mx-auto w-[min(100%,_25rem)]"
                    @click="close"
          >
            {{closeText}}
          </ButtonUi>
        </div>
      </div>
    </Teleport>
  </Transition>

</template>