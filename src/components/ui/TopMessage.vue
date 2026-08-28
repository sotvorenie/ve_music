<script setup lang="ts">
import {watch} from "vue";

withDefaults(
    defineProps<{
      message: string
      theme: 'light' | 'dark'
    }>(), {
      theme: 'light'
    }
)

const visible = defineModel<boolean>({default: false})

watch(
    () => visible.value,
    (newValue) => {
      if (newValue) {
        setTimeout(() => {
          visible.value = false
        }, 3000)
      }
    }
)
</script>

<template>

  <Teleport to="body">
    <Transition name="from-top">
      <div class="top-message position-fixed z-1000 text-w500"
           :class="{
            'light': theme === 'light',
            'dark': theme === 'dark',
         }"
           v-if="visible"
      >
        {{message}}
      </div>
    </Transition>
  </Teleport>

</template>