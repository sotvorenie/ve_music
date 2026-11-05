<script setup lang="ts">
import {onBeforeMount, ref} from "vue";

import {UserRoles} from "@/types/user.ts";

import {getMe} from "@utils/auth.ts";

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

import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();
import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const visible = ref(false)

const handleContextMenu = (e: MouseEvent) => {
  if (userStore.user.role !== UserRoles.ADMIN) e.preventDefault()
}

const setLastTrack = () => {
  const saved = localStorage.getItem('last-track')
  const trackId = saved ? Number(saved) : null
  if (trackId) musicStore.updateMusic(trackId)
}

onBeforeMount(async () => {
  await getMe()
  setLastTrack()
  visible.value = true
})
</script>

<template>

  <Transition name="fade">
    <div v-if="visible"
         class="music fixed inset-0"
         @contextmenu="handleContextMenu"
    >
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

      <div class="music__card absolute z-10 bottom-10 3xl:bottom-15 right-0 backdrop-blur-[2px] rounded-big p-6 w-[55vw]">
        <Info/>

        <Timeline/>

        <Controllers/>
      </div>
    </div>
  </Transition>

</template>