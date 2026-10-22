<script setup lang="ts">
import {ref} from "vue";

import {AuthPayload} from "@/types/auth.ts";
import {UserWithToken} from "@/types/user.ts";
import {IsLiked} from "@/types/like.ts";

import {apiAuth, apiRegister} from "@api/auth/auth.ts";
import {apiCheckLike} from "@api/like/like.ts";

import {onBlur, onInput, onSubmit} from "@composables/useFormValidate.ts";
import {login} from "@utils/auth.ts";
import {showError} from "@utils/modals.ts";

import InputUi from "@ui/InputUi.vue";
import ButtonUi from "@ui/ButtonUi.vue";

import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

const emits = defineEmits(['successAuth'])

const isLogin = ref<boolean>(true)

const isLoading = ref<boolean>(false)

const form = ref<AuthPayload>({
  login: '',
  password: '',
  name: '',
})

const message = ref<string>('')

const handleSubmit = async (e: Event) => {
  if (onSubmit(e)) {
    try {
      isLoading.value = true

      const response: UserWithToken = isLogin.value
          ? await apiAuth(form.value.login, form.value.password)
          : await apiRegister(form.value.login, form.value.password, form.value.name)

      message.value = isLogin.value
          ? `Добро пожаловать, ${response.user.name} :)`
          : 'Пользователь успешно зарегистрирован!!'

      login(response)
      emits('successAuth', message.value)

      if (audioStore.activeTrack.id >= 0) void checkLike()
    } catch (err: any) {
      await showError(
          'Ошибка авторизации',
          err?.detail
      )
    } finally {
      isLoading.value = false
    }
  }
}

const checkLike = async () => {
  try {
    const response: IsLiked = await apiCheckLike(audioStore.activeTrack.id)
    audioStore.activeTrack.isLiked = response.isLiked ?? false
  } catch {}
}

const handleTab = (isLoginValue: boolean) => {
  isLogin.value = isLoginValue
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
          <Transition name="fade-absolute">
            <span :key="String(isLogin)">
              {{isLogin ? 'Войти' : 'Зарегистрироваться'}}
            </span>
          </Transition>
        </ButtonUi>
      </TransitionGroup>
    </form>
  </div>

</template>