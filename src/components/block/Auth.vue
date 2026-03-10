<script setup lang="ts">
import {ref} from "vue";

import {onBlur, onInput, onSubmit} from "../../composables/useFormValidate.ts";

import InputUi from "../ui/InputUi.vue";
import ButtonUi from "../ui/ButtonUi.vue";

const login = ref<string>('')
const password = ref<string>('')
const name = ref<string>('')

const isLogin = ref<boolean>(true)

const isLoading = ref<boolean>(false)


const handleSubmit = (e: Event) => {
  if (onSubmit(e)) {
    console.log('приветик')
  }
}

const handleHeaderBtn = (isLoginValue: boolean) => {
  isLogin.value = isLoginValue
  clear()
}

const clear = () => {
  document.querySelectorAll('.fields_error').forEach(el => el.textContent = '')
  login.value = ''
  password.value = ''
  name.value = ''
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

    <form class="auth__form flex flex-column"
          novalidate
          method="post"
          data-js-form
          @submit.prevent="handleSubmit"
    >
      <InputUi class="auth__input"
               name="Логин"
               id="login"
               title="Логин"
               required
               aria-describedby="login-error"
               v-model="login"
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
               v-model="password"
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
               v-model="name"
               @blur="onBlur"
               @input="onInput"
               minlength="4"
               :readonly="isLoading"
      />

      <ButtonUi class="auth__submit"
                is-submit
      >{{isLogin ? 'Войти' : 'Зарегистрироваться'}}</ButtonUi>
    </form>
  </div>

</template>