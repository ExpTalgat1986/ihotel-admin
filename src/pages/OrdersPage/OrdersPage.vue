<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление заказами</h4>
    <div class="orders">
      <q-table
        :columns="columns"
        :rows="orders"
        row-key="id"
        hide-no-data
        style="width: 100%"
        hide-pagination
        :loading="isLoading"
      >
        <template v-slot:body-cell-order_status_id="props">
          <q-td key="calories" :props="props">
            <q-badge :color="getOrderStatusColor(props.row.order_status_id)">
              {{ getOrderStatusFromId(props.row.order_status_id) }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-tr :props="props">
            <q-td key="action" :props="props" class="full-width">
              <q-btn
                @click="showOrderDetails(props.row.id)"
                color="grey-7"
                round
                flat
                icon="info_outline"
              ></q-btn
            ></q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="pagination.page"
          color="grey-8"
          :max="pagesNumber"
          :max-pages="6"
          size="sm"
          @update:model-value="changePage"
        />
      </div>
    </div>

    <q-dialog v-model="isOrderDetailsVisible">
      <q-card>
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">
                Детали заказа № <b>{{ selectedOrder.id }}</b>
              </div>
              <div class="text-caption text-grey">
                <div>
                  Номер комнаты:
                  <span class="text-black text-weight-bold">{{ selectedOrder.guest_number }}</span>
                </div>
                <div>
                  Имя заказчика: <br />
                  <span class="text-black text-weight-bold">{{ selectedOrder.full_name }}</span>
                </div>
                <div>
                  Статус:
                  <q-badge :color="getOrderStatusColor(selectedOrder.order_status_id)">
                    {{ getOrderStatusFromId(selectedOrder.order_status_id) }}
                  </q-badge>
                </div>
                <q-separator class="q-my-sm" inset></q-separator>
                <div>
                  Итоговая цена:
                  <span class="text-black text-weight-bold">{{ selectedOrdersTotalPrice }} ₸</span>
                </div>
              </div>
            </q-card-section>
            <q-list bordered class="rounded-borders" style="max-width: 350px">
              <q-item-label header>Список заказа</q-item-label>

              <template v-for="order in selectedOrder.order_list" :key="order.id + order.type">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="order.image_url" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1"> {{ order.title_ru }} </q-item-label>
                    <q-item-label caption lines="2">
                      {{ order.description_ru }}
                    </q-item-label>
                    <q-item-label caption>
                      Количество: <b>{{ order.quantity }}</b>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top> {{ getOrderType(order.type) }} </q-item-section>
                </q-item>

                <q-separator inset="item" />
              </template>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat round icon="event" />
            <q-btn flat> {{ formatDate(selectedOrder.created_at) }} </q-btn>
            <q-select
              v-model="selectedOrderStatus"
              :options="orderStatuses"
              class="q-ml-md"
              style="min-width: 170px"
              label="Статус заказа"
            />
          </q-card-actions>
          <q-card-section>
            <q-btn @click="updateOrder" :loading="isLoading" color="primary" label="Сохранить" />
            <q-btn v-if="isAdmin" class="q-ml-md" @click="deleteOrder" color="red" label="Удалить" />
          </q-card-section>
        </q-card>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Api } from 'src/api'
