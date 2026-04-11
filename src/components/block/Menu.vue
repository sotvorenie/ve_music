<script setup lang="ts">
import {ref, watch} from "vue";

import { GenresList } from "../../types/genre";

import {apiGetAllGenres, apiGetGenresMusic, apiSearchGenresMusic} from "../../api/genre/genre.ts";
import {apiGetAllMusic, apiSearchMusic} from "../../api/music/music.ts";
import {apiGetHistory} from "../../api/history/history.ts";
import {apiGetAllLiked} from "../../api/like/like.ts";

import Modal from "../common/Modal.vue";

import MusicIcon from "../../assets/icons/MusicIcon.vue";
import HistoryIcon from "../../assets/icons/HistoryIcon.vue";
import LikeIcon from "../../assets/icons/LikeIcon.vue";

import useMenuStore from "../../store/useMenuStore.ts";
const menuStore = useMenuStore();
import useUserStore from "../../store/useUserStore.ts";
const userStore = useUserStore();
import useItemsStore from "../../store/useItemsStore.ts";
const itemsStore = useItemsStore();
import useAudioStore from "../../store/useAudioStore.ts";
const audioStore = useAudioStore();
import useSearchStore from "../../store/useSearchStore.ts";
const searchStore = useSearchStore();


const musicIndex = defineModel('musicIndex',{type: Number})

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

const handleGenre = async (id: number, index: number, genreName?: string) => {
  musicIndex.value = 0
  menuStore.activeGenreIndex = index + 1
  updateMenuBlock(index)

  menuStore.activeGenreId = id
  menuStore.activeGenreName = genreName || ''
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

const modalText = ref<string>('')
const indexErrorText = 'необходимо авторизоваться'
const allErrorsText = {
  [menuStore.allMenuModes.history]: `Для доступа к истории прослушиваний ${indexErrorText}`,
  [menuStore.allMenuModes.favorites]: `Для доступа к понравившимся трекам ${indexErrorText}`,
}
const handleErrorModal = (type: string, func: Function) => {
  modalText.value = allErrorsText[type]
  func()
}

watch(
    () => menuStore.activeGenreId,
    async (id: number) => {
      menuStore.listMode = menuStore.allListModes.music

      if (searchStore.searchName) {
        if (menuStore.activeGenreId < 0) {
          itemsStore.musicList = await apiSearchMusic(searchStore.searchName)
        } else {
          itemsStore.musicList = await apiSearchGenresMusic(searchStore.searchName, menuStore.activeGenreId)
        }
      } else {
        let data

        data = id >= 0 ? await apiGetGenresMusic(id) : await apiGetAllMusic()

        if (data) {
          itemsStore.musicList = data
          await audioStore.updateMusic()
        }
      }
    }
)

watch(
    () => menuStore.menuMode,
    async (newMode: string) => {
      if (newMode === menuStore.allMenuModes.genres) {
        if (searchStore.searchName) {
          if (menuStore.activeGenreId < 0) {
            itemsStore.musicList = await apiSearchMusic(searchStore.searchName)
          } else {
            itemsStore.musicList = await apiSearchGenresMusic(searchStore.searchName, menuStore.activeGenreId)
          }
        } else if (menuStore.activeGenreId >= 0) {
          itemsStore.musicList = await apiGetGenresMusic(menuStore.activeGenreId)
        } else {
          itemsStore.musicList = await apiGetAllMusic()
        }
      } else if (newMode === menuStore.allMenuModes.history) {
        itemsStore.musicList = await apiGetHistory()
      } else {
        itemsStore.musicList = await apiGetAllLiked()
      }

      await audioStore.updateMusic()
    }
)
</script>

<template>

  <Modal close-visible>
    <template #activator>

    </template>

    <template #default>
      {{modalText}}
    </template>
  </Modal>

  <div class="menu position-absolute z-10">
    <ul class="menu__list flex flex-column">
      <li v-for="(item, index) in menuList"
          :key="item.name"
          class="menu__item"
      >
        <Modal close-visible>
          <template #activator="{open}">
            <button class="menu__item-btn recolor-svg hover-color-accent flex flex-align-center w-100"
                    :class="{'is-active': activeTabIndex === index}"
                    type="button"
                    @click="userStore.user.id >= 0 ? handleTab(index) : handleErrorModal(item.value, open)"
            >
              <Component :is="item.icon"/>
              <span class="menu__name">{{item.name}}</span>
            </button>
          </template>

          <template #default>
            <p class="text-center">{{modalText}}</p>
          </template>
        </Modal>

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
                        :class="{'is-active': menuStore.activeGenreId === -1}"
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
                        :class="{'is-active': menuStore.activeGenreId === genreItem.id}"
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