<script setup lang="ts">
import Icon from "@ui/Icon.vue";

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
      <Icon v-if="isLoading"
            :name="LoadingIcon"
            :size="30"
            :laptop-size="24"
            class="abs-center"
      />
    </Transition>
  </button>

</template>