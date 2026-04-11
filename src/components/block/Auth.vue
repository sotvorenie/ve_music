<script setup lang="ts">
import {ref} from "vue";

import {Auth} from "../../types/auth.ts";
import {UserWithToken} from "../../types/user.ts";

import {apiAuth, apiRegister} from "../../api/auth/auth.ts";

import {onBlur, onInput, onSubmit} from "../../composables/useFormValidate.ts";
import {login} from "../../utils/auth.ts";
import {showError} from "../../utils/modals.ts";

import InputUi from "../ui/InputUi.vue";
import ButtonUi from "../ui/ButtonUi.vue";

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

    let data: UserWithToken

    try {
      isLoading.value = true

      if (isLogin.value) {
        data = await apiAuth(form.value.login, form.value.password)
        message.value = `Добро пожаловать, ${data.user.name}!!)`
      } else {
        data = await apiRegister(form.value.login, form.value.password, form.value.name)
        message.value = 'Пользователь успешно зарегистрирован!!'
      }

      login(data)
      emits('successAuth', message.value)
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
                 name="Логин"
                 id="login"
                 title="Логин"
                 required
                 aria-describedby="login-error"
                 v-model="form.login"
                 @blur="onBlur"
                 @input="onInput"
                 minlength="4"
                 :readonly="isLoading"
        />
        <InputUi class="auth__input"
                 name="Пароль"
                 id="password"
                 title="Пароль"
                 required
                 aria-describedby="password-error"
                 v-model="form.password"
                 @blur="onBlur"
                 @input="onInput"
                 minlength="4"
                 :readonly="isLoading"
        />

        <InputUi class="auth__input"
                 v-if="!isLogin"
                 name="Имя"
                 id="name"
                 title="Имя пользователя"
                 required
                 aria-describedby="name-error"
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