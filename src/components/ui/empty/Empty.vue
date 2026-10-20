<script setup lang="ts">
import Icon from "@ui/Icon.vue";

import EmptyIcon from "@/components/icons/EmptyIcon.vue";
</script>

<template>

  <div class="flex-center flex-col abs-center recolor-svg text-2xl">
    <Icon :name="EmptyIcon" :size="100"/>

    <p class="font-semibold">Ничего нет..</p>
  </div>

</template>