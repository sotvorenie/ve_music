<template>

  <ul class="flex flex-col gap-2.5 absolute z-10">
    <li class="w-80 3xl:100 h-20 3xl:h-30 flex items-center gap-5" v-for="i in 5" :key="i">
      <div class="skeleton-item square-25 rounded-full" />
      <div class="skeleton-item grow h-10 rounded-medium" />
    </li>
  </ul>

</template>