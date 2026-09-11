<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

import {apiRedactUserName, apiRedactUserPassword} from "@api/user/user.ts";

import {showConfirm, showError} from "@utils/modals.ts";

import InputUi from "@ui/InputUi.vue";
import ButtonUi from "@ui/ButtonUi.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();

withDefaults(
    defineProps<{
      isUserRedact?: boolean
    }>(), {
      isUserRedact: false,
    }
)

const isLoading = defineModel<boolean>({default: false})

const emits = defineEmits<{
  logout: [],
  update: [],
}>()

const name = ref<string>('')
const password = ref<string>('')

// активность кнопки "Редактировать"
const redactIsActive = computed(() => {
  return name.value !== userStore.user.name || password.value.length >= 4
})

// клик по кнопке "Выйти"
const handleLogout = async () => {
  const confirm = await showConfirm(
      'Выход из профиля',
      'Вы действительно хотите выйти?'
  )
  if (confirm) emits('logout')
}

// клик по кнопке "Редактировать"
const handleRedact = async () => {
  const confirm = await showConfirm(
      'Редактирование профиля',
      'Вы действительно хотите редактировать профиль?'
  )
  if (confirm) await redactUser()
}

const redactUser = async () => {
  try {
    isLoading.value = true

    const promises = []
    const actions: string[] = []

    if (name.value !== userStore.user.name) {
      promises.push(apiRedactUserName(name.value))
      actions.push('name')
    }
    if (password.value.length >= 4) {
      promises.push(apiRedactUserPassword(password.value))
      actions.push('password')
    }

    if (promises.length === 0) return

    const results = await Promise.allSettled(promises)

    let hasError = false
    let errorMessage = ''

    results.forEach((result, index) => {
      const actionType = actions[index]

      if (result.status === 'fulfilled') {
        if (actionType === 'name') userStore.user.name = name.value
      } else {
        hasError = true
        errorMessage = actionType === 'password' ? result.reason?.detail : 'Не удалось обновить имя'
      }
    })

    if (hasError) await showError('Ошибка редактирования профиля', errorMessage)

    emits('update')
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

onMounted(() => {
  name.value = userStore.user.name
})
</script>

<template>
  <div class="user-redact aside__block flex flex-column flex-between position-absolute z-1000" v-if="isUserRedact">
    <InputUi v-model="name"
             class="user-redact__name w-100"
             title="Имя"
    />

    <InputUi v-model="password"
             class="user-redact__password w-100"
             title="Пароль"
    />

    <div class="user-redact__btn-bar flex">
      <ButtonUi :is-disabled="!redactIsActive || !name.length"
                @click="handleRedact"
      >
        Редактировать
      </ButtonUi>
      <ButtonUi @click="handleLogout"
                :is-disabled="isLoading"
      >
        Выйти
      </ButtonUi>
    </div>
  </div>
</template>