<script setup lang="ts">
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const visible = defineModel<boolean>({default: false})
</script>

<template>

  <Teleport to="body">
    <Transition name="from-top">
      <div v-if="visible"
           class="flex-center fixed top-5 z-[1000] left-0 right-0 pointer-events-none"
      >
        <div class="py-2.5 px-5 rounded-medium font-medium bg-light text-dark">
          {{messageStore.messageText}}
        </div>
      </div>
    </Transition>
  </Teleport>

</template>