import { createRouter, createWebHistory } from 'vue-router'
import { hasSearchParams, deserializeSearchParams } from '@/utils/urlParamsSync'
import { parseResultsMainProps, parseSummaryProps, determineSearchRoute } from '@/utils/routeHelpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      // Backward compatibility: Redirect old query param URLs to new routes
      beforeEnter: (to, from, next) => {
        if (hasSearchParams(to.query)) {
          const searchParams = deserializeSearchParams(to.query)
          const route = determineSearchRoute(searchParams)
          
          if (route.name !== 'home') {
            // Redirect to appropriate search route
            next({
              name: route.name,
              params: route.params,
              query: to.query
            })
          } else {
            next()
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/search',
      component: () => import('../views/SearchView.vue'),
      children: [
        {
          path: '',
          name: 'search-oneway',
          component: () => import('../components/search/ResultsMain.vue'),
          props: parseResultsMainProps
        },
        {
          path: 'outbound',
          name: 'search-outbound',
          component: () => import('../components/search/ResultsMain.vue'),
          props: parseResultsMainProps
        },
        {
          path: 'return',
          name: 'search-return',
          component: () => import('../components/search/ResultsMain.vue'),
          props: parseResultsMainProps
        },
        {
          path: 'summary',
          name: 'search-summary',
          component: () => import('../components/booking/StepTwoMobileSummary.vue'),
          props: parseSummaryProps
        },
        {
          path: 'segment/:index',
          name: 'search-segment',
          component: () => import('../components/search/ResultsMain.vue'),
          props: parseResultsMainProps
        }
      ]
    },
    {
      path: '/booking',
      component: () => import('../views/BookingView.vue'),
      // Redirect /booking to /booking/step-2 for backward compatibility
      redirect: { name: 'booking-step-2' },
      children: [
        {
          path: 'step-2',
          name: 'booking-step-2',
          component: () => import('../components/booking/StepTwo.vue')
        },
        {
          path: 'step-3',
          name: 'booking-step-3',
          component: () => import('../components/booking/StepThree.vue'),
          // Guard: Require booking data from step 2
          beforeEnter: async (to, from, next) => {
            // Dynamic import to avoid circular dependency
            const { useBookingStore } = await import('../stores/booking')
            const bookingStore = useBookingStore()
            
            // CRITICAL: Restore booking data from localStorage BEFORE checking
            // Route guards run before components mount, so BookingView's getBookingData() hasn't run yet
            bookingStore.getBookingData()
            
            // Check if booking result exists (step 2 completed)
            if (!bookingStore.bookingResult || !bookingStore.bookingResult.bookingData) {
              // No booking data, redirect to step 2
              next({ name: 'booking-step-2' })
            } else {
              next()
            }
          }
        },
        {
          path: 'step-4',
          name: 'booking-step-4',
          component: () => import('../components/booking/StepFour.vue'),
          // Guard: Require booking data (step 3 completed)
          beforeEnter: async (to, from, next) => {
            // Dynamic import to avoid circular dependency
            const { useBookingStore } = await import('../stores/booking')
            const bookingStore = useBookingStore()
            
            // CRITICAL: Restore booking data from localStorage BEFORE checking
            // Route guards run before components mount, so BookingView's getBookingData() hasn't run yet
            bookingStore.getBookingData()
            
            // Check if booking result exists
            if (!bookingStore.bookingResult || !bookingStore.bookingResult.bookingData) {
              // No booking data, redirect to step 2
              next({ name: 'booking-step-2' })
            } else {
              next()
            }
          }
        }
      ]
    },
    {
      path: '/booking-search-result',
      name: 'booking-search-result',
      component: () => import('../views/BookingSearchResult.vue')
    },
    {
      path: '/404-page',
      name: '404',
      component: () => import('../components/ui/feedback/NotFound.vue')
    },
    // MUST be last: catch-all for undefined routes
    { path: '/:pathMatch(.*)*', redirect: '/404-page' }
  ]
})

export default router
