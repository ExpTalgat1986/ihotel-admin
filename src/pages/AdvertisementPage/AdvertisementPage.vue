<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление рекламными баннерами</h4>
    <div class="text-right">
      <q-btn @click="openAddModal" color="primary" icon="add" label="Добавить" />
    </div>
    <div v-if="list.length" class="row items-start q-gutter-md q-pa-md">
      <q-card v-for="(item, idx) in list" :key="item.id" class="ad-card">
        <img :src="item.banner_img" alt="pic" />

        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Баннер №{{ idx + 1 }}</div>
              <a class="text-subtitle2" :href="item.banner_url" target="_blank">Ссылка</a>
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
    <div v-else class="text-center text-subtitle1">Отсутствуют рекламные баннеры</div>

    <q-dialog v-model="isAddModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="addAdBanner" class="q-gutter-md">
            <q-input
              filled
              v-model="link"
              label="Ссылка перехода *"
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
              <q-btn label="Добавить" type="submit" color="primary" :loading="isUploadingBanner" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isChangeModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="changeAdBanner" class="q-gutter-md">
            <q-input filled v-model="link" label="Ссылка перехода *" />
            <q-file v-model="image" label="Выберите изображение" filled counter clearable />
            <div>
              <q-btn label="Изменить" type="submit" color="primary" :loading="isUploadingBanner" />
            </div>
          </q-form>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDeleteModalVisible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" size="md" />
          <span class="q-ml-sm">Вы действительно хотите удалить баннер?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="secondary-dark" v-close-popup />
          <q-btn @click="deleteAd" :loading="isDeletingBanner" flat label="Удалить" color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { Api } from 'src/api'

export default defineComponent({
  name: 'AdvertisementPage',
  setup() {
    const list = ref([])
    const link = ref('')
    const image = ref(null)
    const isUploadingBanner = ref(false)
    const isDeletingBanner = ref(false)
    const pickedAdId = ref(0)
    const isDeleteModalVisible = ref(false)
    const isAddModalVisible = ref(false)
    const isChangeModalVisible = ref(false)

    const resetFilledData = () => {
      pickedAdId.value = 0
      link.value = ''
      image.value = null
    }

    const openDeleteModal = (id) => {
      pickedAdId.value = id
      isDeleteModalVisible.value = true
    }

    const openChangeModal = (id) => {
      resetFilledData()
      const item = list.value.find((el) => el.id === id)
      pickedAdId.value = id
      link.value = item?.banner_url || ''
      isChangeModalVisible.value = true
    }

    const openAddModal = () => {
      resetFilledData()
      isAddModalVisible.value = true
    }

    const deleteAd = async () => {
      try {
        isDeletingBanner.value = true
        await Api.deleteBanner(pickedAdId.value)
        list.value = list.value.filter((el) => el.id !== pickedAdId.value)
        pickedAdId.value = 0
        isDeleteModalVisible.value = false
      } finally {
        isDeletingBanner.value = false
      }
    }

    const changeAdBanner = async () => {
      if (!link.value && !image.value) return
      const formData = new FormData()
      if (link.value) formData.append('banner_url', link.value)
      if (image.value) formData.append('image', image.value)
      try {
        isUploadingBanner.value = true
        const { data } = await Api.changeBanner(formData, pickedAdId.value)
        const changedElementIdx = list.value.findIndex((el) => el.id === pickedAdId.value)
        if (changedElementIdx !== -1) list.value.splice(changedElementIdx, 1, data)
        isChangeModalVisible.value = false
      } finally {
        isUploadingBanner.value = false
      }
    }

    const addAdBanner = async () => {
      const formData = new FormData()
      formData.append('banner_url', link.value)
      formData.append('image', image.value)
      try {
        isUploadingBanner.value = true
        const { data } = await Api.addBanner(formData)
        list.value.push(data)
        isAddModalVisible.value = false
      } finally {
        isUploadingBanner.value = false
      }
    }

    onMounted(async () => {
      const { data } = await Api.getAllAdBanners()
      list.value = data
    })

    return {
      list,
      link,
      image,
      isUploadingBanner,
      isDeletingBanner,
      pickedAdId,
      isDeleteModalVisible,
      isAddModalVisible,
      isChangeModalVisible,
      deleteAd,
      openAddModal,
      openDeleteModal,
      openChangeModal,
      addAdBanner,
      changeAdBanner,
    }
  },
})
</script>

<style lang="scss">
.ad-card {
  width: 100%;
  max-width: 250px;
}
</style>
