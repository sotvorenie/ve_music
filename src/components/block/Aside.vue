<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {apiDeleteUserAvatar, apiUploadUserAvatar} from "@api/user/user.ts";

import {logout} from "@utils/auth.ts";
import {showConfirm, showError} from "@utils/modals.ts";

import UserRedact from "@components/UserRedact.vue";
import Auth from "@components/Auth.vue";
import Tooltip from "@ui/Tooltip.vue";

import MenuIcon from "@/components/icons/MenuIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";

import ImgUpload from "@ui/ImgUpload.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const isOpen = ref<boolean>(false)

const isUserRedact = ref<boolean>(false)
const isAuth = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const closeAside = () => {
  if (isLoading.value) return

  if (isUserRedact.value || isAuth.value) {
    isUserRedact.value = false
    isAuth.value = false
  } else {
    isOpen.value = false
  }
}

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

const successAuth = (messageText: string) => {
  isAuth.value = false
  messageStore.show(messageText)
}

const successLogout = () => {
  logout()
  messageStore.show('До новых встреч!!)')
}

const updateAvatar = async (file: File) => {
  try {
    isLoading.value = true

    const response = await apiUploadUserAvatar(file)
    if (response) {
      userStore.user.avatarUrl = response.url
      messageStore.show('Аватарка обновлена!!')
    }
  } catch (err) {
    console.error(err)
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
  } catch (err) {
    console.error(err)
    await showError(
        'Ошибка удаления аватарки',
        'Не удалось удалить аватарку'
    )
  } finally {
    isLoading.value = false
  }
}

const updateUserData = () => {
  messageStore.show('Данные пользователя изменены!!')
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAside()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
</script>

<template>

  <button class="aside__open recolor-svg position-absolute hover-color-accent z-10"
          type="button"
          title="Открыть боковое меню"
          @click="isOpen = true"
  >
    <MenuIcon/>
  </button>

  <Transition name="fade">
    <div class="aside__background position-absolute z-1000"
         v-if="isOpen"
         @click="closeAside"
    />
  </Transition>

  <Transition name="aside">
    <div class="aside__content position-absolute z-10000"
         @click.stop
         v-if="isOpen"
    >
      <ul class="aside__list flex flex-column">
        <li class="aside__item">
          <Tooltip position="right">
            <template #activator>
              <button class="aside__btn recolor-svg hover-color-accent"
                      type="button"
                      @click="closeAside"
                      :disabled="isUserRedact || isAuth"
              >
                <CrossIcon/>
              </button>
            </template>
            <template #default>Закрыть меню</template>
          </Tooltip>
        </li>
        <li class="aside__item">
          <Tooltip position="right"
                   :hidden="isUserRedact"
          >
            <template #activator>
              <div class="aside__avatar aside__btn position-relative cursor-pointer"
                   :class="{'is-active': isUserRedact}"
              >
                <div class="border position-absolute"
                     :class="isUserRedact && 'is-active'"
                     @click="handleAvatar"
                />

                <ImgUpload :img-url="userStore.user.avatarUrl"
                           :disabled="isLoading || !isUserRedact"
                           :can-delete="isUserRedact"
                           @select="(file: File) => updateAvatar(file)"
                           @delete="handleDeleteAvatar"
                           class="aside__upload position-absolute z-10000"
                           :class="isUserRedact && 'is-active'"
                           @click.stop
                />
              </div>
            </template>
            <template #default>{{avatarTitle}}</template>
          </Tooltip>
        </li>
      </ul>

      <Transition name="list">
        <UserRedact v-if="isUserRedact"
                    :is-user-redact="isUserRedact"
                    v-model="isLoading"
                    @logout="successLogout"
                    @update="updateUserData"
        />
      </Transition>

      <Transition name="list">
        <Auth v-if="isAuth" @success-auth="successAuth"/>
      </Transition>
    </div>
  </Transition>

</template>