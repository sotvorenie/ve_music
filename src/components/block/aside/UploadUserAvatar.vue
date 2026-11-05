<script setup lang="ts">
import {inject, Ref, ref} from "vue";

import {BASE_URL} from "@api/url.ts";
import {UserService} from "@api/user/UserService.ts";

import {showConfirm, showError} from "@utils/modals.ts";

import Icon from "@ui/Icon.vue";
import Modal from "@ui/Modal.vue";
import Upload from "@ui/Upload.vue";
import ImageCropper from "@ui/ImageCropper.vue";

import FoxIcon from "@icons/FoxIcon.vue";
import EditIcon from "@icons/EditIcon.vue";
import CrossIcon from "@icons/CrossIcon.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const isLoading = inject<Ref<boolean>>('isLoading')
const isUserRedact = inject<Ref<boolean>>('isUserRedact')

const avatarFile = ref<File | null>(null)

const isCropperModalVisible = ref<boolean>(false)

const loadedAvatarFile = (files: File[] | File | null) => {
  if (!files) return
  const loadedFile: File = Array.isArray(files) ? files[0] : files

  if (loadedFile?.type === 'image/gif') {
    handleUploadAvatar(loadedFile)
  } else {
    isCropperModalVisible.value = true
  }
}

const handleUploadAvatar = async (newFile: File) => {
  const confirm = await showConfirm(
      'Загрузка аватарки',
      'Вы действительно хотите загрузить аватар?'
  )
  if (confirm) await uploadAvatar(newFile)
}

const uploadAvatar = async (newFile: File) => {
  if (!avatarFile.value) return

  try {
    if (isLoading) isLoading.value = true

    const response = await UserService.uploadAvatar(newFile)
    userStore.user.avatarUrl = response.url
    messageStore.show('Аватарка обновлена!!')
    clearAvatarData()
  } catch (err: any) {
    await showError(
        'Ошибка загрузки фото',
        err?.detail ?? 'Не удалось загрузить аватар..'
    )
  } finally {
    if (isLoading) isLoading.value = false
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
    if (isLoading) isLoading.value = true

    await UserService.deleteAvatar()
    userStore.user.avatarUrl = ''
  } catch {
    await showError(
        'Ошибка удаления аватарки',
        'Не удалось удалить аватарку'
    )
  } finally {
    if (isLoading) isLoading.value = false
  }
}

const clearAvatarData = () => {
  isCropperModalVisible.value = false
  avatarFile.value = null
}
</script>

<template>

  <Upload v-model="avatarFile"
          :class="[
                    'h-full',
                    isLoading || !isUserRedact && 'pointer-events-none'
                ]"
          :disabled="isLoading || !isUserRedact"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          @update:model-value="loadedAvatarFile"
  >
    <div :class="[
                  'img-container relative rounded-medium h-full group',
                  !userStore.user.avatarUrl && '!bg-transparent'
               ]"
         title="Загрузить фото"
    >
      <div class="absolute inset-0 bg-[rgba(0,0,0,.4)] transition-opacity opacity-0 hover:opacity-100 duration-300"/>

      <img v-if="userStore.user.avatarUrl"
           :src="`${BASE_URL}${userStore.user.avatarUrl}?t=${Date.now()}`"
           alt="фото"
      >

      <Icon v-else
            :name="FoxIcon"
            :size="30"
      />

      <Icon :name="EditIcon"
            :size="12"
            recolor
            class="abs-center z-1 transition-opacity opacity-0 group-hover:opacity-100"
      />

      <button v-if="userStore.user.avatarUrl && isUserRedact"
              class="recolor-svg flex-center transition-opacity opacity-0 z-10 absolute rounded-full top-[1px] right-[1px] group-hover:opacity-100 hover:text-accent"
              :disabled="isLoading || !isUserRedact"
              @click.stop="handleDeleteAvatar"
              type="button"
              title="Удалить"
      >
        <Icon :name="CrossIcon" :size="6"/>
      </button>
    </div>
  </Upload>

  <Modal v-model="isCropperModalVisible"
         :size="550"
  >
    <template #default>
      <ImageCropper :file="avatarFile"
                    @cropped="handleUploadAvatar"
                    @cancel="clearAvatarData"
      />
    </template>
  </Modal>

</template>