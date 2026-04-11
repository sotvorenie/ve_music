<script setup lang="ts">

import LoadingIcon from "../../assets/icons/LoadingIcon.vue";

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isSubmit: {
    type: Boolean,
    default: false,
  },
})

</script>

<template>

  <button class="button recolor-svg position-relative"
          :class="{'is-active': isActive}"
          :type="isSubmit ? 'submit' : 'button'"
          :disabled="isLoading || isDisabled"
  >
    <TransitionGroup name="fade-absolute">
      <span class="button__span"
            :style="{opacity: isLoading ? 0 : 1}"
      >
        <slot/>
      </span>

      <LoadingIcon v-if="isLoading" class="position-absolute"/>
    </TransitionGroup>
  </button>

</template>