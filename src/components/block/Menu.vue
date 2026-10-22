<script setup lang="ts">
import {ref, watch} from "vue";

import {apiGetAllGenres} from "@api/genre/genre.ts";

import Modal from "@ui/Modal.vue";

import MusicIcon from "@/components/icons/MusicIcon.vue";
import HistoryIcon from "@/components/icons/HistoryIcon.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";

import useMenuStore from "@store/useMenuStore.ts";
const menuStore = useMenuStore();
import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useGenreStore from "@store/useGenreStore.ts";
const genreStore = useGenreStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();


const musicIndex = defineModel('musicIndex',{type: Number})

const menuList = [
  {
    name: 'Жанры',
    value: 'genres',
    icon: MusicIcon,
  },
  {
    name: 'История',
    value: 'history',
    icon: HistoryIcon,
  },
  {
    name: 'Избранное',
    value: 'favorites',
    icon: LikeIcon,
  },
]

const activeTabIndex = ref<number>(0)

const modalText = ref<string>('')
const indexErrorText = 'необходимо авторизоваться'
const allErrorsText: Record<string, string> = {
  history: `Для доступа к истории прослушиваний ${indexErrorText}`,
  favorites: `Для доступа к понравившимся трекам ${indexErrorText}`,
}

const handleGenre = async (id: number, genreName?: string) => {
  musicIndex.value = 0

  genreStore.currentGenre.id = id
  genreStore.currentGenre.name = genreName || ''
}

const handleTab = (index: number) => {
  activeTabIndex.value = index
  menuStore.menuMode = menuList[index].value as 'genres' | 'history' | 'favorites'
}

const getGenres = async () => {
  try {
    const response = await apiGetAllGenres()
    genreStore.genres = [{id: -1, name: 'All'}, ...response.genres]
  } catch {}
}

await getGenres()

const handleErrorModal = (type: string, func: Function) => {
  modalText.value = allErrorsText[type]
  func()
}

watch(
    () => [genreStore.currentGenre.id, menuStore.menuMode],
    () => {
      if (genreStore.currentGenre.id >= -1) {
        menuStore.listMode = 'music'
        artistStore.currentArtist.id = -1
        musicStore.getMusic()
      }
    }
)
</script>

<template>

  <Modal close-visible>
    <template #default>
      {{modalText}}
    </template>
  </Modal>

  <div v-if="genreStore.genres.length"
       class="menu abs-y z-10"
  >
    <ul class="flex flex-col">
      <li v-for="(item, index) in menuList"
          :key="item.name"
          class="menu__item"
      >
        <Modal close-visible>
          <template #activator="{open}">
            <button :class="[
                        'menu__item-btn recolor-svg flex items-center w-full rounded-regular gap-2.5 hover:bg-dark-alt/75',
                        activeTabIndex === index && 'pointer-events-none bg-dark-15',
                    ]"
                    @click="userStore.isLogged ? handleTab(index) : handleErrorModal(item.value, open)"
                    type="button"
            >
              <Component :is="item.icon" class="w-7 3xl:w-10 h-auto"/>
              <span class="menu__name">{{item.name}}</span>
            </button>
          </template>

          <template #default>
            <p class="text-center">{{modalText}}</p>
          </template>
        </Modal>

        <div :class="[
                 'menu__wrapper overflow-hidden grid',
                 activeTabIndex === 0 ? 'is-active grid-rows-[1fr]' : 'grid-rows-[0fr]'
             ]"
        >
          <div class="menu__wrapper-inner min-h-0 opacity-0">
            <ul :class="[
                    'flex flex-col relative bg-[color-mix(in_srgb,_var(--dark-15),_transparent_25%)] rounded-regular ml-5 mt-2.5 max-h-[50vh] overflow-y-auto',
                    index > 0 && 'hidden'
                ]"
            >
              <li v-for="genreItem in genreStore.genres"
                  :key="genreItem.id"
                  class="menu__item w-full z-1"
              >
                <button :class="[
                            'menu__btn font-medium w-full text-left rounded-regular transition-[backdrop-filter] hover:backdrop-brightness-[.88]',
                            genreStore.currentGenre.id === genreItem.id && 'pointer-events-none backdrop-brightness-[.8]',
                        ]"
                        @click="handleGenre(genreItem.id, genreItem.name)"
                        type="button"
                >
                  {{genreItem?.name}}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>