<script setup lang="ts">
import {computed, inject, Ref, ref} from "vue";

import {UserService} from "@api/user/UserService.ts";

import {showConfirm, showError} from "@utils/modals.ts";
import {setToken} from "@utils/auth.ts";

import InputUi from "@ui/InputUi.vue";
import Modal from "@ui/Modal.vue";
import ButtonUi from "@ui/ButtonUi.vue";

import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const newPassword = ref<string>('')
const oldPassword = ref<string>('')

const isLoading = ref<boolean>(false)

const isUserRedactPassword = inject<Ref<boolean>>('isUserRedactPassword')

const redactIsActive = computed(() => {
      return newPassword.value.length >= 4 && newPassword.value !== oldPassword.value
})

const handleUpdatePassword = async () => {
  const confirm = await showConfirm(
      'Редактирование профиля',
      'Вы действительно хотите редактировать профиль?'
  )
  if (confirm) await updatePassword()
}

const updatePassword = async () => {
  try {
    isLoading.value = true

    const response = await UserService.updatePassword(newPassword.value, oldPassword.value)

    success(response.token)
  } catch (err: any) {
    await showError(
        'Ошибка редактирования профиля',
        err?.detail ?? 'Не удалось редактировать пароль пользователя'
    )
  } finally {
    isLoading.value = false
  }
}

const success = (token: string) => {
  clearAndClose()
  messageStore.show('Пароль пользователя изменен!!')
  setToken(token)
}

const clearAndClose = () => {
  if (isUserRedactPassword?.value) isUserRedactPassword.value = false
  newPassword.value = ''
  oldPassword.value = ''
}
</script>

<template>

  <Modal v-model="isUserRedactPassword"
         :is-closable="!isLoading"
  >
    <template #activator="{open}">
      <ButtonUi @click="open">Сменить пароль</ButtonUi>
    </template>

    <template #default>
      <div class="flex flex-col gap-8">
        <p class="text-center font-semibold">Смена пароля</p>

        <InputUi v-model="newPassword"
                 title="Новый пароль"
        />

        <InputUi v-model="oldPassword"
                 title="Старый пароль"
        />

        <div class="grid grid-cols-2 gap-2">
          <ButtonUi class="grow"
                    @click="clearAndClose"
          >
            Отмена
          </ButtonUi>

          <ButtonUi class="grow"
                    @click="handleUpdatePassword"
                    :is-disabled="!redactIsActive"
                    :is-loading="isLoading"
          >
            Редактировать
          </ButtonUi>
        </div>
      </div>
    </template>
  </Modal>

</template>