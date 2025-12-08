<template>
  <div :class="sharedValue?.isSearch ? 'md:mt-60' : 'mt-80 md:mt-60'">
    <div
      class="relative flex items-center justify-center px-4 md:px-0"
      :class="[{ 'hidden md:flex': sharedValue?.isSearch && flightSearchStore.loading === 'success' }]"
    >
      <SearchPanel
        :active-tab="activeTab as any"
        :restored-params="restoredParams"
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
      <template v-else-if="flightSearchStore.loading === 'loading'">
        <div class="relative">
          <SearchResultLoading v-model="state" :rows="11" :speed="1300" />
          <FlightSearchLoading />
        </div>
      </template>
      <ResultsMain
        v-else-if="flightSearchStore.loading === 'success'"
        :data="flightSearchStore.data"
        :tripType="activeTab"
        :searchRequest="currentSearchRequest"
        :currentSegmentIndex="currentSegmentIndex"
        :selectedSegments="selectedSegments"
        @searchNextSegment="handleSearchNextSegment"
        @edit-search="openSearchEditModal"
      />
    </div>
    
    <Transition name="fade">
        <BaggageInfoAndFeeRule 
          :open="sharedValue?.isOpenBaggageInfoAndFeeRule" 
          :fareRuleData="sharedValue?.fareRuleData"
          @close="updateValue?.({ isOpenBaggageInfoAndFeeRule: false, fareRuleData: undefined })" 
        />
    </Transition>

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
import { inject, ref, onMounted, watch } from 'vue'
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
import ResultsMain from '@/components/search/ResultsMain.vue';
import BaggageInfoAndFeeRule from '@/components/ui/booking/BaggageInfoAndFeeRule.vue'
import { useAirlineStore } from '@/stores/airline'
import { 
  serializeSearchParams, 
  deserializeSearchParams, 
  buildSearchRequest,
  extractSearchParamsFromRequest,
  hasSearchParams
} from '@/utils/urlParamsSync'

// Store
const flightSearchStore = useFlightSearchStore()
const bookingStore = useBookingStore()
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

const router = useRouter()
const route = useRoute()

const activeTab = ref<'oneway' | 'roundtrip' | 'multi'>('roundtrip')

const state = ref('default') // "default" | "loading" | "result"

// Store the current search request to pass to ResultsMain
const currentSearchRequest = ref<any>(null)
// Track which segment we're currently viewing (0-based index)
const currentSegmentIndex = ref(0)
// Store selected flight segments across segment changes
const selectedSegments = ref<any[]>([])

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

// Function to restore search from URL params
function restoreSearchFromUrl() {
  if (hasSearchParams(route.query)) {
    console.log('Restoring search from URL params:', route.query)
    const searchParams = deserializeSearchParams(route.query)
    
    if (searchParams) {
      // Set active tab
      activeTab.value = searchParams.tripType
      
      // Store params for child components
      restoredParams.value = searchParams
      
      // Build search request
      const payload = buildSearchRequest(searchParams)
      currentSearchRequest.value = payload
      const targetSegmentIndex = searchParams.currentSegmentIndex || 0
      
      // Restore selected refs if present
      if (searchParams.selectedRefs && searchParams.selectedRefs.length > 0) {
        payload.selectedRefNumbers = searchParams.selectedRefs.map(ref => parseInt(ref))
      }
      
      console.log('Restored search request:', payload)
      console.log('Target segment index:', targetSegmentIndex, 'Current:', currentSegmentIndex.value)
      
      // If segment index decreased (e.g., going back), clear selectedSegments beyond the target index
      if (targetSegmentIndex < currentSegmentIndex.value) {
        console.log('Segment index decreased, clearing selectedSegments beyond index:', targetSegmentIndex)
        selectedSegments.value = selectedSegments.value.slice(0, targetSegmentIndex)
      }
      
      // Check if we need to fetch (segment index changed or initial load)
      const shouldFetch = currentSegmentIndex.value !== targetSegmentIndex || !flightSearchStore.data
      
      // Update segment index
      currentSegmentIndex.value = targetSegmentIndex
      
      // Fetch flight search if needed
      if (shouldFetch) {
        console.log('Fetching flight search for segment:', targetSegmentIndex)
        flightSearchStore.fetchFlightSearch(payload)
        airlineStore.fetchAirlineAlliance()
      }
      
      updateValue?.({ isSearch: true })
    }
  } else {
    // No URL params, clear restored params
    restoredParams.value = null
  }
}

