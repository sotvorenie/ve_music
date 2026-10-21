<template>

  <ul class="skeleton-artists absolute z-10">
    <li class="skeleton-artists__item flex items-center" v-for="i in 5" :key="i">
      <div class="skeleton-artists__avatar skeleton-item" />
      <div class="skeleton-artists__name skeleton-item" />
    </li>
  </ul>

</template>