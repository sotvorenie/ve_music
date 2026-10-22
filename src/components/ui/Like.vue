<script setup lang="ts">
import LikeIcon from "@/components/icons/LikeIcon.vue";

withDefaults(
    defineProps<{
      isLiked: boolean
    }>(), {
      isLiked: false,
    }
)
</script>

<template>

  <LikeIcon :class="['like transition-[stroke,fill,transform]', isLiked && 'is-liked']"/>

</template>

<style scoped lang="scss">
.like {

  &.is-liked {
    color: var(--accent);
    fill: var(--accent);
    animation: likeAnimation var(--transition-duration-big) cubic-bezier(0.68, -0.55, 0.27, 1.55);

    @keyframes likeAnimation {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.1) rotate(-5deg);
      }
      50% {
        transform: scale(0.9);
      }
      70% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1) rotate(0);
      }
    }
  }
}
</style>