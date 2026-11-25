<script setup lang="ts">
import {ref, watch} from "vue";

import {isCanceledErr} from "@/api";
import {MusicService} from "@api/music/MusicService.ts";

import {useAbortableRequest} from "@composables/useAbortableRequest.ts";

import Tooltip from "@ui/Tooltip.vue";
import Icon from "@ui/Icon.vue";

import RandomIcon from "@icons/RandomIcon.vue";

import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore();
import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useArtistsStore from "@store/useArtistsStore.ts";
const artistStore = useArtistsStore();
import useGenresStore from "@store/useGenresStore.ts";
const genresStore = useGenresStore();
import useRandomStore from "@store/music/useRandomStore.ts";
const randomStore = useRandomStore();
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
const currentTrackStore = useCurrentTrackStore();

const {nextSignal, isCurrent} = useAbortableRequest()

const isLoading = ref<boolean>(false)

const page = ref<number>(1)
const hasMore = ref<boolean>(true)
const loadedPages = ref<Set<number>>(new Set())

const handleIsRandom = () => {
  controllersStore.isRandom = !controllersStore.isRandom
  localStorage.setItem('isRandom', JSON.stringify(controllersStore.isRandom))
}

const clearInfo = () => {
  randomStore.randomIds = []
  randomStore.randomIndex = 0
  randomStore.randomSeed = (Math.random() * 2) - 1
  page.value = 1
  loadedPages.value.clear()
}

const getRandomMusicIds = async (isClear: boolean = false) => {
  if (currentTrackStore.track.id < 0 || !hasMore.value || loadedPages.value.has(page.value)) return

  if (isClear) clearInfo()

  const signal = nextSignal()
  isLoading.value = true

  try {
    const response = await MusicService.getRandomIds(
      page.value,
      21,
      currentTrackStore.track.id,
      randomStore.randomSeed,
      searchStore.searchName,
      artistStore.currentArtist.id,
      genresStore.currentGenre.id,
      signal,
    )

    randomStore.randomIds.push(...response.data)
    hasMore.value = response.meta.hasMore
    loadedPages.value.add(page.value)
    page.value += 1
  } catch (err: unknown) {
    if (isCanceledErr(err)) return
  } finally {
    if (isCurrent(signal)) {
      isLoading.value = false
    }
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
    () => randomStore.randomIndex,
    (index) => {
      if (index >= randomStore.randomIds.length - 3) {
        getRandomMusicIds()
      }
    }
)

watch(
    () => currentTrackStore.track.id,
    (id) => {
      if (id >= 0 && controllersStore.isRandom && !randomStore.randomIds.length) {
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