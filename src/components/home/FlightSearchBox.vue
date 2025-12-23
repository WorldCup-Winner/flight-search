<template>
  <div class="mt-60">
    <div
      class="relative flex items-center justify-center px-4 md:px-0"
      :class="[{ 'hidden md:flex': sharedValue?.isSearch && flightSearchStore.loading !== 'default' }]"
    >
      <SearchPanel
        :active-tab="activeTab as any"
        :restored-params="restoredParams"
        instance-id="flight-search-box"
        @update:activeTab="val => (activeTab = val)"
        @roundtrip-search="handleRoundSearch"
        @oneway-search="handleSingleSearch"
        @multi-search="handleMultiSearch"
      />
    </div>
    <div class="mt-24 px-4 md:px-0">
      <div v-if="flightSearchStore.loading === 'default'">
        <BannerImg />
        <RecommendedTrips />
      </div>
      <div v-else-if="flightSearchStore.loading === 'loading'">
        <div class="relative">
          <SearchResultLoading v-model="state" :rows="11" :speed="1300" />
          <FlightSearchLoading />
        </div>
      </div>
      <!-- Results are now shown on /search/* routes, not here -->
    </div>
    
    <!-- BaggageInfoAndFeeRule handles its own transitions internally (uses Teleport) -->
    <BaggageInfoAndFeeRule 
      :open="sharedValue?.isOpenBaggageInfoAndFeeRule" 
      :fareRuleData="sharedValue?.fareRuleData"
      @close="updateValue?.({ isOpenBaggageInfoAndFeeRule: false, fareRuleData: undefined })" 
    />

    <!-- Mobile search edit modal -->
    <SearchEditModal
      :open="isSearchEditModalOpen"
      :active-tab="activeTab"
      :restored-params="restoredParams"
      @close="closeSearchEditModal"
      @update:activeTab="val => (activeTab = val)"
      @roundtrip-search="handleRoundSearchFromModal"
      @oneway-search="handleSingleSearchFromModal"
      @multi-search="handleMultiSearchFromModal"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFlightSearchStore } from '@/stores/flightSearch'
import { useBookingStore } from '@/stores/booking'
import { useLocationStore } from '@/stores/location'

import SearchPanel from '@/components/home/SearchPanel.vue'
import SearchEditModal from '@/components/ui/modals/SearchEditModal.vue'
import RecommendedTrips from '@/components/home/RecommendedTrips.vue'
import BannerImg from '@/components/home/BannerImg.vue'
import FlightSearchLoading from '@/components/ui/loading/FlightSearchLoading.vue'
import SearchResultLoading from '@/components/ui/loading/SearchResultLoading.vue'
import BaggageInfoAndFeeRule from '@/components/ui/booking/BaggageInfoAndFeeRule.vue'
import { useAirlineStore } from '@/stores/airline'
import { 
  serializeSearchParams, 
  deserializeSearchParams, 
  extractSearchParamsFromRequest,
  hasSearchParams,
  buildSearchRequest
} from '@/utils/urlParamsSync'
import { clearStoredSegments } from '@/utils/segmentStorage'

// Store
const flightSearchStore = useFlightSearchStore()
const bookingStore = useBookingStore()
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

const router = useRouter()
const route = useRoute()

const activeTab = ref<'oneway' | 'roundtrip' | 'multi'>('roundtrip')

const state = ref('default') // "default" | "loading" | "result"

// Store restored params from URL for passing to search box components
const restoredParams = ref<any>(null)

interface SharedData {
  isOpenBaggageInfoAndFeeRule?: boolean,
  isSearch?: boolean,
  fareRuleData?: any,
}

const sharedValue = inject<{ isOpenBaggageInfoAndFeeRule: boolean; isSearch: boolean; fareRuleData?: any }>('sharedValue')
const updateValue = inject<(val: SharedData) => void>('updateValue')

// Mobile search edit modal state
const isSearchEditModalOpen = ref(false)
function openSearchEditModal() {
  isSearchEditModalOpen.value = true
}
function closeSearchEditModal() {
  isSearchEditModalOpen.value = false
}

// Derive restoredParams from route.query (simplified - Phase 5)
// Watch route.query to update restoredParams for search box restoration
watch(() => route.query, (query) => {
  if (hasSearchParams(query)) {
    const searchParams = deserializeSearchParams(query)
    if (searchParams) {
      activeTab.value = searchParams.tripType
      restoredParams.value = searchParams
      updateValue?.({ isSearch: true })
    }
  } else {
    activeTab.value = 'roundtrip'
    restoredParams.value = null
    isSearchEditModalOpen.value = false
    updateValue?.({ isSearch: false })
  }
}, { immediate: true, deep: true })

// Build search params and navigate to route (simplified - Phase 5)
// Removed segment index management (handled by routes)
function buildSearchParamsAndNavigate(payload: any, tripType: 'oneway' | 'roundtrip' | 'multi') {
  const searchParams = extractSearchParamsFromRequest(payload, tripType)
  
  // Fill city names from location store
  if (searchParams.tripType === 'multi' && searchParams.segments) {
    searchParams.segments = searchParams.segments.map(seg => ({
      ...seg,
      departureCity: getCityName(seg.departureCityCode),
      arrivalCity: getCityName(seg.arrivalCityCode),
    }))
  } else {
    searchParams.departureCity = getCityName(searchParams.departureCityCode)
    searchParams.arrivalCity = getCityName(searchParams.arrivalCityCode)
  }
  
  // Add filter preferences
  if (payload.carrierId) {
    searchParams.airlineCode = payload.carrierId
    const airline = airlineStore.airlines.find((a: any) => a.iataCode === payload.carrierId)
    if (airline) {
      searchParams.airlineName = (airline as any).nameZhTw
    }
  }
  if (payload.cabinId) {
    const cabinMap: Record<string, string> = {
      'M': '經濟艙',
      'W': '豪華經濟艙',
      'C': '商務艙',
      'F': '頭等艙'
    }
    searchParams.cabinClass = cabinMap[payload.cabinId] || '艙等不限'
  }
  if (payload.isNonStopFlight) {
    searchParams.nonStop = true
  }
  
  // Clear selectedRefs for new search (user is starting a new search, not continuing previous)
  searchParams.selectedRefs = undefined
  
  // Clear stored segments from sessionStorage for new search
  const searchRequest = buildSearchRequest(searchParams)
  clearStoredSegments(tripType, searchRequest)
  
  const query = serializeSearchParams(searchParams)
  
  // Navigate to appropriate route (segment index handled by route structure)
  let routeName: string
  let routeParams: Record<string, string> | undefined
  
  if (tripType === 'oneway') {
    routeName = 'search-oneway'
  } else if (tripType === 'roundtrip') {
    routeName = 'search-outbound'
  } else if (tripType === 'multi') {
    routeName = 'search-segment'
    routeParams = { index: '0' }
  } else {
    router.push({ path: '/', query })
    return
  }
  
  router.push({
    name: routeName,
    params: routeParams,
    query
  })
}

function getCityName(code?: string): string {
  if (!code) return ''
  
  for (const location of locationStore.locations) {
    const airport = location.airports?.find((a: any) => a.iataCode === code)
    if (airport) {
      return airport.cityNameZhTw || code
    }
  }
  
  return code
}

async function handleRoundSearch(payload: any) {
  // 清除舊的訂票資料，避免從單程切到來回時，帶有舊的單程資料
  bookingStore.clearBookingInfo()
  
  updateValue?.({ isSearch: true })
  
  // Fetch data first, show loading skeleton on home page
  await flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  // Navigate to route only after data is loaded
  buildSearchParamsAndNavigate(payload, 'roundtrip')
}

function handleRoundSearchFromModal(payload: any) {
  handleRoundSearch(payload)
  closeSearchEditModal()
}

async function handleSingleSearch(payload: any) {
  // 清除舊的訂票資料，避免從來回切到單程時，帶有舊的回程資料
  bookingStore.clearBookingInfo()
  
  updateValue?.({ isSearch: true })
  
  // Fetch data first, show loading skeleton on home page
  await flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  // Navigate to route only after data is loaded
  buildSearchParamsAndNavigate(payload, 'oneway')
}

function handleSingleSearchFromModal(payload: any) {
  handleSingleSearch(payload)
  closeSearchEditModal()
}

async function handleMultiSearch(payload: any) {
  // 清除舊的訂票資料，避免從其他行程類型切到多行程時，帶有舊資料
  bookingStore.clearBookingInfo()
  
  updateValue?.({ isSearch: true })
  
  // Fetch data first, show loading skeleton on home page
  await flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  // Navigate to route only after data is loaded
  buildSearchParamsAndNavigate(payload, 'multi')
}

function handleMultiSearchFromModal(payload: any) {
  handleMultiSearch(payload)
  closeSearchEditModal()
}

</script>
