<script setup lang="ts">
import {computed, ref} from "vue";

import {getErrMessage, isCanceledErr} from "@/api";
import {UserService} from "@api/user/UserService.ts";

import {useAbortableRequest} from "@composables/useAbortableRequest.ts";
import {showConfirm, showError} from "@utils/modals.ts";

import UpdatePassword from "@components/user/UpdatePassword.vue";

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

const {nextSignal, isCurrent} = useAbortableRequest()

const isLoading = defineModel<boolean>({default: false})

const emits = defineEmits<{
  logout: [],
}>()

const name = ref<string>(userStore.user.name)

const redactIsActive = computed(() => {
  return name.value !== userStore.user.name || !name.value.length
})

const handleLogOut = async () => {
  const confirm = await showConfirm(
      'Выход из профиля',
      'Вы действительно хотите выйти?'
  )
  if (confirm) emits('logout')
}

const handleUpdateName = async () => {
  const confirm = await showConfirm(
      'Редактирование профиля',
      'Вы действительно хотите редактировать профиль?'
  )
  if (confirm) await updateName()
}

const updateName = async () => {
  const signal = nextSignal()
  isLoading.value = true

  try {
    await UserService.updateName(name.value, signal)
    success()
  } catch (err: unknown) {
    if (isCanceledErr(err)) return
    await showError(
        'Ошибка редактирования профиля',
        getErrMessage(err, 'Не удалось редактировать имя пользователя')
    )
  } finally {
    if (isCurrent(signal)) {
      isLoading.value = false
    }
  }
}

const success = () => {
  userStore.user.name = name.value
  messageStore.show('Имя пользователя изменено!!')
}
</script>

<template>
  <div v-if="isUserRedact"
       class="user-redact bg-dark-15 left-102.5 top-50 rounded-big flex flex-col gap-7.5 absolute z-[1000] py-5 pr-5 pl-60 w-150 h-60"
  >
    <InputUi v-model="name"
             title="Имя"
    />

    <div class="flex flex-col gap-3">
      <UpdatePassword/>

      <div class="grid grid-cols-2 gap-2">
        <ButtonUi class="grow"
                  :is-disabled="!redactIsActive"
                  :is-loading="isLoading"
                  @click="handleUpdateName"
        >
          Редактировать
        </ButtonUi>

        <ButtonUi class="grow"
                  @click="handleLogOut"
                  :is-disabled="isLoading"
        >
          Выйти
        </ButtonUi>
      </div>
    </div>
  </div>
</template>