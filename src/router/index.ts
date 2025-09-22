import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/BookingView.vue')
    },
    {
      path: '/booking-search-result',
      name: 'booking-search-result',
      component: () => import('../views/BookingSearchResult.vue')
    },
    {
      path: '/404-page',
      name: '404',
      component: () => import('../components/ui/NotFound.vue')
    },
    // MUST be last: catch-all for undefined routes
    { path: '/:pathMatch(.*)*', redirect: '/404-page' }
  ]
})

export default router
