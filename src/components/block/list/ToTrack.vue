<script setup lang="ts">
import {ref, watchEffect} from "vue";

import ButtonUi from "@ui/ButtonUi.vue";
import Icon from "@ui/Icon.vue";
import Tooltip from "@ui/Tooltip.vue";

import RadioIcon from "@icons/RadioIcon.vue";

import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();
import useCurrentTrackStore from "@store/music/useCurrentTrackStore.ts";
const currentTrackStore = useCurrentTrackStore();

const props = defineProps<{
  activeLiRef: HTMLLIElement | null
}>()

let observer: IntersectionObserver | null = null

const arrowVisible = ref<boolean>(false)

const initObserver = () => {
  if (!props.activeLiRef) return

  observer?.disconnect()
  observer = null

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      arrowVisible.value = !entry.isIntersecting
    })
  }, {root: props.activeLiRef?.parentElement})

  observer.observe(props.activeLiRef)
}

const scrollToActive = () => {
  props.activeLiRef?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watchEffect((onCleanup) => {
  if (currentTrackStore.track.id < 0 || searchStore.searchName) return

  initObserver()

  onCleanup(() => {
    observer?.disconnect()
    arrowVisible.value = false
  })
})
</script>

<template>

  <Transition name="fade-small">
    <Tooltip v-if="arrowVisible"
             class="!absolute left-[calc(100%_+_1rem)] top-4"
             position="right"
    >
      <template #activator>
        <ButtonUi class="button !rounded-full flex-center !p-0 !bg-dark-15 recolor-svg hover:!text-accent"
                  @click="scrollToActive"
                  type="button"
        >
          <Icon :name="RadioIcon" :size="20"/>
        </ButtonUi>
      </template>

      <template #default>
        К треку
      </template>
    </Tooltip>
  </Transition>

</template>