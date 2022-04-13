<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление настройками приложения</h4>
    <div class="text-right">
      <q-btn
        @click="showAppSettingsModal"
        color="primary"
        icon="settings"
        :label="isAppSettingsSet ? 'Изменить настройки' : 'Задать настройки'"
      />
    </div>

    <div v-if="isAppSettingsSet" class="row items-center justify-center q-mt-sm q-gutter-md q-pa-md">
      <q-card class="settings-card">
        <img :src="settings.main_logo_url" alt="pic" />

        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-center text-h6"> {{settings.application_name}} </div>
              <div class="text-center"> {{settings.welcome_text}} </div>
              <div class="text-center"> {{settings.concierge_phone}} </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="text-center text-subtitle1">Настройки еще не заданы</div>

    <q-dialog v-model="isSetAppSettingsModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="setAppSettings" class="q-gutter-md">
            <q-input
              filled
              v-model="settings.application_name"
              label="Название приложения *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="settings.welcome_text"
              label="Приветственный текст *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="settings.concierge_phone"
              prefix="+7 "
              mask="(###) ### ####"
              label="Номер консьержа *"
              lazy-rules
              :rules="[(val) => (val && val.length === 14) || 'Введите корректный телефон']"
            />
            <q-file
              v-model="uploadingImage"
              label="Выберите изображение"
              filled
              counter
              lazy-rules
              clearable
              :rules="[(val) => val || 'Поле обязательное']"
            />
            <div>
              <q-btn label="Добавить" type="submit" color="primary" :loading="isLoading" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isChangeAppSettingsModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="changeAppSettings" class="q-gutter-md">
            <q-input filled v-model="applicationName" label="Название приложения *" />
            <q-input filled v-model="welcomeText" label="Приветственный текст *" />
            <q-input filled v-model="conciergePhone" label="Номер консьержа *" />
            <q-file v-model="uploadingImage" label="Выберите изображение" filled counter clearable />
            <div>
              <q-btn label="Изменить" type="submit" color="primary" :loading="isLoading" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Api } from 'src/api'

export default defineComponent({
  name: 'AppSettingsPage',
  setup() {
    const applicationName = ref('')
    const welcomeText = ref('')
    const conciergePhone = ref('')
    const uploadingImage = ref(null)

    const settings = ref({
      application_name: '',
      welcome_text: '',
      concierge_phone: '',
      main_logo_url: '',
    })

    const isLoading = ref(false)
    const isAppSettingsSet = computed(() => {
      return !!(
        settings.value.application_name &&
        settings.value.welcome_text &&
        settings.value.concierge_phone &&
        settings.value.main_logo_url
      )
    })
    const isSetAppSettingsModalVisible = ref(false)
    const isChangeAppSettingsModalVisible = ref(false)

    const showAppSettingsModal = () => {
      if (isAppSettingsSet.value) {
        applicationName.value = settings.value.application_name
        welcomeText.value = settings.value.welcome_text
        conciergePhone.value = settings.value.concierge_phone
        uploadingImage.value = null
        return (isChangeAppSettingsModalVisible.value = true)
      }
      isSetAppSettingsModalVisible.value = true
    }

    const changeAppSettings = async () => {
      if (!applicationName.value && !welcomeText.value && !conciergePhone.value && !uploadingImage.value)
        return

      const formData = new FormData()
      if (applicationName.value) formData.append('application_name', applicationName.value)
      if (welcomeText.value) formData.append('welcome_text', welcomeText.value)
      if (conciergePhone.value) formData.append('concierge_phone', conciergePhone.value)
      if (uploadingImage.value) formData.append('image', uploadingImage.value)
      try {
        isLoading.value = true
        const { data } = await Api.changeAppSettings(formData)
        settings.value = data
        isChangeAppSettingsModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const setAppSettings = async () => {
      const phone = `+7${settings.value.concierge_phone.replace(/[()\- ]/g, '')}`
      const formData = new FormData()
      formData.append('application_name', settings.value.application_name)
      formData.append('welcome_text', settings.value.welcome_text)
      formData.append('concierge_phone', phone)
      formData.append('image', uploadingImage.value)

      try {
        isLoading.value = true
        const { data } = await Api.setAppSettings(formData)
        settings.value = data
        isSetAppSettingsModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      const { data } = await Api.getAppSetting()
      if (data) settings.value = data
    })

    return {
      settings,
      applicationName,
      welcomeText,
      conciergePhone,
      isLoading,
      uploadingImage,
      isSetAppSettingsModalVisible,
      isChangeAppSettingsModalVisible,
      isAppSettingsSet,
      showAppSettingsModal,
      setAppSettings,
      changeAppSettings,
    }
  },
})
</script>

<style lang="scss">
.settings-card {
  width: 100%;
  max-width: 300px;
}
</style>
