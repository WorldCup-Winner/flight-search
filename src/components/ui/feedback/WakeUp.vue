<template>
  <div class="fixed inset-0 z-50 top-0 bg-black/20 w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="flex flex-col items-center justify-center w-[400px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8">
        <img :src="WakeUp" />
        <h3 class="text-others-gray1 text-h3 md:text-h3-d">閒置時間過長</h3>
        <p class="text-others-gray1 text-center">為確保取得最新票價和機位資訊，網頁將重新整理</p>
        <button
          class="mt-6 px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
          @click="handleConfirm"
        >
          確認
        </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { useFlightSearchStore } from '@/stores/flightSearch'
import { useAirlineStore } from '@/stores/airline'
import { deserializeSearchParams, buildSearchRequest, serializeSearchParams } from '@/utils/urlParamsSync'
import { clearStoredSegments } from '@/utils/segmentStorage'
import WakeUp from "@/assets/imgs/icon-wake-up.svg"

const props = defineProps<{
  closeModal: () => void
}>()

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()
const flightSearchStore = useFlightSearchStore()
const airlineStore = useAirlineStore()

function handleConfirm() {
  // Close modal
  props.closeModal()
  
  // Get search params
  bookingStore.getBookingData()
  let searchParams = null
  
  // Try to get from route query first (if on search page)
  searchParams = deserializeSearchParams(route.query)
  
  // If not in route, get from bookingStore (if on booking page)
  if (!searchParams && bookingStore.searchParams) {
    searchParams = {
      tripType: bookingStore.searchParams.tripType,
      departureCity: bookingStore.searchParams.departureCity,
      arrivalCity: bookingStore.searchParams.arrivalCity,
      departureCityCode: bookingStore.searchParams.departureCityCode,
      arrivalCityCode: bookingStore.searchParams.arrivalCityCode,
      departureDate: bookingStore.searchParams.departureDate,
      returnDate: bookingStore.searchParams.returnDate,
      adults: bookingStore.searchParams.adults,
      children: bookingStore.searchParams.children,
      infants: bookingStore.searchParams.infants,
      selectedRefs: undefined
    }
  }
  
  if (!searchParams) {
    // No search params, just go home
    router.push({ name: 'home', query: {} })
    return
  }
  
  // Clear selectedRefs for fresh search
  searchParams.selectedRefs = undefined
  
  // Clear old data (shows skeleton immediately)
  bookingStore.clearBookingInfo()
  flightSearchStore.reset()
  
  // Build search request
  const searchRequest = buildSearchRequest(searchParams)
  clearStoredSegments(searchParams.tripType, searchRequest)
  
  // Determine route name
  const routeName = searchParams.tripType === 'roundtrip' ? 'search-outbound' 
    : searchParams.tripType === 'multi' ? 'search-segment' 
    : 'search-oneway'
  
  // Navigate to search route if not already there
  const isSearchRoute = route.name?.toString().startsWith('search-')
  if (!isSearchRoute) {
    const query = serializeSearchParams(searchParams)
    router.push({
      name: routeName,
      params: searchParams.tripType === 'multi' ? { index: '0' } : {},
      query
    })
  }
  
  // Directly trigger API call (this is the key!)
  // This bypasses all watch logic and just fetches fresh data
  flightSearchStore.fetchFlightSearch(searchRequest)
  airlineStore.fetchAirlineAlliance()
}
</script>