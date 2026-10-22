<script setup lang="ts">
withDefaults(
    defineProps<{
      hidden?: boolean
      position?: 'top' | 'right' | 'bottom-right'
      hasDelay?: boolean
    }>(), {
      position: 'top',
      hidden: false,
    }
)
</script>

<template>

  <div :class="[
            'tooltip relative z-[100] leading-none',
            hasDelay && 'has-delay'
        ]"
  >
    <slot name="activator"/>

    <div :class="[
             'tooltip__content opacity-0 z-[10000] text-nowrap pointer-events-none transition-[opacity,transform] duration-250 bg-dark-15 rounded-regular p-2.5 w-fit-content',
             position,
             hidden && '!opacity-0'
         ]"
    >
      <slot/>
    </div>
  </div>

</template>