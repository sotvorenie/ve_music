<script setup lang="ts">
defineProps({
  position: {
    type: String,
    default: 'top'
  }
})
</script>

<template>

  <div class="tooltip position-relative">
    <slot name="activator"/>

    <div :class="['tooltip__content z-10000 text-nowrap', $props.position]">
      <slot/>
    </div>
  </div>

</template>