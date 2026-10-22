<script setup lang="ts">
withDefaults(
    defineProps<{
      hidden?: boolean
      position?: 'top' | 'right' | 'bottom-right'
    }>(), {
      position: 'top',
      hidden: false,
    }
)
</script>

<template>

  <div class="tooltip relative z-[100]">
    <slot name="activator"/>

    <div v-if="!hidden"
         :class="[
             'tooltip__content opacity-0 z-[10000] text-nowrap pointer-events-none transition-[opacity,transform] duration-250 bg-dark-15 rounded-regular p-2.5 w-fit-content',
             position
         ]"
    >
      <slot/>
    </div>
  </div>

</template>