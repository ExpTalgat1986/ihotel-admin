<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <app-header />
    <q-page-container>
      <router-view />
    </q-page-container>
    <div class="music-player" style="display: none">
      <audio ref="audio" preload="auto" controls>
        <source src="~assets/music/notification.mp3" />
      </audio>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import AppHeader from 'components/AppHeader'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { Api } from 'src/api'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  components: { AppHeader },
  setup() {
    const store = useStore()
    const $q = useQuasar()
    const router = useRouter()
    const timerId = ref(null)
    const audio = ref(null)

    const notificationsCount = computed(() => {
      return store.state.unhandledOrdersCount
    })
    const messagesCount = computed(() => {
      return store.state.unhandledMessagesCount
    })

    watch(
      notificationsCount,
      async (newVal) => {
        if (newVal && newVal === 1) {
          await router.push({ name: 'main.layout' })
          showDialog()
        }
      },
      { immediate: false },
    )

    watch(
      messagesCount,
      async (newVal) => {
        if (newVal && newVal === 1) {
          await router.push({ name: 'main.layout' })
          showDialogMsgDialog()
        }
      },
      { immediate: false },
    )

    const toggleSound = () => {
      audio.value.play().catch((e) => {
        window.addEventListener(
          'click',
          () => {
            audio.value.play()
          },
          { once: true },
        )
      })
    }

    const showDialog = () => {
      $q.dialog({
        title: 'Новый заказ',
        message: 'Поступил новый заказ, обработайте пожалуйста',
        persistent: true,
        dark: true,
      })
        .onOk(async () => {
          await router.push({ name: 'main.orders', query: { page: 1 } })
        })
        .onOk(async () => {
          await router.push({ name: 'main.orders', query: { page: 1 } })
        })
    }

    const showDialogMsgDialog = () => {
      $q.dialog({
        title: 'Новый сообщение',
        message: 'Поступило новое сообщение',
        persistent: true,
      })
        .onOk(async () => {
          await router.push({ name: 'main.messages', query: { page: 1 } })
        })
        .onOk(async () => {
          await router.push({ name: 'main.messages', query: { page: 1 } })
        })
    }

    const fetchUnhandledMessagesCount = async () => {
      const { data: count } = await Api.getUnhandledMessagesCount()
      if (count && count > messagesCount.value) {
        toggleSound()
      }
      store.commit('setUnhandledMessagesCount', count)
    }

    const fetchUnhandledOrdersCountAndShow = async () => {
      const { data: count } = await Api.getUnhandledOrdersCount()
      if (count && count > notificationsCount.value) {
        toggleSound()
      }
      store.commit('setUnhandledOrdersCount', count)
    }

    onMounted(async () => {
      await fetchUnhandledOrdersCountAndShow()
      await fetchUnhandledMessagesCount()
      timerId.value = setInterval(() => {
        fetchUnhandledOrdersCountAndShow()
        fetchUnhandledMessagesCount()
      }, 15000)
    })

    onBeforeUnmount(() => {
      clearInterval(timerId.value)
    })

    return {
      audio,
    }
  },
})
</script>
