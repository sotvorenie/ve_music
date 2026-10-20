<script setup lang="ts">
import SettingsControllers from "@components/musicCard/SettingsControllers.vue";
import TrackControllers from "@components/musicCard/TrackControllers.vue";
import ModesControllers from "@components/musicCard/ModesControllers.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();
</script>

<template>

  <div class="controllers grid grid-cols-[1fr_auto_1fr] items-center">
    <SettingsControllers/>

    <TrackControllers/>

    <ModesControllers v-if="audioStore.activeTrack.id >= 0"/>
  </div>

</template>