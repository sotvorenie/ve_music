<script setup lang="ts">
import {watch} from "vue";

defineProps({
  message: String,
  theme: {
    type: String,
    default: 'light',
  },
})

const visible = defineModel({type: Boolean, default: false})

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