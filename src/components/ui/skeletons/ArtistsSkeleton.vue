<script setup lang="ts">

</script>

<template>

  <ul class="skeleton-artists position-absolute z-10">
    <li class="skeleton-artists__item flex flex-align-center" v-for="_ in [0,1,2,3,4]" :key="_">
      <div class="skeleton-artists__avatar skeleton-item" />
      <div class="skeleton-artists__name skeleton-item" />
    </li>
  </ul>

</template>