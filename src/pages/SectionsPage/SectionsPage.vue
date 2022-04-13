<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление секциями</h4>
    <div class="text-right">
      <q-btn @click="openAddModal" color="primary" icon="add" label="Добавить" />
    </div>
    <div v-if="list.length" class="row items-start q-gutter-md q-pa-md">
      <q-card v-for="(item, idx) in list" :key="item.id" class="section-card">
        <img :src="item.image_url" alt="pic" />

        <q-card-section>
          <div class="row no-wrap">
            <div class="col">
              <div class="text-h6">Секция №{{ idx + 1 }}</div>
              <div>
                Название на казахском: <br> <span class="text-weight-bold">{{ item.name_kk }}</span>
              </div>
              <div>
                Название на русском: <br> <span class="text-weight-bold">{{ item.name_ru }}</span>
              </div>
              <div>
                Название на английском: <br> <span class="text-weight-bold">{{ item.name_en }}</span>
              </div>
              <a class="text-subtitle2" :href="item.link" target="_blank">Ссылка</a>
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
    <div v-else class="text-center text-subtitle1">Отсутствуют секции</div>

    <q-dialog v-model="isAddModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="addItem" class="q-gutter-md">
            <q-input
              filled
              v-model="link"
              label="Ссылка перехода *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="nameKK"
              label="Название на казахском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="nameRU"
              label="Название на русском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="nameEN"
              label="Название на английском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-file
              v-model="image"
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

    <q-dialog v-model="isChangeModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="changeItem" class="q-gutter-md">
            <q-input filled v-model="link" label="Ссылка перехода *" />
            <q-input filled v-model="nameKK" label="Название на казахском *" />
            <q-input filled v-model="nameRU" label="Название на русском *" />
            <q-input filled v-model="nameEN" label="Название на английском *" />
            <q-file v-model="image" label="Выберите изображение" filled counter clearable />
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
          <span class="q-ml-sm">Вы действительно хотите удалить секцию?</span>
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
  name: 'SectionsPage',
  setup() {
    const list = ref([])
    const link = ref('')
    const nameKK = ref('')
    const nameRU = ref('')
    const nameEN = ref('')
    const image = ref(null)
    const isLoading = ref(false)
    const pickedSectionId = ref(0)
    const isDeleteModalVisible = ref(false)
    const isAddModalVisible = ref(false)
    const isChangeModalVisible = ref(false)

    const resetFilledData = () => {
      pickedSectionId.value = 0
      link.value = ''
      nameRU.value = ''
      nameKK.value = ''
      nameEN.value = ''
      image.value = null
    }

    const openDeleteModal = (id) => {
      pickedSectionId.value = id
      isDeleteModalVisible.value = true
    }

    const openChangeModal = (id) => {
      resetFilledData()
      const item = list.value.find((el) => el.id === id)
      pickedSectionId.value = id
      link.value = item?.link || ''
      nameRU.value = item?.name_ru || ''
      nameKK.value = item?.name_kk || ''
      nameEN.value = item?.name_en || ''
      isChangeModalVisible.value = true
    }

    const openAddModal = () => {
      resetFilledData()
      isAddModalVisible.value = true
    }

    const deleteItem = async () => {
      try {
        isLoading.value = true
        await Api.deleteSection(pickedSectionId.value)
        list.value = list.value.filter((el) => el.id !== pickedSectionId.value)
        pickedSectionId.value = 0
        isDeleteModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const changeItem = async () => {
      if (!link.value && !image.value) return
      const formData = new FormData()
      if (link.value) formData.append('link', link.value)
      if (nameRU.value) formData.append('name_ru', nameRU.value)
      if (nameKK.value) formData.append('name_kk', nameKK.value)
      if (nameEN.value) formData.append('name_en', nameEN.value)
      if (image.value) formData.append('image', image.value)
      try {
        isLoading.value = true
        const { data } = await Api.changeSection(formData, pickedSectionId.value)
        const changedElementIdx = list.value.findIndex((el) => el.id === pickedSectionId.value)
        if (changedElementIdx !== -1) list.value.splice(changedElementIdx, 1, data)
        isChangeModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const addItem = async () => {
      const formData = new FormData()
      formData.append('link', link.value)
      formData.append('name_ru', nameRU.value)
      formData.append('name_kk', nameKK.value)
      formData.append('name_en', nameEN.value)
      formData.append('image', image.value)
      try {
        isLoading.value = true
        const { data } = await Api.addSection(formData)
        list.value.push(data)
        isAddModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      const { data } = await Api.getAllSections()
      list.value = data
    })

    return {
      list,
      link,
      nameRU,
      nameKK,
      nameEN,
      image,
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
.section-card {
  width: 100%;
  max-width: 250px;
}
</style>
