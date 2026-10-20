<script setup lang="ts">
import {computed} from "vue";

import {apiDeleteUserAvatar, apiUploadUserAvatar} from "@api/user/user.ts";

import {showConfirm, showError} from "@utils/modals.ts";

import Tooltip from "@ui/Tooltip.vue";
import ImgUpload from "@ui/ImgUpload.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const isLoading = defineModel<boolean>('isLoading', {required: true})
const isUserRedact = defineModel<boolean>('isUserRedact', {required: true})
const isAuth = defineModel<boolean>('isAuth', {required: true})

// title у блока аватарки перед открытием
const avatarTitle = computed(() => {
  if (!isUserRedact.value && !isAuth.value) {
    return userStore.user.id >= 0 ? 'Редактировать профиль' : 'Войти/Зарегистрироваться'
  }
  return ''
})

// клик по аватарке
const handleAvatar = () => {
  if (isLoading.value) return

  if (userStore.user.id >= 0) {
    isUserRedact.value = !isUserRedact.value
  } else {
    isAuth.value = !isAuth.value
  }
}

const updateAvatar = async (file: File) => {
  try {
    isLoading.value = true

    const response = await apiUploadUserAvatar(file)
    if (response) {
      userStore.user.avatarUrl = response.url
      messageStore.show('Аватарка обновлена!!')
    }
  } catch {
    await showError(
        'Ошибка загрузки фото',
        'Не удалось загрузить аватар..'
    )
  } finally {
    isLoading.value = false
  }
}

const handleDeleteAvatar = async () => {
  const confirm = await showConfirm(
      'Удаление аватарки пользователя',
      'Вы действительно хотите удалить аватарку?'
  )
  if (confirm) await deleteAvatar()
}

const deleteAvatar = async () => {
  try {
    isLoading.value = true

    await apiDeleteUserAvatar()
    userStore.user.avatarUrl = ''
  } catch {
    await showError(
        'Ошибка удаления аватарки',
        'Не удалось удалить аватарку'
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<template>

  <Tooltip position="right"
           :hidden="isUserRedact || isAuth"
  >
    <template #activator>
      <div :class="[
               'aside__avatar aside__btn square-12.5 rounded-full relative cursor-pointer',
               isUserRedact && 'is-active'
           ]"
      >
        <div :class="[
                  'absolute rounded-full border border-dashed border-light scale-[1.02]',
                  isUserRedact && 'z-[10001]'
              ]"
             @click="handleAvatar"
        />

        <ImgUpload :class="[
                       'absolute z-[10000] rounded-full',
                       isUserRedact && 'is-active'
                   ]"
                   :img-url="userStore.user.avatarUrl"
                   :disabled="isLoading || !isUserRedact"
                   :can-delete="isUserRedact"
                   @click.stop
                   @select="(file: File) => updateAvatar(file)"
                   @delete="handleDeleteAvatar"
        />
      </div>
    </template>

    <template #default>
      {{avatarTitle}}
    </template>
  </Tooltip>

</template>