<template>
  <q-page class="flex justify-center items-center">
    <q-card class="q-pa-lg" style="width: 400px; max-width: 100%">
      <q-form @submit="login" class="q-gutter-md">
        <div class="text-h6">Авторизация в iHotel</div>
        <q-input
          filled
          v-model="phone"
          label="Номер телефона"
          hint="Введите номер пользователя"
          :rules="[(val) => (val && val.length === 16) || 'Валидный номер телефона']"
          lazy-rules
          prefix="+7 "
          mask="phone"
        />
        <q-input
          filled
          v-model="password"
          label="Пароль *"
          type="password"
          hint="Введите пароль"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
        />
        <div>
          <q-btn label="Войти в систему" type="submit" color="primary" :loading="isLoading" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Api } from 'src/api'
import { useRouter } from 'vue-router'
import { setUser } from 'src/utils/user.utils'

export default defineComponent({
  name: 'AuthPage',
  setup() {
    const phone = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const login = async () => {
      try {
        isLoading.value = true
        const phone_number = '+7' + phone.value.replace(/[() -]/g, '')
        const { data } = await Api.login({ phone_number, password: password.value })
        setUser(data)
        await router.push({ name: 'main.orders' })
      } finally {
        isLoading.value = false
      }
    }

    return {
      phone,
      password,
      isLoading,
      login,
    }
  },
})
</script>
