<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

import {apiRedactUserName, apiRedactUserPassword} from "@api/user/user.ts";

import {showConfirm, showError} from "@utils/modals.ts";

import InputUi from "@ui/InputUi.vue";
import ButtonUi from "@ui/ButtonUi.vue";

import useUserStore from "@store/useUserStore.ts";
const userStore = useUserStore();
import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

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

    await showDetails(results, actions)
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

const showDetails = async (results:  PromiseSettledResult<void>[], actions: string[]) => {
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

  messageStore.show('Данные пользователя изменены!!')
}

onMounted(() => {
  name.value = userStore.user.name
})
</script>

<template>
  <div v-if="isUserRedact"
       class="user-redact bg-dark-15 left-102.5 top-50 rounded-big flex flex-column flex-between absolute z-[1000] py-5 pr-5 pl-60 w-150 h-60"
  >
    <InputUi v-model="name"
             class="w-full mb-7.5"
             title="Имя"
    />

    <InputUi v-model="password"
             class="w-full mb-7.5"
             title="Пароль"
    />

    <div class="flex gap-5">
      <ButtonUi class="grow"
                :is-disabled="!redactIsActive || !name.length"
                @click="handleRedact"
      >
        Редактировать
      </ButtonUi>

      <ButtonUi class="grow"
                @click="handleLogout"
                :is-disabled="isLoading"
      >
        Выйти
      </ButtonUi>
    </div>
  </div>
</template>