<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление пользователями</h4>
    <div class="text-right">
      <q-btn @click="openAddModal" color="primary" icon="add" label="Добавить" />
    </div>
    <div v-if="list.length" class="row items-start q-gutter-md q-pa-md">
      <q-card v-for="item in list" :key="item.id" class="notification-card">
        <q-card-section>
          <div class="row no-wrap">
            <div class="col">
              <div class="q-mb-sm">
                Номер телефона: <br />
                <span class="text-weight-bold">{{ item.phone_number }}</span>
              </div>
              <div class="q-mb-sm">
                Роль: <br />
                <span class="text-weight-bold">{{ item.role.name }}</span>
              </div>
              <div class="q-mb-sm">
                Имя: <br />
                <span class="text-weight-bold">{{ item.first_name }}</span>
              </div>
              <div class="q-mb-sm">
                Фамилия: <br />
                <span class="text-weight-bold">{{ item.last_name }}</span>
              </div>
              <div class="q-mb-sm">
                ИИН: <br />
                <span class="text-weight-bold">{{ item.iin }}</span>
              </div>
            </div>

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
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

    <q-dialog v-model="isAddModalVisible">
      <q-card>
        <div class="q-pa-md" style="max-width: 400px; min-width: 400px">
          <q-form @submit="addItem" class="q-gutter-md">
            <q-input
              filled
              v-model="phoneNumber"
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
              hint="Введите пароль"
              lazy-rules
              :rules="[(val) => (val && val.length > 5) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="firstName"
              label="Имя *"
              lazy-rules
              :rules="[(val) => (val && val.length > 1) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="lastName"
              label="Фамилия *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Поле обязательное']"
            />
            <q-input
              filled
              v-model="iin"
              label="ИИН *"
              mask="############"
              lazy-rules
              :rules="[(val) => (val && val.length === 12) || 'Поле обязательное']"
            />
            <q-select
              filled
              v-model="pickedRole"
              :options="roles"
              label="Роль"
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

    <q-dialog v-model="isDeleteModalVisible" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" size="md" />
          <span class="q-ml-sm">Вы действительно хотите удалить пользователя?</span>
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
    const roles = ref([])
    const phoneNumber = ref('')
    const password = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const iin = ref('')
    const pickedRole = ref(null)

    const isLoading = ref(false)
    const pickedSectionId = ref(0)
    const isDeleteModalVisible = ref(false)
    const isAddModalVisible = ref(false)
    const isChangeModalVisible = ref(false)

    const openDeleteModal = (id) => {
      pickedSectionId.value = id
      isDeleteModalVisible.value = true
    }

    const openAddModal = () => {
      isAddModalVisible.value = true
    }

    const deleteItem = async () => {
      try {
        isLoading.value = true
        await Api.deleteUser(pickedSectionId.value)
        list.value = list.value.filter((el) => el.id !== pickedSectionId.value)
        pickedSectionId.value = 0
        isDeleteModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const addItem = async () => {
      const phone_number = '+7' + phoneNumber.value.replace(/[() -]/g, '')
      const payload = {
        phone_number,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value,
        iin: iin.value,
        role_id: pickedRole.value.id,
      }
      try {
        isLoading.value = true
        const { data } = await Api.register(payload)
        list.value.push(data)
        isAddModalVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const fetchRoles = async () => {
      const { data } = await Api.getAllRoles()
      if (!data || !data.length) return (roles.value = [])
      data.forEach((el) => {
        el.label = el.name
        el.value = el.id
      })
      roles.value = data
    }

    onMounted(async () => {
      const { data } = await Api.getAllUsers()
      list.value = data
      await fetchRoles()
    })

    return {
      list,
      roles,
      pickedRole,
      phoneNumber,
      password,
      firstName,
      lastName,
      iin,
      isLoading,
      pickedSectionId,
      isDeleteModalVisible,
      isAddModalVisible,
      isChangeModalVisible,
      deleteItem,
      openAddModal,
      openDeleteModal,
      addItem,
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

<!--<template>-->
<!--  <q-page>-->
<!--    <h4 class="section-title q-mb-lg">Управление пользователям</h4>-->
<!--    &lt;!&ndash;    <div class="text-center text-subtitle1">Отсутствуют заказы</div>&ndash;&gt;-->
<!--    &lt;!&ndash;    <img&ndash;&gt;-->
<!--    &lt;!&ndash;      alt="Quasar logo"&ndash;&gt;-->
<!--    &lt;!&ndash;      src="~assets/quasar-logo-vertical.svg" Это как искать изображения прямо в html&ndash;&gt;-->
<!--    &lt;!&ndash;      style="width: 200px; height: 200px"&ndash;&gt;-->
<!--    &lt;!&ndash;    />&ndash;&gt;-->
<!--  </q-page>-->
<!--</template>-->

<!--<script>-->
<!--import { defineComponent } from 'vue'-->

<!--export default defineComponent({-->
<!--  name: 'MainPage',-->
<!--})-->
<!--</script>-->