// Restore search from URL on mount
onMounted(() => {
  restoreSearchFromUrl()
})

// Watch route.query changes to restore when navigating back
watch(() => route.query, (newQuery, oldQuery) => {
  // Only restore if query actually changed (avoid infinite loops)
  if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
    console.log('Route query changed, restoring search')
    restoreSearchFromUrl()
  }
}, { deep: true })

function updateUrlParams(payload: any, tripType: 'oneway' | 'roundtrip' | 'multi') {
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
  
  searchParams.currentSegmentIndex = currentSegmentIndex.value
  
  // Add selected refs if available
  if (payload.selectedRefNumbers && payload.selectedRefNumbers.length > 0) {
    searchParams.selectedRefs = payload.selectedRefNumbers.map((ref: number) => String(ref))
  }
  
  // Add filter preferences
  if (payload.carrierId) {
    searchParams.airlineCode = payload.carrierId
    // Try to get airline name from store
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
  
  const query = serializeSearchParams(searchParams)
  
  // Use router.push to add to browser history for proper back/forward navigation
  router.push({ path: '/', query })
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

function handleRoundSearch(payload: any) {
  console.log('handleRoundSearch:', payload)
  // 清除舊的訂票資料，避免從單程切到來回時，帶有舊的單程資料
  bookingStore.clearBookingInfo()
  sessionStorage.setItem('bookingStep', '2')
  
  currentSearchRequest.value = payload
  currentSegmentIndex.value = 0 // Reset to first segment
  selectedSegments.value = [] // Clear selected segments for new search
  flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  // Update URL params
  updateUrlParams(payload, 'roundtrip')
  
  updateValue?.({ isSearch: true })
}

function handleRoundSearchFromModal(payload: any) {
  handleRoundSearch(payload)
  closeSearchEditModal()
}

function handleSingleSearch(payload: any) {
  console.log('handleSingleSearch:', payload)
  // 清除舊的訂票資料，避免從來回切到單程時，帶有舊的回程資料
  bookingStore.clearBookingInfo()
  sessionStorage.setItem('bookingStep', '2')
  
  currentSearchRequest.value = payload
  currentSegmentIndex.value = 0 // Single trip, always 0
  selectedSegments.value = [] // Clear selected segments for new search
  flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()

  // Update URL params
  updateUrlParams(payload, 'oneway')

  updateValue?.({ isSearch: true })
}

function handleSingleSearchFromModal(payload: any) {
  handleSingleSearch(payload)
  closeSearchEditModal()
}

function handleMultiSearch(payload: any) {
  console.log('handleMultiSearch:', payload)
  // 清除舊的訂票資料，避免從其他行程類型切到多行程時，帶有舊資料
  bookingStore.clearBookingInfo()
  // 重置訂票步驟
  sessionStorage.setItem('bookingStep', '2')
  
  currentSearchRequest.value = payload
  currentSegmentIndex.value = 0 // Reset to first segment
  selectedSegments.value = [] // Clear selected segments for new search
  flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  // Update URL params
  updateUrlParams(payload, 'multi')
  
  updateValue?.({ isSearch: true })
}

function handleMultiSearchFromModal(payload: any) {
  handleMultiSearch(payload)
  closeSearchEditModal()
}

// Handle next segment search for round-trip or multi-trip
function handleSearchNextSegment(payload: { selectedRefNumbers: number[]; selectedSegments?: any[] }) {
  console.log('handleSearchNextSegment:', payload)
  
  // Store selected segments if provided
  if (payload.selectedSegments && payload.selectedSegments.length > 0) {
    selectedSegments.value = payload.selectedSegments
    console.log('Selected segments stored in FlightSearchBox:', selectedSegments.value)
  }
  
  if (currentSearchRequest.value) {
    // Update the search request with selectedRefNumbers
    const updatedRequest = {
      ...currentSearchRequest.value,
      selectedRefNumbers: payload.selectedRefNumbers
    }
    
    // Increment segment index
    currentSegmentIndex.value += 1
    
    console.log('Fetching next segment with:', updatedRequest)
    console.log('Current segment index:', currentSegmentIndex.value)
    flightSearchStore.fetchFlightSearch(updatedRequest)
    
    // Update URL params with new selected refs and segment index
    const tripType = activeTab.value as 'oneway' | 'roundtrip' | 'multi'
    updateUrlParams(updatedRequest, tripType)
  }
}
</script>
