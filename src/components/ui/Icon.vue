<script setup lang="ts">
import type {Component} from "vue";

defineProps<{
  name: Component
  size: number
  laptopSize?: number
  recolor?: boolean
}>()
</script>

<template>

  <i :class="[
        'flex-center icon-box',
        recolor && 'recolor-svg'
     ]"
  >
    <Component :is="name" :style="{
      '--desk-sz': `${size / 16}rem`,
      '--lap-sz': `${(laptopSize || size) / 16}rem`,
    }"/>
  </i>

</template>

<style scoped>
.icon-box svg {
  --lap-sz: 20px;
  --desk-sz: 20px;

  width: var(--lap-sz) !important;
  min-width: var(--lap-sz) !important;
  height: var(--lap-sz) !important;
  min-height: var(--lap-sz) !important;
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