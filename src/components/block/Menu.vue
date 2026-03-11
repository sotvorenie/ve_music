<script setup lang="ts">
import {ref} from "vue";

import { GenresList } from "../../types/genre";

import {apiGetAllGenres} from "../../api/genre/genre.ts";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();


const musicIndex = defineModel('musicIndex',{type: Number})

const emits = defineEmits(['updateTag'])

const activeTagId = ref<number>(0)

const menuActive = ref<HTMLLIElement | null>(null)

const genresList = ref<GenresList>()

const handleTag = (id: number, index: number, genreName?: string) => {
  activeTagId.value = id
  musicIndex.value = 0
  menuStore.activeGenreIndex = index + 1
  updateMenuBlock(index)

  if (id >= 0) {
    menuStore.activeGenreName = genreName || ''
    emits('updateTag')
  }
}

const updateMenuBlock = (index: number) => {
  if (!menuActive.value) return

  menuActive.value.style.setProperty('--active-index', String(index + 1))
}

genresList.value = await apiGetAllGenres()
</script>

<template>

  <ul class="menu position-absolute flex flex-column z-10">
    <li class="menu__item w-100" v-if="genresList?.genres">
      <button class="menu__btn text-w500 w-100 text-left"
              type="button"
              :class="{'is-active': activeTagId === -1}"
              @click="handleTag(-1, -1)"
      >
        All
      </button>
    </li>
    <li v-for="(item, index) in genresList?.genres"
        :key="item.id"
        class="menu__item w-100"
    >
      <button class="menu__btn text-w500 w-100 text-left"
              type="button"
              :class="{'is-active': activeTagId === item.id}"
              @click="handleTag(item.id, index, item.name)"
      >
        {{item?.name}}
      </button>
    </li>
    <li class="menu__active active-index position-absolute" ref="menuActive"/>
  </ul>

</template>