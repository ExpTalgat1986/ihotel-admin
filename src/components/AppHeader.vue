<template>
  <q-header elevated class="bg-white text-dark" height-hint="64">
    <q-toolbar class="GNL__toolbar">
      <q-btn flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" class="q-mr-sm" />

      <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
        <span class="q-ml-sm">iHotel</span>
      </q-toolbar-title>

      <q-space />

      <div class="q-gutter-md row items-center no-wrap">
        <!--        <q-btn v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps">-->
        <!--          <q-tooltip>Google Apps</q-tooltip>-->
        <!--        </q-btn>-->
        <q-btn round dense flat color="grey-8" icon="notifications">
          <q-badge v-show="notificationsCount" color="red" text-color="white" floating>
            {{ notificationsCount + messagesCount }}
          </q-badge>
          <q-tooltip>Уведомления</q-tooltip>
        </q-btn>
        <q-btn @click="logout" round dense flat color="grey-8" icon="logout">
          <q-tooltip>Выйти</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
  <q-drawer v-model="showSidebar" show-if-above bordered class="bg-white" :width="280">
    <q-scroll-area class="fit">
      <q-list padding class="text-grey-8">
        <template v-for="link in links1" :key="link.text">
          <q-item class="GNL__drawer-item" v-ripple :to="{ name: link.to }" v-if="link.show" clickable>
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ADMIN_ID, deleteUser, getUser, MANAGER_ID } from 'src/utils/user.utils'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const store = useStore()
    const notificationsCount = computed(() => {
      return store.state.unhandledOrdersCount
    })
    const messagesCount = computed(() => {
      return store.state.unhandledMessagesCount
    })
    const user = ref(getUser())
    const isAdmin = user.value.role?.id === ADMIN_ID
    const isManager = user.value.role?.id === MANAGER_ID
    const router = useRouter()
    const showSidebar = ref(false)
    const toggleLeftDrawer = () => {
      showSidebar.value = !showSidebar.value
    }
    const logout = () => {
      deleteUser()
      store.commit('setUnhandledOrdersCount', 0)
      router.push({ name: 'auth.index' })
    }

    return {
      notificationsCount,
      messagesCount,
      user,
      showSidebar,
      toggleLeftDrawer,
      logout,
      links1: [
        { icon: 'people', text: 'Пользователи', to: 'main.index', show: isAdmin },
        { icon: 'settings', text: 'Настройки приложения', to: 'main.app-settings', show: isAdmin },
        { icon: 'web', text: 'Рекламные баннеры', to: 'main.ad-banners', show: isAdmin },
        { icon: 'description', text: 'Секции', to: 'main.sections', show: isAdmin },
        { icon: 'email', text: 'Сообщения', to: 'main.messages', show: true },
        { icon: 'format_list_numbered_rtl', text: 'Заказы', to: 'main.orders', show: true },
        { icon: 'dashboard', text: 'Статусы заказов', to: 'main.order-statuses', show: isAdmin },
        { icon: 'campaign', text: 'Уведомления', to: 'main.notifications', show: isAdmin || isManager },
        { icon: 'menu_book', text: 'Категории блюд', to: 'main.food-categories', show: isAdmin || isManager },
        { icon: 'restaurant_menu', text: 'Блюда', to: 'main.foods', show: isAdmin || isManager },
        { icon: 'view_stream', text: 'Категории сервисов отелья', to: 'main.hs-categories', show: isAdmin || isManager },
        { icon: 'home_repair_service', text: 'Сервисы отелья', to: 'main.hs', show: isAdmin || isManager },
        { icon: 'receipt', text: 'Доп. услуги', to: 'main.ad-services', show: isAdmin || isManager },
        { icon: 'assignment', text: 'Категории доп. услуг', to: 'main.ad-service-categories', show: isAdmin || isManager },
      ],
    }
  },
})
</script>

<style lang="scss">
.GNL {
  &__toolbar {
    height: 64px;
  }
}
</style>
