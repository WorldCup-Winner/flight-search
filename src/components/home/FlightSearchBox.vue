<template>
  <div :class="[ sharedValue?.isSearch ? 'mt-60' : 'mt-80 ' ]">
    <div class="relative flex items-center justify-center px-4 md:px-0">
      <div class="bg-white rounded-t-3xl md:rounded-2xl md:rounded-br-none shadow-2xl p-4 md:p-8 md:px-14 w-full mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-0">
          <!-- Title -->
          <h1 class="text-h3 md:text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

          <!-- Tab Navigation -->
          <div class="flex space-x-2 justify-center  px-2 md:px-4 py-2 md:py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
            <button @click="activeTab = 'roundtrip'" :class="[
              'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
              activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">來回</button>
            <button @click="activeTab = 'oneway'" :class="[
              'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
              activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">單程</button>
            <button @click="activeTab = 'multi'" :class="[
              'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
              activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">多行程</button>
          </div>
        </div>
        <div v-if="activeTab == 'roundtrip'">
          <RoundSearchBox 
            @search="handleRoundSearch"
            :initialParams="restoredParams"
          />
        </div>
        <div v-else-if="activeTab === 'oneway'">
          <SingleSearchBox 
            @search="handleSingleSearch"
            :initialParams="restoredParams"
          />
        </div>
        <div v-else-if="activeTab === 'multi'">
          <MultiSearchBox 
            @search="handleMultiSearch"
            :initialParams="restoredParams"
          />
        </div>
      </div>
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
      />
    </div>
    
    <Transition name="fade">
        <BaggageInfoAndFeeRule 
          :open="sharedValue?.isOpenBaggageInfoAndFeeRule" 
          :fareRuleData="sharedValue?.fareRuleData"
          @close="updateValue?.({ isOpenBaggageInfoAndFeeRule: false, fareRuleData: undefined })" 
        />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFlightSearchStore } from '@/stores/flightSearch'
import { useBookingStore } from '@/stores/booking'
import { useLocationStore } from '@/stores/location'

import MultiSearchBox from '@/components/home/MultiSearchBox.vue'
import SingleSearchBox from '@/components/home/SingleSearchBox.vue'
import RoundSearchBox from "@/components/home/RoundSearchBox.vue"
import RecommendedTrips from '@/components/home/RecommendedTrips.vue'
import BannerImg from '@/components/home/BannerImg.vue'
import FlightSearchLoading from '@/components/ui/FlightSearchLoading.vue'
import SearchResultLoading from '@/components/ui/SearchResultLoading.vue'
import ResultsMain from '@/components/search/ResultsMain.vue';
import BaggageInfoAndFeeRule from '@/components/ui/BaggageInfoAndFeeRule.vue'
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

const activeTab = ref('roundtrip')

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
<style scoped>
/* subtle entrance for the small modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all .15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
