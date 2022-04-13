<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление уведомлениями</h4>
    <div class="text-right">
      <q-btn @click="openAddModal" color="primary" icon="add" label="Добавить" />
    </div>
    <div v-if="list.length" class="row items-start q-gutter-md q-pa-md">
      <q-card v-for="item in list" :key="item.id" class="notification-card">
        <q-card-section>
          <div class="row no-wrap">
            <div class="col">
              <div>
                Заголовок на казахском: <br />
                <span class="text-weight-bold">{{ item.title_kz }}</span>
              </div>
              <div>
                Заголовок на русском: <br />
                <span class="text-weight-bold">{{ item.title_ru }}</span>
              </div>
              <div>
                Заголовок на английском: <br />
                <span class="text-weight-bold">{{ item.title_en }}</span>
              </div>
              <div>
                Текст на казахском: <br />
                <span class="text-weight-bold">{{ item.text_kz }}</span>
              </div>
              <div>
                Текст на русском: <br />
                <span class="text-weight-bold">{{ item.text_ru }}</span>
              </div>
              <div>
                Текст на английском: <br />
                <span class="text-weight-bold">{{ item.text_en }}</span>
              </div>
            </div>

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item @click="openChangeModal(item.id)" clickable>
                      <q-item-section>Изменить</q-item-section>
                    </q-item>
                    <q-item @click="openDeleteModal(item.id)" clickable>
                      <q-item-section>Удалить</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="text-center text-subtitle1">Отсутствуют уведомления</div>

    <q-dialog v-model="isAddModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="addItem" class="q-gutter-md">
            <q-input
              filled
              v-model="titleKZ"
              label="Заголовок на казахском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="titleRU"
              label="Заголовок на русском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="titleEN"
              label="Заголовок на английском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="textKZ"
              label="Текст на на казахском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="textRU"
              label="Текст на на русском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="textEN"
              label="Текст на на английском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <div>
              <q-btn label="Добавить" type="submit" color="primary" :loading="isLoading" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isChangeModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="changeItem" class="q-gutter-md">
            <q-input filled v-model="titleKZ" label="Заголовок на казахском *" />
            <q-input filled v-model="titleRU" label="Заголовок на русском *" />
            <q-input filled v-model="titleEN" label="Заголовок на английском *" />
            <q-input filled v-model="textKZ" label="Текст на на казахском *" />
            <q-input filled v-model="textRU" label="Текст на на русском *" />
            <q-input filled v-model="textEN" label="Текст на на английском *" />
            <div>
              <q-btn label="Изменить" type="submit" color="primary" :loading="isLoading" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDeleteModalVisible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" size="md" />
          <span class="q-ml-sm">Вы действительно хотите удалить уведомление?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="secondary-dark" v-close-popup />
          <q-btn @click="deleteItem" :loading="isLoading" flat label="Удалить" color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { Api } from 'src/api'

export default defineComponent({
  name: 'NotificationsPage',
  setup() {
    const list = ref([])
    const titleRU = ref('')
    const titleKZ = ref('')
    const titleEN = ref('')
    const textRU = ref('')
    const textKZ = ref('')
    const textEN = ref('')

    const isLoading = ref(false)
    const pickedSectionId = ref(0)
    const isDeleteModalVisible = ref(false)
    const isAddModalVisible = ref(false)
    const isChangeModalVisible = ref(false)

    const resetFilledData = () => {
      pickedSectionId.value = 0
      titleRU.value = ''
      titleKZ.value = ''
      titleEN.value = ''
      textRU.value = ''
      textKZ.value = ''
      textEN.value = ''
    }

    const openDeleteModal = (id) => {
      pickedSectionId.value = id
      isDeleteModalVisible.value = true
    }

    const openChangeModal = (id) => {
      resetFilledData()
      const item = list.value.find((el) => el.id === id)
      pickedSectionId.value = id
      titleEN.value = item?.title_en || ''
      titleRU.value = item?.title_ru || ''
      titleKZ.value = item?.title_kz || ''
      textEN.value = item?.text_en || ''
      textRU.value = item?.text_ru || ''
      textKZ.value = item?.text_kz || ''
      isChangeModalVisible.value = true
    }

    const openAddModal = () => {
      resetFilledData()
      isAddModalVisible.value = true
    }

    const deleteItem = async () => {
      try {
        isLoading.value = true
        await Api.deleteNotification(pickedSectionId.value)
        list.value = list.value.filter((el) => el.id !== pickedSectionId.value)
        pickedSectionId.value = 0
        isDeleteModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const changeItem = async () => {
      const payload = {}
      if (titleEN.value) payload.title_en = titleEN.value
      if (titleRU.value) payload.title_ru = titleRU.value
      if (titleKZ.value) payload.title_kz = titleKZ.value
      if (textEN.value) payload.text_en = textEN.value
      if (textRU.value) payload.text_ru = textRU.value
      if (textKZ.value) payload.text_kz = textKZ.value

      if (!Object.keys(payload).length) return

      try {
        isLoading.value = true
        const { data } = await Api.changeNotification(payload, pickedSectionId.value)
        const changedElementIdx = list.value.findIndex((el) => el.id === pickedSectionId.value)
        if (changedElementIdx !== -1) list.value.splice(changedElementIdx, 1, data)
        isChangeModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const addItem = async () => {
      const payload = {
        title_ru: titleRU.value,
        title_en: titleEN.value,
        title_kz: titleKZ.value,
        text_ru: textRU.value,
        text_en: textEN.value,
        text_kz: textKZ.value,
      }
      try {
        isLoading.value = true
        const { data } = await Api.addNotification(payload)
        list.value.push(data)
        isAddModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      const { data } = await Api.getAllNotifications()
      list.value = data
    })

    return {
      list,
      titleEN,
      titleRU,
      titleKZ,
      textRU,
      textEN,
      textKZ,
      isLoading,
      pickedSectionId,
      isDeleteModalVisible,
      isAddModalVisible,
      isChangeModalVisible,
      deleteItem,
      openAddModal,
      openDeleteModal,
      openChangeModal,
      addItem,
      changeItem,
    }
  },
})
</script>

<style lang="scss">
.notification-card {
  width: 100%;
  max-width: 250px;
}
</style>
