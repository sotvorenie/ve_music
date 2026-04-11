<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

import InputUi from "../ui/InputUi.vue";
import ButtonUi from "../ui/ButtonUi.vue";

import useUserStore from "../../store/useUserStore.ts";
import {showConfirm, showError} from "../../utils/modals.ts";
import {apiRedactUserName} from "../../api/user/user.ts";
const userStore = useUserStore();

defineProps({
  isUserRedact: {
    type: Boolean,
    default: false,
  },
})

const isLoading = defineModel({type: Boolean, default: false})

const emits = defineEmits(['logout', 'updateName'])

const nameCopy = ref<string>('')

// активность кнопки "Редактировать"
const redactIsActive = computed(() => {
  return nameCopy.value !== userStore.user.name
})

// клик по кнопке "Выйти"
const handleLogout = async () => {
  const check = await showConfirm(
      'Выход из профиля',
      'Вы действительно хотите выйти?'
  )
  if (check) emits('logout')
}

// клик по кнопке "Редактировать"
const handleRedact = async () => {
  const check = await showConfirm(
      'Редактирование профиля',
      'Вы действительно хотите редактировать профиль?'
  )

  if (check) {
    try {
      isLoading.value = true

      const response = await apiRedactUserName(nameCopy.value)

      if (response.success) {
        userStore.user.name = nameCopy.value
        emits('updateName')
      }
    } catch (err) {
      console.error(err)

      await showError(
          'Ошибка редактирования профиля',
          'Не удалось редактировать профиль'
      )
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  nameCopy.value = userStore.user.name
})
</script>

<template>
  <div class="user-redact aside__block flex flex-column flex-between position-absolute z-1000" v-if="isUserRedact">
    <InputUi v-model="nameCopy"
             class="user-redact__name w-100"
             title="Имя"
    />

    <div class="user-redact__btn-bar flex">
      <ButtonUi :is-disabled="!redactIsActive || !nameCopy.length"
                :is-loading="isLoading"
                @click="handleRedact"
      >
        Редактировать
      </ButtonUi>
      <ButtonUi @click="handleLogout"
                :is-loading="isLoading"
      >
        Выйти
      </ButtonUi>
    </div>
  </div>
</template>