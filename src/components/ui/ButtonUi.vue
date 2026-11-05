<script setup lang="ts">
import LoadingIcon from "@/components/icons/LoadingIcon.vue";

withDefaults(
    defineProps<{
      isLoading?: boolean
      isDisabled?: boolean
      isActive?: boolean
      isSubmit?: boolean
    }>(), {
      isLoading: false,
      isDisabled: false,
      isActive: false,
      isSubmit: false,
    }
)
</script>

<template>

  <button :class="[
              'recolor-svg relative border border-light font-medium rounded-regular p-4 leading-none hover:bg-light hover:text-dark-alt',
              isActive && 'bg-light text-dark-alt pointer-events-none',
          ]"
          :disabled="isLoading || isDisabled"
          :type="isSubmit ? 'submit' : 'button'"
  >
    <Transition name="fade">
      <span v-if="!isLoading" class="transition-opacity"><slot/></span>
    </Transition>

    <Transition name="fade">
      <LoadingIcon v-if="isLoading" class="abs-center w-6 3xl:w-7.5 h-auto"/>
    </Transition>
  </button>

</template>