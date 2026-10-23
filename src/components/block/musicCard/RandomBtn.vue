<script setup lang="ts">
import {ref, watch} from "vue";

import {apiGetRandomMusic} from "@api/music/music.ts";

import {showError} from "@utils/modals.ts";

import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import RandomIcon from "@icons/RandomIcon.vue";

import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistStore from "@store/useArtistStore.ts";
const artistStore = useArtistStore();
import useGenreStore from "@store/useGenreStore.ts";
const genreStore = useGenreStore();

const isLoading = ref<boolean>(false)

const page = ref<number>(1)
const hasMore = ref<boolean>(true)
const loadedPages = ref<Set<number>>(new Set())

const handleIsRandom = async () => {
  controllersStore.isRandom = !controllersStore.isRandom
  localStorage.setItem('isRandom', JSON.stringify(controllersStore.isRandom))
}

const getRandomMusicIds = async (p: number = 1) => {
  if (audioStore.activeTrack.id < 0 || !hasMore.value || loadedPages.value.has(p)) return

  try {
    isLoading.value = true

    const response = await apiGetRandomMusic(
      p,
        21,
        audioStore.activeTrack.id,
        musicStore.randomSeed,
        searchStore.searchName,
        artistStore.currentArtist.id,
        genreStore.currentGenre.id,
    )

    if (response) {
      musicStore.randomIds.push(...response.ids)
      hasMore.value = response.hasMore
      page.value = p + 1
      loadedPages.value.add(p)
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
      musicStore.randomIds = []
      musicStore.randomIndex = 0
      musicStore.randomSeed = (Math.random() * 2) - 1
      page.value = 1
      loadedPages.value.clear()

      if (val) getRandomMusicIds()
    },
    {immediate: true}
)

watch(
    () => musicStore.randomIndex,
    (index) => {
      if (index >= musicStore.randomIds.length - 3) {
        getRandomMusicIds(page.value)
      }
    }
)

watch(
    () => audioStore.activeTrack.id,
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