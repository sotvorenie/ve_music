<script setup lang="ts">
import type {Component} from "vue";

defineProps<{
  name: Component
  size: number
  recolor?: boolean
}>()
</script>

<template>

  <span class="flex-center" :class="recolor && 'recolor-svg'">
    <Component :is="name" :style="{
      width: size / 16 + 'rem',
      height: size / 16 + 'rem',
    }"/>
  </span>

</template>