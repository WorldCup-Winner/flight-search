<template>
  <main>
    <!-- Hero section (desktop only on search pages) -->
    <div class="hidden md:block">
      <HeroSection />
    </div>
    
    <!-- Search box (always visible) -->
    <div :class="sharedValue.isSearch ? 'md:mt-60' : 'mt-80 md:mt-60'">
      <div
        class="relative flex items-center justify-center px-4 md:px-0"
        :class="[{ 'hidden md:flex': sharedValue?.isSearch && flightSearchStore.loading !== 'default' }]"
      >
        <SearchPanel
          :active-tab="activeTab as any"
          :restored-params="restoredParams"
          instance-id="search-view"
          @update:activeTab="val => (activeTab = val)"
          @roundtrip-search="handleRoundSearch"
          @oneway-search="handleSingleSearch"
          @multi-search="handleMultiSearch"
        />
      </div>
      
      <!-- Results or Summary (router-view) -->
      <div>
        <router-view />
      </div>
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
  </main>
</template>

<script setup lang="ts">
import { ref, provide, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useFlightSearchStore } from '@/stores/flightSearch'
import { useBookingStore } from '@/stores/booking'
import { useLocationStore } from '@/stores/location'
import { useAirlineStore } from '@/stores/airline'

import HeroSection from '@/components/home/HeroSection.vue'
import SearchPanel from '@/components/home/SearchPanel.vue'
import SearchEditModal from '@/components/ui/modals/SearchEditModal.vue'
import BaggageInfoAndFeeRule from '@/components/ui/booking/BaggageInfoAndFeeRule.vue'
import { 
  serializeSearchParams, 
  deserializeSearchParams, 
  buildSearchRequest,
  extractSearchParamsFromRequest,
  hasSearchParams
} from '@/utils/urlParamsSync'
import { clearStoredSegments } from '@/utils/segmentStorage'

// Stores
const flightSearchStore = useFlightSearchStore()
const bookingStore = useBookingStore()
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

const router = useRouter()
const route = useRoute()

// State
const activeTab = ref<'oneway' | 'roundtrip' | 'multi'>('roundtrip')
const restoredParams = ref<any>(null)
const isSearchEditModalOpen = ref(false)

// Shared state (for BaggageInfoAndFeeRule)
interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean
  isSearch: boolean
  fareRuleData?: any
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false,
  isSearch: false,
  fareRuleData: undefined,
})

function updateValue(val: Partial<SharedData>) {
  sharedValue.value = { ...sharedValue.value, ...val }
}

provide('sharedValue', sharedValue)
provide<(val: Partial<SharedData>) => void>('updateValue', updateValue)
// Provide edit modal function for ResultsMain (route component)
provide('openSearchEditModal', openSearchEditModal)

// Derive restoredParams from route query
watch(() => route.query, (query) => {
  if (hasSearchParams(query)) {
    const searchParams = deserializeSearchParams(query)
    if (searchParams) {
      activeTab.value = searchParams.tripType
      restoredParams.value = searchParams
      sharedValue.value.isSearch = true
    }
  } else {
    restoredParams.value = null
    sharedValue.value.isSearch = false
  }
}, { immediate: true, deep: true })

// Mobile search edit modal
function openSearchEditModal() {
  isSearchEditModalOpen.value = true
}

function closeSearchEditModal() {
  isSearchEditModalOpen.value = false
}

// Helper function to get city name from code
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

// Search handlers - navigate to appropriate route
function handleRoundSearch(payload: any) {
  bookingStore.clearBookingInfo()
  
  // Reset flight search store to clear old data and show skeletons immediately
  flightSearchStore.reset()
  
  const searchParams = extractSearchParamsFromRequest(payload, 'roundtrip')
  
  // Fill city names from location store
  searchParams.departureCity = getCityName(searchParams.departureCityCode)
  searchParams.arrivalCity = getCityName(searchParams.arrivalCityCode)
  
  // Clear selectedRefs for new search (user is starting a new search, not continuing previous)
  searchParams.selectedRefs = undefined
  
  // Clear stored segments from sessionStorage for new search
  const searchRequest = buildSearchRequest(searchParams)
  clearStoredSegments('roundtrip', searchRequest)
  
  const query = serializeSearchParams(searchParams)
  
  router.push({
    name: 'search-outbound',
    query
  })
}

function handleRoundSearchFromModal(payload: any) {
  handleRoundSearch(payload)
  closeSearchEditModal()
}

function handleSingleSearch(payload: any) {
  bookingStore.clearBookingInfo()
  
  // Reset flight search store to clear old data and show skeletons immediately
  flightSearchStore.reset()
  
  const searchParams = extractSearchParamsFromRequest(payload, 'oneway')
  
  // Fill city names from location store
  searchParams.departureCity = getCityName(searchParams.departureCityCode)
  searchParams.arrivalCity = getCityName(searchParams.arrivalCityCode)
  
  // Clear selectedRefs for new search (user is starting a new search, not continuing previous)
  searchParams.selectedRefs = undefined
  
  // Clear stored segments from sessionStorage for new search
  const searchRequest = buildSearchRequest(searchParams)
  clearStoredSegments('oneway', searchRequest)
  
  const query = serializeSearchParams(searchParams)
  
  router.push({
    name: 'search-oneway',
    query
  })
}

function handleSingleSearchFromModal(payload: any) {
  handleSingleSearch(payload)
  closeSearchEditModal()
}

function handleMultiSearch(payload: any) {
  bookingStore.clearBookingInfo()
  
  // Reset flight search store to clear old data and show skeletons immediately
  flightSearchStore.reset()
  
  const searchParams = extractSearchParamsFromRequest(payload, 'multi')
  
  // Fill city names from location store
  if (searchParams.segments) {
    searchParams.segments = searchParams.segments.map(seg => ({
      ...seg,
      departureCity: getCityName(seg.departureCityCode),
      arrivalCity: getCityName(seg.arrivalCityCode),
    }))
  }
  
  // Clear selectedRefs for new search (user is starting a new search, not continuing previous)
  searchParams.selectedRefs = undefined
  
  // Clear stored segments from sessionStorage for new search
  const searchRequest = buildSearchRequest(searchParams)
  clearStoredSegments('multi', searchRequest)
  
  const query = serializeSearchParams(searchParams)
  
  router.push({
    name: 'search-segment',
    params: { index: '0' },
    query
  })
}

function handleMultiSearchFromModal(payload: any) {
  handleMultiSearch(payload)
  closeSearchEditModal()
}

// Expose edit modal function for child components
defineExpose({
  openSearchEditModal
})
</script>

