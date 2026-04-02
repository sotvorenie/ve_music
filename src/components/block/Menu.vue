<script setup lang="ts">
import {ref} from "vue";

import { GenresList } from "../../types/genre";

import {apiGetAllGenres} from "../../api/genre/genre.ts";

import MusicIcon from "../../assets/icons/MusicIcon.vue";
import HistoryIcon from "../../assets/icons/HistoryIcon.vue";
import LikeIcon from "../../assets/icons/LikeIcon.vue";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();


const musicIndex = defineModel('musicIndex',{type: Number})

const emits = defineEmits(['updateTag'])

const activeGenreId = ref<number>(0)

const menuActive = ref<HTMLLIElement[]>([])

const genresList = ref<GenresList>()

const menuList = ref([
  {
    name: 'Жанры',
    value: menuStore.allMenuModes.genres,
    icon: MusicIcon,
  },
  {
    name: 'История',
    value: menuStore.allMenuModes.history,
    icon: HistoryIcon,
  },
  {
    name: 'Избранное',
    value: menuStore.allMenuModes.favorites,
    icon: LikeIcon,
  },
])

const activeTabIndex = ref<number>(0)

const handleGenre = (id: number, index: number, genreName?: string) => {
  activeGenreId.value = id
  musicIndex.value = 0
  menuStore.activeGenreIndex = index + 1
  updateMenuBlock(index)

  if (id >= 0) {
    menuStore.activeGenreName = genreName || ''
    emits('updateTag')
  }
}

const updateMenuBlock = (index: number) => {
  const el = menuActive.value[0]
  if (!el) return

  el.style.setProperty('--active-index', String(index + 1))
}

const handleTab = (index: number) => {
  activeTabIndex.value = index
  menuStore.menuMode = menuList.value[index].value
}

genresList.value = await apiGetAllGenres()
</script>

<template>

  <div class="menu position-absolute z-10">
    <ul class="menu__list flex flex-column">
      <li v-for="(item, index) in menuList"
          :key="item.name"
          class="menu__item"
      >
        <button class="menu__item-btn recolor-svg hover-color-accent flex flex-align-center w-100"
                :class="{'is-active': activeTabIndex === index}"
                type="button"
                @click="handleTab(index)"
        >
          <Component :is="item.icon"/>
          <span class="menu__name">{{item.name}}</span>
        </button>

        <div class="menu__wrapper overflow-hidden"
             :class="{'is-active': activeTabIndex === 0}"
        >
          <div class="menu__wrapper-inner">
            <ul class="menu__genres flex flex-column position-relative"
                :class="{'visually-hidden': index > 0}"
            >
              <li class="menu__genre w-100 z-1" v-if="genresList?.genres">
                <button class="menu__btn text-w500 w-100 text-left"
                        type="button"
                        :class="{'is-active': activeGenreId === -1}"
                        @click="handleGenre(-1, -1)"
                >
                  All
                </button>
              </li>
              <li v-for="(genreItem, genreIndex) in genresList?.genres"
                  :key="genreItem.id"
                  class="menu__item w-100 z-1"
              >
                <button class="menu__btn text-w500 w-100 text-left"
                        type="button"
                        :class="{'is-active': activeGenreId === genreItem.id}"
                        @click="handleGenre(genreItem.id, genreIndex, genreItem.name)"
                >
                  {{genreItem?.name}}
                </button>
              </li>
              <li class="menu__active active-index position-absolute z-0" ref="menuActive"/>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>