<script setup lang="ts">
import {computed, inject, Ref} from "vue";

import UploadUserAvatar from "@components/aside/UploadUserAvatar.vue";

import Tooltip from "@ui/Tooltip.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();

const isUserRedact = defineModel<boolean>('isUserRedact', {required: true})
const isAuth = defineModel<boolean>('isAuth', {required: true})

const isLoading = inject<Ref<boolean>>('isLoading')

const avatarTitle = computed(() => {
  return userStore.user.id >= 0 ? 'Редактировать профиль' : 'Войти/Зарегистрироваться'
})

const handleAvatar = () => {
  if (isLoading?.value) return

  if (userStore.user.id >= 0) {
    isUserRedact.value = !isUserRedact.value
  } else {
    isAuth.value = !isAuth.value
  }
}
</script>

<template>

  <Tooltip position="right"
           :hidden="isUserRedact || isAuth"
           class="z-[10000]"
  >
    <template #activator>
      <div :class="[
               'aside__avatar square-12.5 rounded-full relative cursor-pointer',
               isUserRedact && 'is-active'
           ]"
      >
        <div :class="[
                  'absolute rounded-full border border-dashed border-light scale-[1.02]',
                  isUserRedact && 'z-[10001]'
              ]"
             @click="handleAvatar"
        />

        <UploadUserAvatar/>
      </div>
    </template>

    <template #default>
      {{avatarTitle}}
    </template>
  </Tooltip>

</template>