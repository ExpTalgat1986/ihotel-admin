<template>
  <q-page>
    <h4 class="section-title q-mb-lg">Управление сообщениями</h4>
    <q-table
      :loading="isLoading"
      :columns="columns"
      :rows="list"
      row-key="id"
      hide-no-data
      style="width: 100%"
      hide-pagination
    >
      <template v-slot:body-cell-action="props">
        <q-tr :props="props">
          <q-td key="action" :props="props" class="full-width">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item @click="deleteMessage(props.row.id)" clickable>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn></q-td
          >
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
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Api } from 'src/api'

export default defineComponent({
  name: 'MessagePage',
  beforeRouteEnter(to, from, next) {
    if (!to.query.page) {
      return next({ name: to.name, query: { page: 1 } })
    }
    next()
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isLoading = ref(false)
    const columns = [
      {
        name: 'guest_number',
        required: true,
        label: 'Номер комнаты',
        align: 'left',
        field: (row) => row.guest_number,
        format: (val) => `${val}`,
      },
      {
        name: 'message',
        align: 'center',
        label: 'Сообщение',
        field: 'message',
      },
      {
        name: 'created_at',
        align: 'center',
        label: 'Дата обращения',
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

    const pagination = ref({
      page: Number(route.query.page),
      rowsPerPage: 50,
    })

    const pagesNumber = ref(1)

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

    const changePage = async (newPage) => {
      await router.push({ query: { page: newPage } })
      await fetchMessages()
    }

    const list = ref([])

    const getQueryForRequest = () => {
      return `page=${pagination.value.page}`
    }

    const fetchMessages = async () => {
      try {
        isLoading.value = true
        const { data } = await Api.fetchMessages(getQueryForRequest())
        pagination.value.page = Number(data?.current_page) || 1
        pagination.value.rowsPerPage = Number(data?.per_page) || 50
        pagesNumber.value = Number(data?.last_page) || 1
        list.value = data.data
      } finally {
        isLoading.value = false
      }
    }

    const deleteMessage = async (id) => {
      try {
        isLoading.value = true
        await Api.deleteMessage(id)
        const msgIdx = list.value.findIndex((el) => el.id === id)
        if (msgIdx !== -1) list.value.splice(msgIdx, 1)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      await fetchMessages()
    })

    return {
      isLoading,
      columns,
      list,
      pagination,
      pagesNumber,
      changePage,
      deleteMessage,
    }
  },
})
</script>
