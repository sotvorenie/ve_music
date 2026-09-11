<script setup lang="ts">
import {ref} from "vue";

import {Auth} from "@/types/auth.ts";
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

const form = ref<Auth>({
  login: '',
  password: '',
  name: '',
})

const message = ref<string>('приветик')

const handleSubmit = async (e: Event) => {
  if (onSubmit(e)) {

    let response: UserWithToken

    try {
      isLoading.value = true

      if (isLogin.value) {
        response = await apiAuth(form.value.login, form.value.password)
        message.value = `Добро пожаловать, ${response.user.name}!!)`
      } else {
        response = await apiRegister(form.value.login, form.value.password, form.value.name)
        message.value = 'Пользователь успешно зарегистрирован!!'
      }

      login(response)
      emits('successAuth', message.value)

      if (audioStore.activeTrack.id >= 0) await checkLike()
    } catch (err: any) {
      await showError(
          'Ошибка авторизации',
          err.response?.data?.detail
      )
    } finally {
      isLoading.value = false
    }
  }
}

const checkLike = async () => {
  try {
    const response: IsLiked = await apiCheckLike(audioStore.activeTrack.id)
    audioStore.activeTrack.isLiked = response?.isLiked ?? false
  } catch (err) {
    console.error(err)
  }
}

const handleHeaderBtn = (isLoginValue: boolean) => {
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

  <div class="auth aside__block position-absolute">
    <header class="auth__header flex flex-justify-center">
      <ButtonUi :is-active="isLogin"
                @click="handleHeaderBtn(true)"
      >Войти</ButtonUi>
      <ButtonUi :is-active="!isLogin"
                @click="handleHeaderBtn(false)"
      >Зарегистрироваться</ButtonUi>
    </header>

    <form class="auth__form flex flex-column position-relative"
          novalidate
          method="post"
          data-js-form
          @submit.prevent="handleSubmit"
    >
      <TransitionGroup name="list-fade">
        <InputUi class="auth__input"
                 title="Логин"
                 required
                 v-model="form.login"
                 @blur="onBlur"
                 @input="onInput"
                 minlength="4"
                 :readonly="isLoading"
        />
        <InputUi class="auth__input"
                 title="Пароль"
                 required
                 v-model="form.password"
                 @blur="onBlur"
                 @input="onInput"
                 minlength="4"
                 :readonly="isLoading"
        />

        <InputUi class="auth__input"
                 v-if="!isLogin"
                 title="Имя пользователя"
                 required
                 v-model="form.name"
                 @blur="onBlur"
                 @input="onInput"
                 minlength="4"
                 :readonly="isLoading"
        />

        <ButtonUi class="auth__submit"
                  is-submit
                  :is-loading="isLoading"
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