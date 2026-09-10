<script setup lang="ts">
withDefaults(
    defineProps<{
      hidden?: boolean
      position?: string
    }>(), {
      position: 'top',
      hidden: false,
    }
)
</script>

<template>

  <div class="tooltip position-relative">
    <slot name="activator"/>

    <div v-if="!hidden"
         :class="['tooltip__content z-10000 text-nowrap', position]"
    >
      <slot/>
    </div>
  </div>

</template>