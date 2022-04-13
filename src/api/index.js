import adBanners from './ad-banners.api'
import appSettings from './app-settings.api'
import sections from './sections.api'
import notifications from './notifications.api'
import foodCategories from './food-categories.api'
import foods from './food.api'
import auth from './auth.api'
import hotelServices from './hotel-services.api'

export const Api = {
  ...adBanners,
  ...appSettings,
  ...sections,
  ...notifications,
  ...foodCategories,
  ...foods,
  ...auth,
  ...hotelServices,
}
