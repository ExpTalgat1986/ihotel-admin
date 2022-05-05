const routes = [
  {
    path: '/auth',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        name: 'auth.index',
        component: () => import('pages/AuthPage/AuthPage.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'main.layout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'main.index', component: () => import('pages/MainPage/MainPage.vue') },
      {
        path: 'ad-banners',
        name: 'main.ad-banners',
        component: () => import('pages/AdvertisementPage/AdvertisementPage.vue'),
      },
      {
        path: 'app-settings',
        name: 'main.app-settings',
        component: () => import('pages/AppSettingsPage/AppSettingsPage.vue'),
      },
      {
        path: 'sections',
        name: 'main.sections',
        component: () => import('pages/SectionsPage/SectionsPage.vue'),
      },
      {
        path: 'notifications',
        name: 'main.notifications',
        component: () => import('pages/NotificationsPage/NotificationsPage.vue'),
      },
      {
        path: 'food-categories',
        name: 'main.food-categories',
        component: () => import('pages/FoodCategoriesPage/FoodCategoriesPage.vue'),
      },
      { path: 'foods', name: 'main.foods', component: () => import('pages/FoodsPage/FoodsPage.vue') },
      {
        path: 'hotel-services',
        name: 'main.hs',
        component: () => import('pages/HotelServicesPage/HotelServicesPage.vue'),
      },
      { path: 'orders', name: 'main.orders', component: () => import('pages/OrdersPage/OrdersPage.vue') },
      {
        path: 'order-statuses',
        name: 'main.order-statuses',
        component: () => import('pages/OrderStatusesPage/OrderStatusesPage.vue'),
      },
      {
        path: 'hs-categories',
        name: 'main.hs-categories',
        component: () => import('pages/HsCategoriesRepo/HsCategoriesPage.vue'),
      },
      {
        path: 'ad-service-categories',
        name: 'main.ad-service-categories',
        component: () => import('pages/AdServiceCategories/AdServiceCategoriesPage.vue'),
      },
      {
        path: 'ad-services',
        name: 'main.ad-services',
        component: () => import('pages/AdServices/AdServicesPage.vue'),
      },
      {
        path: 'messages',
        name: 'main.messages',
        component: () => import('pages/MessagesPage/MessagesPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
