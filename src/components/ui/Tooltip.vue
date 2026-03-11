<script setup lang="ts">

</script>

<template>

  <div class="tooltip position-relative">
    <slot name="activator"/>

    <div class="tooltip__content position-absolute z-10000 text-nowrap">
      <slot/>
    </div>
  </div>

</template>