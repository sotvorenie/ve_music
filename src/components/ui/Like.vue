<script setup lang="ts">
import LikeIcon from "@icons/LikeIcon.vue";

withDefaults(
    defineProps<{
      isLiked: boolean
    }>(), {
      isLiked: false,
    }
)
</script>

<template>

  <LikeIcon class="like" :class="{'is-active': isLiked}"/>

</template>