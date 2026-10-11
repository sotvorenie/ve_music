<script setup lang="ts">
import type {Component} from "vue";

defineProps<{
  name: Component
  size: number
  tabletSize?: number
  recolor?: boolean
}>()
</script>

<template>

  <i class="flex-center icon-box" :class="recolor && 'recolor-svg'">
    <Component :is="name" :style="{
      '--desk-sz': `${size / 16}rem`,
      '--tab-sz': `${(tabletSize || size) / 16}rem`,
    }"/>
  </i>

</template>

<style scoped>
.icon-box svg {
  --tab-sz: 20px;
  --desk-sz: 20px;

  width: var(--tab-sz) !important;
  min-width: var(--tab-sz) !important;
  height: var(--tab-sz) !important;
  min-height: var(--tab-sz) !important;
}

@media (min-width: 1920px) {
  .icon-box svg {
    min-width: var(--desk-sz) !important;
    width: var(--desk-sz) !important;
    height: var(--desk-sz) !important;
    min-height: var(--desk-sz) !important;
  }
}
</style>