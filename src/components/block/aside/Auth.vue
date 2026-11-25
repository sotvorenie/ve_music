<script setup lang="ts">
import {ref} from "vue";

import {AuthPayload} from "@/types/auth.ts";
import {UserWithToken} from "@/types/user.ts";
import {IsLiked} from "@/types/like.ts";

import {AuthService} from "@api/auth/AuthService.ts";
import {LikeService} from "@api/like/LikeService.ts";

import {onBlur, onInput, onSubmit} from "@composables/useFormValidate.ts";
import {useAbortableRequest} from "@composables/useAbortableRequest.ts";
import {logIn} from "@utils/auth.ts";
import {showError} from "@utils/modals.ts";

import InputUi from "@ui/InputUi.vue";
import ButtonUi from "@ui/ButtonUi.vue";

import useMusicStore from "@store/useMusicStore.ts";
const musicStore = useMusicStore();

const emits = defineEmits<{
  success: [message: string]
}>()

const {nextSignal, isCurrent, abort} = useAbortableRequest()

const isLogin = ref<boolean>(true)

const isLoading = ref<boolean>(false)

const form = ref<AuthPayload>({
  login: '',
  password: '',
  name: '',
})

const handleSubmit = async (e: Event) => {
  if (onSubmit(e)) {
    const signal = nextSignal()

    try {
      isLoading.value = true

      const response = isLogin.value
          ? await AuthService.auth(form.value.login, form.value.password, signal)
          : await AuthService.registration(form.value.login, form.value.password, form.value.name, signal)

      void success(response)
    } catch (err: any) {
      if (err.isCanceled) return

      await showError(
          'Ошибка авторизации',
          err?.detail
      )
    } finally {
      if (isCurrent(signal)) {
        isLoading.value = false
      }
    }
  }
}

const success = async (response: UserWithToken) => {
  try {
    const message = isLogin.value
        ? `Добро пожаловать, ${response.user.name} :)`
        : 'Пользователь успешно зарегистрирован!!'

    logIn(response)
    emits('success', message)

    if (musicStore.activeTrack.id >= 0) await checkLike()
  } catch {}
}

const checkLike = async () => {
  try {
    const response: IsLiked = await LikeService.checkLike(musicStore.activeTrack.id)
    musicStore.activeTrack.isLiked = response.isLiked ?? false
  } catch {}
}

const handleTab = (isLoginValue: boolean) => {
  abort()
  isLogin.value = isLoginValue
  isLoading.value = false
  clear()
}

const clear = () => {
  document.querySelectorAll('.fields_error').forEach(el => el.textContent = '')

  form.value = {
    login: '',
    password: '',
    name: '',
  }
}
</script>

<template>

  <div class="absolute bg-dark-15 left-102.5 top-50 rounded-big p-7.5 w-112.5">
    <div class="flex justify-center gap-7.5 mb-12.5">
      <ButtonUi :is-active="isLogin"
                @click="handleTab(true)"
      >
        Войти
      </ButtonUi>

      <ButtonUi :is-active="!isLogin"
                @click="handleTab(false)"
      >
        Зарегистрироваться
      </ButtonUi>
    </div>

    <form class="flex flex-col gap-10"
          novalidate
          method="post"
          data-js-form
          @submit.prevent="handleSubmit"
    >
      <TransitionGroup name="list-fade">
        <InputUi key="login"
                 v-model="form.login"
                 :readonly="isLoading"
                 @blur="onBlur"
                 @input="onInput"
                 title="Логин"
                 required
                 minlength="4"
        />
        <InputUi key="password"
                 v-model="form.password"
                 :readonly="isLoading"
                 @blur="onBlur"
                 @input="onInput"
                 title="Пароль"
                 required
                 minlength="4"
        />

        <InputUi v-if="!isLogin"
                 key="name"
                 v-model="form.name"
                 :readonly="isLoading"
                 @blur="onBlur"
                 @input="onInput"
                 title="Имя пользователя"
                 required
                 minlength="4"
        />

        <ButtonUi key="submit"
                  class="mt-5"
                  :is-loading="isLoading"
                  is-submit
        >
          {{isLogin ? 'Войти' : 'Зарегистрироваться'}}
        </ButtonUi>
      </TransitionGroup>
    </form>
  </div>

</template>