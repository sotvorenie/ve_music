<script setup lang="ts">
import LoadingIcon from "@icons/LoadingIcon.vue";

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