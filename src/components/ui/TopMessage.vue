<script setup lang="ts">
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const visible = defineModel<boolean>({default: false})
</script>

<template>

  <Teleport to="body">
    <Transition name="from-top">
      <div v-if="visible"
           class="top-message position-fixed z-1000 text-w500"
           :class="{
              'light': messageStore.type === 'light',
              'dark': messageStore.type === 'dark',
           }"
      >
        {{messageStore.messageText}}
      </div>
    </Transition>
  </Teleport>

</template>