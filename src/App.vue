<script setup lang="ts">
import {onBeforeMount, ref} from "vue";

import {checkMe} from "@utils/auth.ts";

import Menu from "@components/Menu.vue";
import Info from "@components/musicCard/Info.vue";
import Timeline from "@components/musicCard/Timeline.vue";
import Controllers from "@components/musicCard/Controllers.vue";
import List from "@components/list/List.vue";
import Aside from "@components/aside/Aside.vue";
import Preview from "@components/musicCard/Preview.vue";
import Search from "@components/Search.vue";

import GenresSkeleton from "@ui/skeletons/GenresSkeleton.vue";
import MusicListSkeleton from "@ui/skeletons/MusicListSkeleton.vue";
import Vignette from "@ui/Vignette.vue";
import TopMessage from "@ui/TopMessage.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const visible = ref(false)

onBeforeMount(async () => {
  await checkMe()
  visible.value = true
})
</script>

<template>

  <Transition name="fade">
    <div class="music fixed inset-0" v-if="visible">
      <TopMessage v-model="messageStore.isVisible"/>

      <Vignette/>

      <Aside/>

      <Search/>

      <Suspense>
        <template #default>
          <Menu/>
        </template>
        <template #fallback>
          <GenresSkeleton/>
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <List/>
        </template>
        <template #fallback>
          <MusicListSkeleton/>
        </template>
      </Suspense>

      <Preview/>

      <div class="music__card absolute z-10 bottom-15 right-0 backdrop-blur-[2px] rounded-big p-6 w-[50vw] 3xl:w-[55vw]">
        <Info v-if="audioStore.activeTrack.id >= 0"/>

        <Timeline/>

        <Controllers/>
      </div>
    </div>
  </Transition>

</template>