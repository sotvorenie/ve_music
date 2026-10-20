<script setup lang="ts">
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const visible = defineModel<boolean>({default: false})
</script>

<template>

  <Teleport to="body">
    <Transition name="from-top">
      <div v-if="visible"
           :class="[
               'top-message abs-x top-5 rounded-medium fixed z-[1000] font-medium',
               messageStore.type === 'light' && 'light',
               messageStore.type === 'dark' && 'dark'
           ]"
      >
        {{messageStore.messageText}}
      </div>
    </Transition>
  </Teleport>

</template>