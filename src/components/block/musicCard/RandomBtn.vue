<script setup lang="ts">
import {ref, watch} from "vue";

import {MusicService} from "@api/music/MusicService.ts";

import {showError} from "@utils/modals.ts";

import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import RandomIcon from "@icons/RandomIcon.vue";

import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useGenresStore from "@store/useGenresStore.ts";
const genresStore = useGenresStore();

const isLoading = ref<boolean>(false)

const page = ref<number>(1)
const hasMore = ref<boolean>(true)
const loadedPages = ref<Set<number>>(new Set())

const handleIsRandom = async () => {
  controllersStore.isRandom = !controllersStore.isRandom
  localStorage.setItem('isRandom', JSON.stringify(controllersStore.isRandom))
}

const clearInfo = () => {
  musicStore.randomIds = []
  musicStore.randomIndex = 0
  musicStore.randomSeed = (Math.random() * 2) - 1
  page.value = 1
  loadedPages.value.clear()
}

const getRandomMusicIds = async (isClear: boolean = false) => {
  if (musicStore.activeTrack.id < 0 || !hasMore.value || loadedPages.value.has(page.value)) return

  if (isClear) clearInfo()

  try {
    isLoading.value = true

    const response = await MusicService.getRandomIds(
      page.value,
      21,
      musicStore.activeTrack.id,
      musicStore.randomSeed,
      searchStore.searchName,
      artistStore.currentArtist.id,
      genresStore.currentGenre.id,
    )

    if (response) {
      musicStore.randomIds.push(...response.data)
      hasMore.value = response.meta.hasMore
      loadedPages.value.add(page.value)
      page.value += 1
    }
  } catch (err: any) {
    await showError(
        'Не удалось загрузить список рандомных треков',
        err?.detail
    )
  } finally {
    isLoading.value = false
  }
}

watch(
    () => controllersStore.isRandom,
    (val) => {
      if (val) getRandomMusicIds(true)
    },
    {immediate: true}
)

watch(
    () => musicStore.randomIndex,
    (index) => {
      if (index >= musicStore.randomIds.length - 3) {
        getRandomMusicIds()
      }
    }
)

watch(
    () => musicStore.activeTrack.id,
    (id) => {
      if (id >= 0 && controllersStore.isRandom && musicStore.randomIds.length === 0) {
        getRandomMusicIds()
      }
    }
)
</script>

<template>

  <Tooltip>
    <template #activator>
      <button :class="[
                        'controllers__small-btn recolor-svg flex-center',
                        controllersStore.isRandom && 'bg-dark-15'
                    ]"
              :disabled="isLoading"
              @click="handleIsRandom"
              type="button"
      >
        <Icon :name="RandomIcon" :size="27"/>
      </button>
    </template>

    <template #default>
      Воспроизведение в случайном порядке
    </template>
  </Tooltip>

</template>