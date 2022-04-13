<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление услугами отелья</h4>
    <div class="text-right">
      <q-btn @click="openAddModal" color="primary" icon="add" label="Добавить" />
    </div>
    <div v-if="list.length" class="row items-start q-gutter-md q-pa-md">
      <q-card v-for="item in list" :key="item.id" class="foods-card">
        <img :src="item.image_url" alt="pic" />

        <q-card-section>
          <div class="row no-wrap">
            <div class="col">
              <div class="q-mb-sm">
                Категория: <br />
                <span class="text-weight-bold">{{ item.category.title_ru }}</span>
              </div>
              <div class="q-mb-sm">
                Название на казахском: <br />
                <span class="text-weight-bold">{{ item.title_kz }}</span>
              </div>
              <div class="q-mb-sm">
                Название на русском: <br />
                <span class="text-weight-bold">{{ item.title_ru }}</span>
              </div>
              <div class="q-mb-sm">
                Название на английском: <br />
                <span class="text-weight-bold">{{ item.title_en }}</span>
              </div>
              <div class="q-mb-sm">
                Описание на казахском: <br />
                <span class="text-weight-bold">{{ item.description_kz }}</span>
              </div>
              <div class="q-mb-sm">
                Описание на русском: <br />
                <span class="text-weight-bold">{{ item.description_ru }}</span>
              </div>
              <div class="q-mb-sm">
                Описание на английском: <br />
                <span class="text-weight-bold">{{ item.description_en }}</span>
              </div>
              <div class="q-mb-sm">
                Цена: <span class="text-weight-bold">{{ item.price }}</span>
              </div>
              <div>
                В наличии: <span class="text-weight-bold">{{ item.is_available ? 'Да' : 'Нет' }}</span>
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
    <div v-else class="text-center text-subtitle1">Отсутствуют сервисы отелья</div>

    <q-dialog v-model="isAddModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="addItem" class="q-gutter-md">
            <q-input
              filled
              v-model="titleKZ"
              label="Название на казахском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="titleRU"
              label="Название на русском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="titleEN"
              label="Название на английском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="descriptionRU"
              label="Описание на русском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="descriptionKZ"
              label="Описание на казахском *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="descriptionEN"
              label="Описание на английском *"
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
            <q-select
              filled
              v-model="selectedCategory"
              :options="categories"
              label="Категория"
              lazy-rules
              clearable
              :rules="[(val) => val || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="price"
              label="Цена *"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              lazy-rules
              :rules="[(val) => (val && val > 0) || 'Поле обязательное']"
            />
            <q-checkbox v-model="isAvailable" label="Блюдо в наличии?" />
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
            <q-input filled v-model="titleKZ" label="Название на казахском *" />
            <q-input filled v-model="titleRU" label="Название на русском *" />
            <q-input filled v-model="titleEN" label="Название на английском *" />
            <q-input filled v-model="descriptionRU" label="Описание на русском *" />
            <q-input filled v-model="descriptionKZ" label="Описание на казахском *" />
            <q-input filled v-model="descriptionEN" label="Описание на английском *" />
            <q-file v-model="image" label="Выберите изображение" filled counter clearable />
            <q-select filled v-model="selectedCategory" :options="categories" label="Категория" />
            <q-input filled v-model="price" label="Цена *" mask="#.##" fill-mask="0" reverse-fill-mask />
            <q-checkbox v-model="isAvailable" label="Блюдо в наличии?" />
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
          <span class="q-ml-sm">Вы действительно хотите удалить сервис?</span>
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
  name: 'HotelServicesPage',
  setup() {
    const list = ref([])
    const categories = ref([])
    const titleKZ = ref('')
    const titleRU = ref('')
    const titleEN = ref('')
    const descriptionKZ = ref('')
    const descriptionRU = ref('')
    const descriptionEN = ref('')
    const price = ref('')
    const isAvailable = ref(true)
    const selectedCategory = ref(null)
    const image = ref(null)
    const isLoading = ref(false)
    const pickedSectionId = ref(0)
    const isDeleteModalVisible = ref(false)
    const isAddModalVisible = ref(false)
    const isChangeModalVisible = ref(false)

    const resetFilledData = () => {
      pickedSectionId.value = 0
      titleEN.value = ''
      titleRU.value = ''
      titleKZ.value = ''
      descriptionKZ.value = ''
      descriptionRU.value = ''
      descriptionEN.value = ''
      price.value = ''
      isAvailable.value = true
      selectedCategory.value = null
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
      titleEN.value = item?.title_en || ''
      titleRU.value = item?.title_ru || ''
      titleKZ.value = item?.title_kz || ''
      descriptionKZ.value = item?.description_kz || ''
      descriptionRU.value = item?.description_ru || ''
      descriptionEN.value = item?.description_en || ''
      price.value = item?.price || ''
      isAvailable.value = item?.is_available
      if (item?.category) {
        item.category.label = item.category.title_ru
        item.category.value = item.category.id
        selectedCategory.value = item.category
      }
      selectedCategory.value = item?.category
      isChangeModalVisible.value = true
    }

    const openAddModal = () => {
      resetFilledData()
      isAddModalVisible.value = true
    }

    const deleteItem = async () => {
      try {
        isLoading.value = true
        await Api.deleteHs(pickedSectionId.value)
        list.value = list.value.filter((el) => el.id !== pickedSectionId.value)
        pickedSectionId.value = 0
        isDeleteModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const changeItem = async () => {
      const formData = new FormData()
      if (titleRU.value) formData.append('title_ru', titleRU.value)
      if (titleKZ.value) formData.append('title_kz', titleKZ.value)
      if (titleEN.value) formData.append('title_en', titleEN.value)
      if (descriptionRU.value) formData.append('description_ru', descriptionRU.value)
      if (descriptionKZ.value) formData.append('description_kz', descriptionKZ.value)
      if (descriptionEN.value) formData.append('description_en', descriptionEN.value)
      if (price.value) formData.append('price', price.value)
      formData.append('is_available', isAvailable.value)
      if (selectedCategory.value) formData.append('category_id', selectedCategory.value.id)
      if (image.value) formData.append('image', image.value)
      try {
        isLoading.value = true
        const { data } = await Api.changeHs(formData, pickedSectionId.value)
        const changedElementIdx = list.value.findIndex((el) => el.id === pickedSectionId.value)
        if (changedElementIdx !== -1) list.value.splice(changedElementIdx, 1, data)
        isChangeModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const addItem = async () => {
      const formData = new FormData()
      formData.append('title_ru', titleRU.value)
      formData.append('title_kz', titleKZ.value)
      formData.append('title_en', titleEN.value)
      formData.append('description_ru', descriptionRU.value)
      formData.append('description_kz', descriptionKZ.value)
      formData.append('description_en', descriptionEN.value)
      formData.append('category_id', selectedCategory.value.id)
      formData.append('price', price.value)
      formData.append('is_available', isAvailable.value)
      formData.append('image', image.value)
      try {
        isLoading.value = true
        const { data } = await Api.addHs(formData)
        list.value.push(data)
        isAddModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const getFoodCategories = async () => {
      const { data } = await Api.getAllHsCategories()
      if (!data || !data.length) categories.value = []
      data.forEach((el) => {
        el.label = el.title_ru
        el.value = el.id
      })
      categories.value = data
    }

    onMounted(async () => {
      await getFoodCategories()
      const { data } = await Api.getAllHs()
      list.value = data
    })

    return {
      list,
      categories,
      titleEN,
      titleRU,
      titleKZ,
      descriptionKZ,
      descriptionRU,
      descriptionEN,
      selectedCategory,
      price,
      isAvailable,
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
.foods-card {
  width: 100%;
  max-width: 250px;
}
</style>
