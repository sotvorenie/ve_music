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

  <LikeIcon :class="['like', isLiked && 'is-liked']"/>

</template>