import { useRoute, useRouter } from 'vue-router'
import { ADDITIONAL_SERVICE_TYPE_NAME, FOOD_TYPE_NAME, HOTEL_SERVICE_TYPE_NAME } from 'src/config/order.config'
import { ADMIN_ID, getUser } from 'src/utils/user.utils'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'OrdersPage',
  beforeRouteEnter(to, from, next) {
    if (!to.query.page) {
      return next({ name: to.name, query: { page: 1 } })
    }
    next()
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const isLoading = ref(false)
    const isOrderDetailsVisible = ref(false)
    const selectedOrder = ref(null)
    const selectedOrderStatus = ref(null)
    const orders = ref([])
    const orderStatuses = ref([])
    const pagination = ref({
      page: Number(route.query.page),
      rowsPerPage: 50,
    })
    const pagesNumber = ref(1)

    const user = ref(getUser())
    const isAdmin = user.value.role?.id === ADMIN_ID

    const selectedOrdersTotalPrice = computed(() => {
      if (!selectedOrder.value) return 0
      return selectedOrder.value.order_list.reduce(
        (accumulate, el) => accumulate + Number(el.price) * el.quantity,
        0,
      )
    })

    const showOrderDetails = (orderId) => {
      selectedOrder.value = orders.value.find((el) => el.id === orderId)
      const orderStatusId = selectedOrder.value.order_status_id
      selectedOrderStatus.value = orderStatuses.value.find((el) => el.id === orderStatusId)
      isOrderDetailsVisible.value = true
    }

    const getOrderStatusFromId = (id) => {
      if (!orderStatuses.value.length) return '-'
      const status = orderStatuses.value.find((el) => el.id === id)
      return status?.title || '-'
    }

    const getOrderType = (type) => {
      if (type === FOOD_TYPE_NAME) return 'Блюда'
      if (type === HOTEL_SERVICE_TYPE_NAME) return 'Услуги отеля'
      if (type === ADDITIONAL_SERVICE_TYPE_NAME) return 'Доп. услуги'
      return ''
    }

    const getOrderStatusColor = (id) => {
      if (!orderStatuses.value.length) return 'grey'
      if (id === 1) return 'red'
      if (id === 2) return 'primary'
      if (id === 3) return 'green'
      return 'grey'
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date(date))
    }

    const columns = [
      {
        name: 'id',
        required: true,
        label: 'Номер заказа',
        align: 'left',
        field: (row) => row.id,
        format: (val) => `${val}`,
      },
      {
        name: 'guest_number',
        required: true,
        label: 'Номер комнаты',
        align: 'center',
        field: (row) => row.guest_number,
        format: (val) => `${val}`,
      },
      {
        name: 'full_name',
        align: 'center',
        label: 'Имя заказчика',
        field: 'full_name',
      },
      {
        name: 'order_status_id',
        align: 'center',
        label: 'Статус',
        field: 'order_status_id',
      },
      {
        name: 'created_at',
        align: 'center',
        label: 'Дата создания',
        field: 'created_at',
        format: (val) => formatDate(val),
      },
      {
        name: 'action',
        align: 'left',
        label: 'Действия',
        field: 'action',
      },
    ]

    const deleteOrder = async () => {
      isOrderDetailsVisible.value = false
      $q.dialog({
        title: 'Удаление заказа',
        cancel: true,
        message: `Вы действительно хотите удалить заказ с номером ${selectedOrder.value.id}`,
      }).onOk(async () => {
        await Api.deleteOrder(selectedOrder.value.id)
        const orderIdx = orders.value.find((el) => el.id === selectedOrder.value.id)
        orders.value.splice(orderIdx, 1)
        selectedOrder.value = null
      })
    }

    const updateOrder = async () => {
      try {
        isLoading.value = true
        const { data } = await Api.changeOrder(
          { order_status_id: selectedOrderStatus.value.id },
          selectedOrder.value.id,
        )
        selectedOrder.value = data
        const orderIdx = orders.value.find((el) => el.id === selectedOrder.value.id)
        orders.value.splice(orderIdx, 1, selectedOrder.value)
        isOrderDetailsVisible.value = false
      } finally {
        isLoading.value = false
      }
    }

    const fetchOrderStatuses = async () => {
      const { data } = await Api.getAllOrderStatuses()
      data.forEach((el) => (el.label = el.title))
      orderStatuses.value = data
    }

    const getQuery = () => {
      return `page=${pagination.value.page}`
    }

    const fetchOrders = async () => {
      const { data } = await Api.getAllOrders(getQuery())
      pagination.value.page = Number(data?.current_page) || 1
      pagination.value.rowsPerPage = Number(data?.per_page) || 50
      pagesNumber.value = Number(data?.last_page) || 1
      orders.value = data.data
    }

    const changePage = async (newPage) => {
      await router.push({ query: { page: newPage } })
      await fetchOrders()
    }

    onMounted(async () => {
      try {
        isLoading.value = true
        await fetchOrderStatuses()
        await fetchOrders()
      } finally {
        isLoading.value = false
      }
    })

    return {
      isLoading,
      columns,
      orders,
      isOrderDetailsVisible,
      selectedOrder,
      pagination,
      pagesNumber,
      orderStatuses,
      selectedOrderStatus,
      selectedOrdersTotalPrice,
      isAdmin,
      changePage,
      getOrderStatusFromId,
      getOrderStatusColor,
      showOrderDetails,
      formatDate,
      getOrderType,
      updateOrder,
      deleteOrder,
    }
  },
})
</script>
