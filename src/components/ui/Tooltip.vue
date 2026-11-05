<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

withDefaults(
    defineProps<{
      hidden?: boolean
      position?: 'top' | 'right' | 'bottom-right'
      hasDelay?: boolean
      hasHover?: boolean
    }>(), {
      position: 'top',
      hidden: false,
      hasHover: true,
    }
)

const show = defineModel('show', {type: Boolean, default: false})

const tooltipRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (!tooltipRef.value?.contains(e.target as Node)) show.value = false
}

onMounted(() => globalThis.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => globalThis.removeEventListener('click', handleClickOutside))
</script>

<template>

  <div :class="[
            'tooltip relative z-[100] leading-none',
            hasDelay && 'has-delay',
            show && 'is-active',
            hasHover && 'has-hover',
        ]"
       ref="tooltipRef"
  >
    <slot name="activator"/>

    <div :class="[
             'tooltip__content opacity-0 z-[10000] text-nowrap transition-[opacity,transform] duration-250 bg-dark-15 rounded-regular p-2.5 w-fit-content',
             position,
             hidden && '!opacity-0',
             !show && 'pointer-events-none',
         ]"
    >
      <slot/>
    </div>
  </div>

</template>