<script setup lang="ts">
import LikeIcon from "../../assets/icons/LikeIcon.vue";

defineProps({
  isLiked: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>

  <LikeIcon class="like" :class="{'is-active': isLiked}"/>

</template>