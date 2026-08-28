<script setup lang="ts">
withDefaults(
    defineProps<{
      position?: string
    }>(), {
      position: 'top',
    }
)
</script>

<template>

  <div class="tooltip position-relative">
    <slot name="activator"/>

    <div :class="['tooltip__content z-10000 text-nowrap', position]">
      <slot/>
    </div>
  </div>

</template>