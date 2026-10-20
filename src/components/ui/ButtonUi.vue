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
              'button recolor-svg relative',
              isActive && 'is-active',
          ]"
          :disabled="isLoading || isDisabled"
          :type="isSubmit ? 'submit' : 'button'"
  >
    <TransitionGroup name="fade-absolute">
      <span key="label"
            class="button__span"
            :style="{opacity: isLoading ? 0 : 1}"
      >
        <slot/>
      </span>

      <LoadingIcon v-if="isLoading"
                   key="loading"
                   class="absolute"
      />
    </TransitionGroup>
  </button>

</template>