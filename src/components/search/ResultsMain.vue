<template>
  <div class="mx-auto max-w-6xl mt-24 px-4 md:px-0 pb-6">
    <div class="grid grid-cols-12 gap-3">
      <!-- SIDEBAR (Desktop only) -->
      <aside class="hidden md:block md:col-span-3">
        <FilterSideBar
          :stopsPricing="stopsPricing"
          :alliances="alliances"
          :airlines="airlines"
          :depAirports="depAirports"
          :arrAirports="arrAirports"
          @update:filters="onFiltersChange"
        />
      </aside>

      <!-- MAIN -->
      <section class="col-span-12 md:col-span-9">
        <!-- Round-trip mobile: HeaderStrip + HeaderStripSummary side by side (force same height) -->
        <div v-if="tripType === 'roundtrip'" class="md:hidden flex gap-2 mb-4 min-w-0 items-stretch">
          <!-- Show skeleton for HeaderStrip only when main loading (fetching outbound/return results) -->
          <template v-if="flightSearchStore.loading === 'loading'">
            <!-- Skeleton for HeaderStrip (flex-1) -->
            <div class="flex-1 min-w-0 h-[100px] bg-gray-200 rounded-[10px] animate-pulse"></div>
            <!-- Skeleton for HeaderStripSummary (w-[100px]) -->
            <div class="w-[100px] h-[100px] bg-gray-200 rounded-[10px] animate-pulse"></div>
          </template>
          <template v-else>
            <!-- Make wrapper a flex container so HeaderStrip can stretch -->
            <div :class="[currentLeg === 'outbound' ? 'order-1' : 'order-2', 'flex-1 min-w-0 flex items-stretch']">
              <HeaderStrip
                class="w-full h-full"
                :current-leg="currentLeg"
                :segment-title="segmentTitle"
                :date-text="dateText"
                :origin="origin"
                :destination="destination"
                :total-count="totalCount"
                :no-margin="true"
                @edit-segment="handleEditSegment"
              />
            </div>
            <HeaderStripSummary
              class="h-full"
              :current-leg="currentLeg"
              :class="currentLeg === 'outbound' ? 'order-2' : 'order-1'"
              :segment-title="summaryData?.segmentTitle || (currentLeg === 'outbound' ? '回程' : '去程')"
              :time-range="summaryData?.timeRange || null"
              :price="summaryData?.price || null"
              :currency="summaryData?.currency || 'TWD'"
              :no-margin="true"
              :is-loading="roundTripSummary.isLoadingReturn.value && currentLeg === 'outbound'"
              :is-clickable="tripType === 'roundtrip' && !(roundTripSummary.isLoadingReturn.value && currentLeg === 'outbound')"
              @click="handleHeaderStripSummaryClick"
            />
          </template>
        </div>

        <!-- HEADER STRIP (Desktop and non-roundtrip mobile) -->
        <!-- Show skeleton during main loading (not background return fetch) -->
        <template v-if="flightSearchStore.loading === 'loading' && tripType !== 'roundtrip'">
          <div
            v-for="item in headerItems"
            :key="`skeleton-${item.key}`"
            :class="[
              !item.showOnDesktop ? 'md:hidden' : '',
              !item.showOnMobile ? 'hidden md:block' : ''
            ]"
          >
            <div class="h-[100px] bg-gray-200 rounded-[10px] animate-pulse mb-4"></div>
          </div>
        </template>
        <template v-else-if="flightSearchStore.loading === 'loading' && tripType === 'roundtrip'">
          <!-- Roundtrip desktop: Show skeleton for HeaderStrip during main loading -->
          <div
            v-for="item in headerItems"
            :key="`skeleton-${item.key}`"
            :class="[
              tripType === 'roundtrip' ? 'hidden md:block' : '',
              !item.showOnDesktop ? 'md:hidden' : '',
              !item.showOnMobile ? 'hidden md:block' : ''
            ]"
          >
            <div class="h-[100px] bg-gray-200 rounded-[10px] animate-pulse mb-4"></div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in headerItems"
            :key="item.key"
            :class="[
              tripType === 'roundtrip' ? 'hidden md:block' : '',
              !item.showOnDesktop ? 'md:hidden' : '',
              !item.showOnMobile ? 'hidden md:block' : ''
            ]"
          >
            <HeaderStrip
              :current-leg="item.currentLeg"
              :segment-title="item.segmentTitle"
              :date-text="item.dateText"
              :origin="item.origin"
              :destination="item.destination"
              :total-count="totalCount"
              @edit-segment="handleEditSegment"
            />
          </div>
        </template>

        <!-- SORT BAR -->
        <div class="mb-4">
          <!-- Show skeleton for SortBar only when main loading (not background return fetch) -->
          <div v-if="flightSearchStore.loading === 'loading'" class="bg-white px-4 py-3 drop-shadow-[0px_2px_10px_rgba(0,0,0,0.15)] rounded-[10px]">
            <div class="flex items-center justify-between md:hidden">
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div class="flex items-center gap-3">
                <div class="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div class="hidden md:flex md:flex-wrap md:items-center md:gap-4">
              <div class="h-10 w-24 bg-gray-200 rounded-[10px] animate-pulse"></div>
              <div class="h-10 w-24 bg-gray-200 rounded-[10px] animate-pulse"></div>
              <div class="h-10 w-24 bg-gray-200 rounded-[10px] animate-pulse"></div>
              <div class="h-10 w-24 bg-gray-200 rounded-[10px] animate-pulse"></div>
              <div class="h-10 w-32 bg-gray-200 rounded-[10px] animate-pulse ml-auto"></div>
            </div>
          </div>
          <!-- Show actual SortBar when not main loading -->
          <SortBar
            v-else
            :total-count="totalCount"
            :active-filter-count="activeFilterCount"
            :sort="sort"
            :tax-mode="taxMode"
            @sort-click="handleSortClick"
            @filter-click="handleFilterClick"
            @sort-change="setSort"
            @sort-toggle="toggleSort"
            @update:taxMode="handleTaxModeChange"
          />
        </div>
        
        <!-- LOADING MODAL: Show when main loading (not background return fetch) -->
        <FlightSearchLoading v-if="flightSearchStore.loading === 'loading'" />
        
        <!-- LOADING STATE: Show skeleton flight cards only when main loading (not background return fetch) -->
        <div v-if="flightSearchStore.loading === 'loading'" class="space-y-4">
          <div
            v-for="n in 5"
            :key="`skeleton-${n}`"
            class="rounded-[10px] bg-white shadow-2xl p-4 animate-pulse"
          >
            <div class="flex items-center gap-4">
              <div class="h-10 w-10 rounded-lg bg-gray-200 shrink-0"></div>
              <div class="flex-1 grid grid-cols-12 gap-3">
                <div class="col-span-12 md:col-span-6 space-y-2">
                  <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
                <div class="hidden md:block md:col-span-3 space-y-2">
                  <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div class="hidden md:block md:col-span-3">
                  <div class="h-8 w-full bg-gray-200 rounded-xl"></div>
                </div>
              </div>
              <div class="md:hidden w-16">
                <div class="h-8 w-full bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESULTS LIST -->
        <div v-else-if="shownFlights.length >= 1" class="space-y-4 relative isolate">
          <TransitionGroup appear>
            <FlightResultCard
              v-for="(it, i) in shownFlights" :key="it.refNumber"
              v-bind="it"
              :style="{ transitionDelay: i * 100 + 'ms' }"
              :leg="currentLeg"
              :trip-type="tripType"
              :price-from="displayPrice(it)"
              :tax-mode="taxMode"
              :tax-amount="it.taxAmount"
              :round-trip-included="tripType === 'roundtrip'"
              :adult-count="searchRequest?.adultCount ?? 1"
              :child-count="searchRequest?.childCount ?? 0"
              :baby-count="searchRequest?.babyCount ?? 0"
              :previous-segments="selectedSegments"
              :is-selected="selectedCardRefNumber !== null && selectedCardRefNumber === it.refNumber"
              currency="TWD"
              @select="handleSelect"
              @purchase="onPurchase"
              @card-click="handleCardClick(it)"
            />
          </TransitionGroup>
        </div>

        <!-- LOAD MORE -->
        <div v-if="canLoadMore && shownFlights.length >= 1 && flightSearchStore.loading === 'success'" class="py-8 text-center">
          <div class="inline-flex items-center gap-3 text-others-original font-bold">
            <span>更多航班訊息載入中</span>
            <img src="@/assets/imgs/icon-loading.svg" class="animate-spin-slow w-8 h-8" alt="Loading" />
          </div>
        </div>
        
        <!-- NO DATA (only show when loading is complete and no flights) -->
        <div v-if="flightSearchStore.loading === 'success' && shownFlights.length <= 0">
          <SorryNoData />
        </div>
      </section>
    </div>

    <!-- Filter Modal (Mobile only) - Full height like DatePicker -->
    <transition name="fade-scale">
      <div
        v-if="isFilterModalOpen"
        class="fixed inset-0 z-[100] bg-black/40 md:hidden overflow-hidden"
        @click.self="isFilterModalOpen = false"
      >
        <div class="flex flex-col h-full w-full bg-white overflow-hidden shadow-2xl">
          <!-- Modal Header -->
          <div class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0 z-20">
            <span>篩選</span>
            <button
              class="text-white hover:opacity-80 transition"
              @click="isFilterModalOpen = false"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- FilterSideBar Content -->
          <div class="flex-1 overflow-y-auto min-h-0 px-4">
            <FilterSideBar
              ref="filterSideBarRef"
              :stopsPricing="stopsPricing"
              :alliances="alliances"
              :airlines="airlines"
              :depAirports="depAirports"
              :arrAirports="arrAirports"
              :initial="filterInitialState"
              :confirm-mode="true"
              @confirm="handleFilterConfirm"
            />
          </div>

          <!-- Footer: Confirm Button (Mobile only) -->
          <div class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10 rounded-t-[20px]" style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);">
            <button
              class="w-full py-3 rounded-xl font-bold text-white transition bg-others-original hover:bg-others-hover"
              @click="filterSideBarRef?.confirm()"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Sort Modal (Mobile only) - Bottom sheet like LocationPicker -->
    <SortModal
      :open="isSortModalOpen"
      :sort="sort"
      @close="isSortModalOpen = false"
      @select="handleSortOptionClick"
    />

    <!-- Mobile Card Click Modal (FlightActionModal - initial modal with price + buttons) -->
    <FlightActionModal
      v-if="selectedCardData"
      :open="selectedCardRefNumber !== null && !isFlightInfoModalOpen && !isMobileBookingLoading"
      :price-total="displayPrice(selectedCardData)"
      :currency-display="'TWD'"
      :tax-mode="taxMode"
      :tax-amount="selectedCardData.taxAmount"
      :is-last-step="isLastStep"
      @close="selectedCardRefNumber = null; isFlightInfoModalOpen = false"
      @flight-info="handleCardModalFlightInfo"
      @next-step="handleFlightInfoNextStep"
    />

    <!-- Mobile Flight Info Modal (triggered by 航班資訊 button - shows full flight details) -->
    <FlightInfoModal
      v-if="selectedCardData"
      :open="isFlightInfoModalOpen"
      :sectors="selectedCardData.sectors || []"
      :trip-type="tripType"
      :price-total="displayPrice(selectedCardData)"
      :currency-display="'TWD'"
      :tax-mode="taxMode"
      :tax-amount="selectedCardData.taxAmount"
      :is-last-step="isLastStep"
      @close="isFlightInfoModalOpen = false"
      @next-step="handleFlightInfoNextStep"
    />

    <!-- Mobile booking loading overlay (reuse global flight search loading style) -->
    <transition name="fade">
      <FlightSearchLoading v-if="isMobileBookingLoading" />
    </transition>

    <!-- Inactivity timeout modal -->
    <transition name="fade">
      <WakeUp v-if="showWakeUp" :close-modal="closeWakeUpModal" />
    </transition>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFlightSearchStore } from '@/stores/flightSearch'

import { timeToMin, inWindow } from '@/utils'
import type { CardRow } from '@/utils/types'

import FlightResultCard from '@/components/search/FlightResultCard.vue'
import FilterSideBar from '@/components/search/FilterSideBar.vue'
import HeaderStrip from '@/components/search/HeaderStrip.vue'
import HeaderStripSummary from '@/components/search/HeaderStripSummary.vue'
import SortBar from '@/components/search/SortBar.vue'
import SortModal from '@/components/ui/modals/SortModal.vue'
import FlightActionModal from '@/components/ui/modals/FlightActionModal.vue'
import FlightInfoModal from '@/components/ui/modals/FlightInfoModal.vue'
import FlightSearchLoading from '@/components/ui/loading/FlightSearchLoading.vue'
import SorryNoData from '@/components/ui/feedback/SorryNoData.vue'
import WakeUp from '@/components/ui/feedback/WakeUp.vue'
import { useAirlineStore } from '@/stores/airline'
import { useBookingStore } from '@/stores/booking'
import { useLocationStore } from '@/stores/location'
import { useRoundTripSummary } from '@/composables/useRoundTripSummary'
import { useFlightFareRule } from '@/composables/useFlightFareRule'
import { rebuildSelectedSegments, storeSelectedSegment, createSearchHash } from '@/utils/segmentStorage'
import { deserializeSearchParams, serializeSearchParams } from '@/utils/urlParamsSync'
import { useFilterSortSync } from '@/composables/useFilterSortSync'
import { useInactivityTimeout } from '@/composables/useInactivityTimeout'

const airlineStore = useAirlineStore()
const locationStore = useLocationStore()
const flightSearchStore = useFlightSearchStore()
const router = useRouter()
const route = useRoute()

// ---------- Inactivity Timeout (15 minutes) ----------
const { showWakeUp, closeModal: closeWakeUpModal } = useInactivityTimeout()

// ---------- Filter, Sort, TaxMode (with URL sync) ----------
const {
  filters,
  sort,
  taxMode,
  filterInitialState,
  onFiltersChange,
  setSort,
  toggleSort,
  handleTaxModeChange,
  displayPrice,
  getFiltersForNavigation,
  getSortForNavigation,
  getTaxModeForNavigation
} = useFilterSortSync()

// ---------- Props (from route or direct usage) ----------
const props = defineProps<{
  tripType: 'oneway' | 'roundtrip' | 'multi'
  segmentIndex?: number // Current segment being displayed (0-based, from route or direct usage)
  searchRequest?: any // The original search request (from route or direct usage)
}>()

// ---------- Data Management ----------
// Data comes from store, not props
const flightData = computed(() => flightSearchStore.data)
const searchRequest = computed(() => props.searchRequest)

// Fetch when searchRequest changes (new segment or different selectedRefNumbers)
// Store the last fetched request signature to compare
const lastFetchedSignature = ref<string>('')

watch(
  () => [props.searchRequest, route.name, props.segmentIndex] as [any, string, number],
  ([newRequest, newRouteName, segmentIndex]) => {
    const isSearchRoute = route.name?.toString().startsWith('search-') ?? false
    if (!isSearchRoute || !newRequest) return
    
    // Create a signature from key fields that determine if we need a new fetch
    // Include search criteria to detect when user changes search parameters
    const selectedRefs = (newRequest.selectedRefNumbers || []).sort().join(',')
    const searchHash = createSearchHash(newRequest) // Includes departure, arrival, dates, passengers
    const currentSignature = `${segmentIndex}-${selectedRefs}-${searchHash}`
    
    // Skip if already fetching the same request (prevents duplicate calls)
    if (flightSearchStore.loading === 'loading') {
      if (currentSignature === lastFetchedSignature.value) {
        return // Already fetching this exact request
      }
    }
    
    // If data already exists and loading is complete, check if signature matches
    // Only skip fetch if signature matches (same search criteria + segment + selectedRefs)
    if (flightSearchStore.data.length > 0 && flightSearchStore.loading === 'success') {
      if (lastFetchedSignature.value === '') {
        // First time mounting, data already loaded by FlightSearchBox
        // Update signature without fetching
        lastFetchedSignature.value = currentSignature
        return
      }
      // If signature matches, data is already correct, no need to fetch
      if (currentSignature === lastFetchedSignature.value) {
        return
      }
    }
    
    // Fetch if:
    // 1. Store is empty (F5 refresh)
    // 2. Request signature changed (new segment/selectedRefs/search criteria)
    const needsFetch = 
      flightSearchStore.data.length === 0 || 
      currentSignature !== lastFetchedSignature.value
    
    if (needsFetch) {
      lastFetchedSignature.value = currentSignature
      
      // Clear data and set loading before fetch to show skeletons immediately
      flightSearchStore.data = []
      flightSearchStore.loading = 'loading'
      
      flightSearchStore.fetchFlightSearch(newRequest)
      airlineStore.fetchAirlineAlliance()
    } else {
      // Data already matches, just update signature to prevent re-fetch
      lastFetchedSignature.value = currentSignature
    }
  },
  { immediate: true }
)

// ---------- Header context (derived from flightData) ----------
const first = computed(() => flightData.value?.[0])

// Helper function to get city name from IATA code
const getCityInfoFromCode = (code: string): { code: string, name: string } => {
  if (!code) return { code: '', name: '' }
  
  // Try to find from location store
  for (const location of locationStore.locations) {
    const airport = location.airports?.find((a: any) => a.iataCode === code)
    if (airport) {
      return {
        code: airport.iataCode || code,
        name: airport.cityNameZhTw || code
      }
    }
  }
  
  return { code, name: code }
}

const dateText = computed(() => {
  // prefer itinerary-level date if provided, else first sector
  const d = first.value?.departureDate || first.value?.sectors?.[0]?.departureDate
  
  // Fallback to searchRequest when flightData is empty
  if (!d && props.searchRequest?.flightSegments) {
    const segmentIndex = props.segmentIndex ?? 0
    const segment = props.searchRequest.flightSegments[segmentIndex]
    return segment?.departureDate || ''
  }
  
  return d || ''
})

const origin = computed(() => {
  const code = first.value?.departureCityCode ?? first.value?.sectors?.[0]?.departureCityCode ?? ''
  const name = first.value?.departureCityName ?? first.value?.sectors?.[0]?.departureCityName ?? ''
  
  // Fallback to searchRequest when flightData is empty
  if (!code && props.searchRequest?.flightSegments) {
    const segmentIndex = props.segmentIndex ?? 0
    const segment = props.searchRequest.flightSegments[segmentIndex]
    if (segment?.departureLocation) {
      return getCityInfoFromCode(segment.departureLocation)
    }
  }
  
  return { code, name }
})

const destination = computed(() => {
  const code = first.value?.arrivalCityCode ?? first.value?.sectors?.slice(-1)?.[0]?.arrivalCityCode ?? ''
  const name = first.value?.arrivalCityName ?? first.value?.sectors?.slice(-1)?.[0]?.arrivalCityName ?? ''
  
  // Fallback to searchRequest when flightData is empty
  if (!code && props.searchRequest?.flightSegments) {
    const segmentIndex = props.segmentIndex ?? 0
    const segment = props.searchRequest.flightSegments[segmentIndex]
    if (segment?.arrivalLocation) {
      return getCityInfoFromCode(segment.arrivalLocation)
    }
  }
  
  return { code, name }
})

const tripType = computed(() => props.tripType);

// Determine leg label for a given segment index
function getLegForIndex(segmentIndex: number): 'outbound' | 'return' {
  if (props.tripType === 'roundtrip') {
    // For round trip: 0 = outbound, 1+ = return
    return segmentIndex === 0 ? 'outbound' : 'return'
  } else if (props.tripType === 'multi') {
    // For multi-trip: all but the last are outbound, last is return
    const totalSegments = props.searchRequest?.flightSegments?.length ?? 1
    return segmentIndex < totalSegments - 1 ? 'outbound' : 'return'
  } else {
    // For one-way: always treat as return (design choice)
    return 'return'
  }
}

// Determine current leg based on tripType and segmentIndex
const currentLeg = computed<'outbound' | 'return'>(() => {
  const segmentIndex = props.segmentIndex ?? 0
  return getLegForIndex(segmentIndex)
})

// Determine if this is the last step
const isLastStep = computed(() => {
  const segmentIndex = props.segmentIndex ?? 0
  if (tripType.value === 'roundtrip') {
    return segmentIndex === 1
  } else if (tripType.value === 'multi') {
    const totalSegments = props.searchRequest?.flightSegments?.length ?? 1
    return segmentIndex === totalSegments - 1
  } else {
    return true // Oneway: always last step
  }
})

// Generate segment title (for current header)
const segmentTitle = computed(() => {
  const segmentIndex = props.segmentIndex ?? 0
  
  if (props.tripType === 'roundtrip') {
    return segmentIndex === 0 ? '去程' : '回程'
  } else if (props.tripType === 'multi') {
    return `行程${segmentIndex + 1}`
  } else {
    return '去程'
  }
})

interface HeaderItem {
  key: string
  currentLeg: 'outbound' | 'return'
  segmentTitle: string
  dateText: string
  origin: { name: string; code: string }
  destination: { name: string; code: string }
  showOnMobile: boolean
  showOnDesktop: boolean
}

const headerItems = computed<HeaderItem[]>(() => {
  const items: HeaderItem[] = []
  const currentIndex = props.segmentIndex ?? 0

  // Base header for current segment: used on desktop always,
  // and on mobile for non-multi trip types.
  items.push({
    key: `current-${currentIndex}`,
    currentLeg: currentLeg.value,
    segmentTitle: segmentTitle.value,
    dateText: dateText.value,
    origin: origin.value,
    destination: destination.value,
    showOnDesktop: true,
    showOnMobile: tripType.value !== 'multi',
  })

  // For multi-trip, build headers 1..currentIndex for mobile only
  if (tripType.value === 'multi' && props.searchRequest?.flightSegments) {
    const segmentsForHeader = props.searchRequest.flightSegments.slice(0, currentIndex + 1)

    segmentsForHeader.forEach((seg: any, index: number) => {
      if (!seg) return

      const originInfo = seg.departureLocation
        ? getCityInfoFromCode(seg.departureLocation)
        : { code: '', name: '' }

      const destInfo = seg.arrivalLocation
        ? getCityInfoFromCode(seg.arrivalLocation)
        : { code: '', name: '' }

      items.push({
        key: `multi-${index}`,
        // Mobile multi-header design: always show the numbered tab on the left,
        // so we treat all segments as "return" in this condensed list.
        currentLeg: 'return',
        segmentTitle: String(index + 1),
        dateText: seg.departureDate || '',
        origin: originInfo,
        destination: destInfo,
        showOnDesktop: false,
        showOnMobile: true,
      })
    })
  }

  return items
})

// --- Mobile edit handler ---
// Inject edit modal function from SearchView (route context)
const openSearchEditModal = inject<(() => void) | undefined>('openSearchEditModal', undefined)

function handleEditSegment() {
  // Close mobile modal when edit is clicked
  selectedCardRefNumber.value = null
  isFlightInfoModalOpen.value = false
  
  // Use injected function if available (route context), otherwise emit (backward compatibility)
  if (openSearchEditModal) {
    openSearchEditModal()
  } else {
    emit('edit-search')
  }
}

// (Other-leg summary logic removed for now; will be revisited later when UX is finalized)

// ---------- Selected Segments Management ----------
// Rebuild selectedSegments from URL + sessionStorage
const selectedSegments = computed(() => {
  const selectedRefs = route.query.selectedRefs
  if (!selectedRefs || typeof selectedRefs !== 'string') {
    return []
  }
  
  const refsArray = selectedRefs.split(',').filter(ref => ref.length > 0)
  if (refsArray.length === 0) {
    return []
  }
  
  // Rebuild from URL refs + sessionStorage
  return rebuildSelectedSegments(
    props.tripType,
    props.searchRequest,
    refsArray,
    flightData.value
  )
})

// State for managing selected flights (selectedRefNumbers)
// Initialize from URL query if available
const selectedRefNumbers = computed(() => {
  const selectedRefs = route.query.selectedRefs
  if (!selectedRefs || typeof selectedRefs !== 'string') {
    return []
  }
  return selectedRefs.split(',').map(ref => parseInt(ref)).filter(n => !isNaN(n))
})

// Local copy of selected segments to accumulate during current session
// This is used when selecting flights to build up the array
const accumulatedSegments = computed(() => {
  // Return all segments up to current index
  return selectedSegments.value.slice(0, props.segmentIndex)
})

// Emit events to parent
const emit = defineEmits<{
  (e: 'edit-search'): void
}>()

// Round-trip summary logic
const roundTripSummary = useRoundTripSummary(
  () => ({
    tripType: tripType.value,
    currentSegmentIndex: props.segmentIndex,
    outboundResults: flightData.value,
    searchRequest: props.searchRequest,
    selectedSegments: selectedSegments.value
  })
)

// Extract summary data for template (handles null case)
const summaryData = computed(() => roundTripSummary.summaryData.value)

//---------- Sidebar data (derived from flightData) ----------
type OptionItem = { id: string; name: string; price: number }
const alliances = computed(() => airlineStore.airlineAlliance ?? [])

const airlines = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of flightData.value ?? []) {
    const codes = row.airlineCode ?? []
    const names = row.airlineName ?? []
    codes.forEach((code, idx) => {
      const name = names[idx] ?? code
      const current = map.get(code)
      const price = row.price
      if (!current || price < current.min) map.set(code, { name, min: price })
    })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

const depAirports = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of flightData.value ?? []) {
    const id = row.departureAirportCode
    const name = row.departureAirportName || id
    const price = row.price
    const cur = map.get(id)
    if (!cur || price < cur.min) map.set(id, { name, min: price })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

const arrAirports = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of flightData.value ?? []) {
    const id = row.arrivalAirportCode
    const name = row.arrivalAirportName || id
    const price = row.price
    const cur = map.get(id)
    if (!cur || price < cur.min) map.set(id, { name, min: price })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

// Stops pricing (min price for direct vs one-stop+)
const stopsPricing = computed(() => {
  let directMin = Infinity
  let oneStopMin = Infinity
  for (const row of flightData.value ?? []) {
    const stops = Math.max(0, (row.sectors?.length ?? 1) - 1)
    if (stops === 0) directMin = Math.min(directMin, row.price)
    else oneStopMin = Math.min(oneStopMin, row.price)
  }
  return {
    direct: Number.isFinite(directMin) ? directMin : 0,
    oneStop: Number.isFinite(oneStopMin) ? oneStopMin : 0
  }
})

// ---------- Router / handlers ----------
const bookingStore = useBookingStore()

// 控制行動版載入狀態
const isMobileBookingLoading = ref(false)

// Shared state for selected card (mobile modal) - defined early as it's used in handleEditSegment
const selectedCardRefNumber = ref<number | null>(null)
const isFlightInfoModalOpen = ref(false)

// 將目前選擇的航班與票價寫入 bookingStore，但不導頁
function prepareBooking(payload: any) {
  const { fare, refNumber, fareRuleData } = payload

  // 找出當前航班的完整資訊
  const currentFlight = flightData.value.find(flight => flight.refNumber === refNumber)
  if (!currentFlight) {
    console.error('Flight not found:', refNumber)
    return
  }

  // 計算停靠站數量（sectors數量 - 1）
  const stopsCount = (currentFlight.sectors?.length || 1) - 1

  // 構建航段資訊
  const currentSegment = {
    refNumber: refNumber,
    sectors: currentFlight.sectors || [],
    totalMinutes:
      currentFlight.sectors?.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) ||
      currentFlight.durationMinutes ||
      0,
    stopsCount: stopsCount,
    totalPrice: currentFlight.price || 0,
    currency: 'TWD', // 從 flight-search API 的回應來看，通常是 TWD
    roundTripIncluded: tripType.value === 'roundtrip', // 來回票時為 true
    header: {
      departureTime: currentFlight.departureTime || '',
      arrivalTime: currentFlight.arrivalTime || '',
      departureAirportCode:
        currentFlight.departureAirportCode || currentFlight.sectors?.[0]?.departureCityCode || '',
      arrivalAirportCode:
        currentFlight.arrivalAirportCode ||
        currentFlight.sectors?.slice(-1)?.[0]?.arrivalCityCode ||
        '',
      departureTerminal: currentFlight.departureTerminal || currentFlight.sectors?.[0]?.departureTerminal,
      arrivalTerminal:
        currentFlight.arrivalTerminal || currentFlight.sectors?.slice(-1)?.[0]?.arrivalTerminal,
    },
    // 新增：從 flight-search 回應中取得的欄位
    validatingAirlineCode: currentFlight.validatingAirlineCode,
    itineraryRBDs: currentFlight.itineraryRBDs,
  }

  // 判斷行程類型和當前航段索引
  const segmentIndex = props.segmentIndex ?? 0
  const isReturnSegment = tripType.value === 'roundtrip' && segmentIndex === 1
  const isMultiTrip = tripType.value === 'multi'

  // 設定航段資訊
  if (isMultiTrip) {
    // 多行程：收集所有已選擇的航段 + 當前航段
    const allSegments: any[] = []

    // 1. 加入之前選擇的所有航段
    if (selectedSegments.value && selectedSegments.value.length > 0) {
      selectedSegments.value.forEach((seg: any) => {
        allSegments.push({
          refNumber: seg.refNumber,
          sectors: seg.sectors || [],
          totalMinutes:
            seg.sectors?.reduce((sum: number, s: any) => sum + (s.durationMinutes || 0), 0) ||
            seg.totalMinutes ||
            0,
          stopsCount: seg.stopsCount || 0,
          totalPrice: seg.totalPrice || 0,
          currency: seg.currency || 'TWD',
          roundTripIncluded: false,
          header: seg.header || {},
          validatingAirlineCode: seg.validatingAirlineCode,
          itineraryRBDs: seg.itineraryRBDs,
        })
      })
    }

    // 2. 加入當前選擇的航段
    allSegments.push(currentSegment)

    // 3. 使用 setSegments 一次性設定所有航段
    bookingStore.setSegments(allSegments)
  } else if (isReturnSegment) {
    // 來回票的回程
    bookingStore.setReturnSegment(currentSegment)
    // 去程資訊應該已經在 selectedSegments 中
    if (selectedSegments.value && selectedSegments.value.length > 0) {
      const outboundData = selectedSegments.value[0]
      bookingStore.setOutboundSegment({
        refNumber: outboundData.refNumber,
        sectors: outboundData.sectors || [],
        totalMinutes:
          outboundData.sectors?.reduce((sum: number, s: any) => sum + (s.durationMinutes || 0), 0) ||
          outboundData.totalMinutes ||
          0,
        stopsCount: outboundData.stopsCount || 0,
        totalPrice: outboundData.totalPrice || 0,
        currency: outboundData.currency || 'TWD',
        roundTripIncluded: outboundData.roundTripIncluded || false,
        header: outboundData.header || {},
        validatingAirlineCode: outboundData.validatingAirlineCode,
        itineraryRBDs: outboundData.itineraryRBDs,
      })
    }
  } else {
    // 單程或來回票的去程
    bookingStore.setOutboundSegment(currentSegment)
  }

  // 設定選擇的票價
  bookingStore.setSelectedFare(fare)

  // 設定 fare-rule 資料
  if (fareRuleData) {
    bookingStore.setFareRuleData(fareRuleData)
  }

  // 設定搜尋參數
  if (props.searchRequest) {
    // 對於來回票，departureCity/arrivalCity 應該固定為原始搜尋的出發地/目的地
    // 而不是當前航段的起訖點（回程時會相反）
    let searchDepartureCity = origin.value.name
    let searchArrivalCity = destination.value.name
    let searchDepartureCityCode = origin.value.code
    let searchArrivalCityCode = destination.value.code

    // 如果是回程航段，需要交換回來，使用去程的起訖點作為搜尋條件
    if (isReturnSegment && selectedSegments.value && selectedSegments.value.length > 0) {
      const outboundData = selectedSegments.value[0]
      if (outboundData?.header) {
        // 使用去程的出發地和目的地作為搜尋參數
        searchDepartureCityCode = outboundData.header.departureAirportCode
        searchArrivalCityCode = outboundData.header.arrivalAirportCode
        // 從 sectors 取得城市名稱
        if (outboundData.sectors && outboundData.sectors.length > 0) {
          searchDepartureCity =
            outboundData.sectors[0]?.departureCityName || searchDepartureCity
          searchArrivalCity =
            outboundData.sectors[outboundData.sectors.length - 1]?.arrivalCityName ||
            searchArrivalCity
        }
      }
    }

    bookingStore.setSearchParams({
      tripType: tripType.value as any,
      departureCity: searchDepartureCity,
      arrivalCity: searchArrivalCity,
      departureCityCode: searchDepartureCityCode,
      arrivalCityCode: searchArrivalCityCode,
      departureDate:
        props.searchRequest.departureDate ||
        props.searchRequest.slices?.[0]?.departureDate ||
        dateText.value,
      returnDate:
        props.searchRequest.flightSegments?.[0]?.returnDate ||
        props.searchRequest.returnDate ||
        props.searchRequest.slices?.[1]?.departureDate ||
        undefined,
      adults:
        props.searchRequest.adults ||
        props.searchRequest.adultCount ||
        props.searchRequest.passengers?.ADT ||
        1,
      children:
        props.searchRequest.children ||
        props.searchRequest.childCount ||
        props.searchRequest.passengers?.CHD ||
        0,
      infants:
        props.searchRequest.infants ||
        props.searchRequest.babyCount ||
        props.searchRequest.passengers?.INF ||
        0,
    })
  }
}

// 導航到訂票頁面 - 保留 URL 查詢參數以支援瀏覽器返回功能
function goToBooking() {
  router.push({
    name: 'booking-step-2',
    query: router.currentRoute.value.query,
  })
}

function onPurchase(payload: any) {
  prepareBooking(payload)
  goToBooking()
}

const handleSelect = (payload: any) => {
  // Store selected segment and navigate to next route
  if (payload.refNumber !== undefined) {
    const segmentIndex = props.segmentIndex ?? 0
    
    // For roundtrip outbound: trigger return search when card is selected
    // This updates HeaderStripSummary with cheapest return option
    if (props.tripType === 'roundtrip' && segmentIndex === 0) {
      // Trigger return search with clicked outbound card's refNumber
      // This will show skeleton in HeaderStripSummary while loading, then show cheapest result
      roundTripSummary.fetchReturnResults(payload.refNumber)
      // Continue with navigation - user will see return results on next page
    }
    
    // Store segment in sessionStorage
    storeSelectedSegment(
      props.tripType,
      props.searchRequest,
      segmentIndex,
      payload
    )
    
    // Build updated selectedRefs array
    const currentRefs = selectedRefNumbers.value
    const newRefs = [...currentRefs, payload.refNumber]
    
    // Extract search params from current route
    const currentParams = deserializeSearchParams(route.query)
    if (!currentParams) {
      return
    }
    
    // Update selectedRefs
    currentParams.selectedRefs = newRefs.map(ref => String(ref))
    
    // Preserve filters, sort, and taxMode when navigating to next segment
    // (These are already in currentParams from deserializeSearchParams, but ensure they're set)
    const currentFilters = getFiltersForNavigation()
    const currentSort = getSortForNavigation()
    const currentTaxMode = getTaxModeForNavigation()
    
    if (!currentParams.filters && (currentFilters.studentOnly || currentFilters.stops.direct || currentFilters.stops.oneStop || 
        currentFilters.alliances.length > 0 || currentFilters.airlines.length > 0 || 
        currentFilters.depAirports.length > 0 || currentFilters.arrAirports.length > 0 ||
        currentFilters.departTime[0] !== 0 || currentFilters.departTime[1] !== 1439 ||
        currentFilters.arriveTime[0] !== 0 || currentFilters.arriveTime[1] !== 1439)) {
      currentParams.filters = {
        studentOnly: currentFilters.studentOnly || undefined,
        stops: {
          direct: currentFilters.stops.direct || undefined,
          oneStop: currentFilters.stops.oneStop || undefined
        },
        alliances: currentFilters.alliances.length > 0 ? currentFilters.alliances : undefined,
        airlines: currentFilters.airlines.length > 0 ? currentFilters.airlines : undefined,
        depAirports: currentFilters.depAirports.length > 0 ? currentFilters.depAirports : undefined,
        arrAirports: currentFilters.arrAirports.length > 0 ? currentFilters.arrAirports : undefined,
        departTime: (currentFilters.departTime[0] !== 0 || currentFilters.departTime[1] !== 1439) ? currentFilters.departTime : undefined,
        arriveTime: (currentFilters.arriveTime[0] !== 0 || currentFilters.arriveTime[1] !== 1439) ? currentFilters.arriveTime : undefined
      }
    }
    if (!currentParams.sort && (currentSort.key !== 'price' || currentSort.dir !== 'asc')) {
      currentParams.sort = { key: currentSort.key, dir: currentSort.dir }
    }
    if (!currentParams.taxMode && currentTaxMode !== 'in') {
      currentParams.taxMode = currentTaxMode
    }
    
    // Determine next route
    let nextRouteName: string
    let nextParams: Record<string, string> | undefined
    
    if (props.tripType === 'roundtrip') {
      // Roundtrip: navigate to return segment
      nextRouteName = 'search-return'
      // Note: currentSegmentIndex not needed - route structure determines segment index
    } else if (props.tripType === 'multi') {
      // Multi-trip: navigate to next segment
      const nextIndex = segmentIndex + 1
      nextRouteName = 'search-segment'
      nextParams = { index: String(nextIndex) }
      // Note: currentSegmentIndex not needed - route params determine segment index
    } else {
      // Oneway: should not reach here (isLastStep should be true)
      return
    }
    
    // Serialize updated params (includes filters, sort, taxMode)
    const query = serializeSearchParams(currentParams)
    
    // Navigate to next route
    router.push({
      name: nextRouteName,
      params: nextParams,
      query
    })
  }
}

// (Filter, Sort, TaxMode logic moved to useFilterSortSync composable)

// ---------- Derived, filtered & sorted list ----------
const filteredFlights = computed(() => {
  let arr = (flightData.value ?? []).slice()

  // stops filter
  const wantDirect = filters.stops.direct
  const wantOne = filters.stops.oneStop
  if (wantDirect && !wantOne) arr = arr.filter(f => Math.max(0, (f.sectors?.length ?? 1) - 1) === 0)
  if (wantOne && !wantDirect) arr = arr.filter(f => Math.max(0, (f.sectors?.length ?? 1) - 1) >= 1)

  // airline filter
  if (filters.airlines?.length) {
    const set = new Set(filters.airlines)
    arr = arr.filter(f => (f.airlineCode ?? []).some(c => set.has(c)))
  }

  // airports filter
  if (filters.depAirports?.length) {
    const set = new Set(filters.depAirports)
    arr = arr.filter(f => set.has(f.departureAirportCode))
  }
  if (filters.arrAirports?.length) {
    const set = new Set(filters.arrAirports)
    arr = arr.filter(f => set.has(f.arrivalAirportCode))
  }

  // time windows — use itinerary header time (departureTime / arrivalTime) in "HH:mm"
  const depWin = filters.departTime || [0, 1439]
  const arrWin = filters.arriveTime || [0, 1439]
  arr = arr.filter(f =>
    inWindow(timeToMin(f.departureTime), depWin) &&
    inWindow(timeToMin(f.arrivalTime), arrWin)
  )

  /**
   * Helper to get price for sorting (matches displayPrice logic)
   * Ensures sorting matches what user sees based on taxMode
   */
  const getPriceForSort = (row: CardRow) => {
    // API 回傳的 price 已經含稅
    return taxMode.value === 'in' 
      ? row.price  // When tax included, use price directly
      : row.price - (row.taxAmount ?? 0)  // When tax excluded, subtract tax
  }

  // Sort: Default is 'price' (ascending) to match store's initial sort
  // User can change sort via SortBar
  arr.sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'direct') {
      const sa = Math.max(0, (a.sectors?.length ?? 1) - 1)
      const sb = Math.max(0, (b.sectors?.length ?? 1) - 1)
      if (sa !== sb) return (sa - sb)
      // Use price with tax consideration for tiebreaker
      const pa = getPriceForSort(a)
      const pb = getPriceForSort(b)
      return (pa - pb) * dir
    }
    if (sort.key === 'price') {
      // Sort by price respecting tax mode (matches what user sees)
      const pa = getPriceForSort(a)
      const pb = getPriceForSort(b)
      return (pa - pb) * dir
    }
    if (sort.key === 'depTime') return (timeToMin(a.departureTime) - timeToMin(b.departureTime)) * dir
    if (sort.key === 'arrTime') return (timeToMin(a.arrivalTime) - timeToMin(b.arrivalTime)) * dir
    if (sort.key === 'duration') return (a.durationMinutes - b.durationMinutes) * dir
    return 0
  })

  return arr
})

const totalCount = computed(() => filteredFlights.value.length)

// Count active filters
const activeFilterCount = computed(() => {
  let count = 0
  
  // Check stops filter
  if (filters.stops.direct || filters.stops.oneStop) {
    count++
  }
  
  // Check alliances filter
  if (filters.alliances.length > 0) {
    count++
  }
  
  // Check airlines filter
  if (filters.airlines.length > 0) {
    count++
  }
  
  // Check departure airports filter
  if (filters.depAirports.length > 0) {
    count++
  }
  
  // Check arrival airports filter
  if (filters.arrAirports.length > 0) {
    count++
  }
  
  // Check departure time filter (not default range)
  if (filters.departTime[0] !== 0 || filters.departTime[1] !== 1439) {
    count++
  }
  
  // Check arrival time filter (not default range)
  if (filters.arriveTime[0] !== 0 || filters.arriveTime[1] !== 1439) {
    count++
  }
  
  return count
})

// Mobile sort/filter button handlers
const isFilterModalOpen = ref(false)
const isSortModalOpen = ref(false)
const filterSideBarRef = ref<InstanceType<typeof FilterSideBar> | null>(null)

// Apply filters and close modal when confirm button is clicked
function handleFilterConfirm(filters?: any) {
  // If filters provided from @confirm event, use them; otherwise get from ref
  const filtersToApply = filters || filterSideBarRef.value?.getCurrentFilters()
  if (filtersToApply) {
    onFiltersChange(filtersToApply)
  }
  isFilterModalOpen.value = false
}

// Computed for selected card data (selectedCardRefNumber is defined earlier)
const selectedCardData = computed(() => {
  if (selectedCardRefNumber.value === null) return null
  return filteredFlights.value.find(card => card.refNumber === selectedCardRefNumber.value) || null
})

// ---------- Auto-select first card on mobile after results load ----------
// Track if we've already auto-selected to prevent re-selection on filter/sort changes
const hasAutoSelected = ref(false)

// Watch for when results are loaded and auto-select first card (mobile only)
watch(
  () => [flightSearchStore.loading, filteredFlights.value] as [string, CardRow[]],
  ([loading, flights]) => {
    // Only on mobile
    if (window.innerWidth >= 768) return
    
    // Only when results are successfully loaded and there are flights
    if (loading !== 'success' || flights.length === 0) return
    
    // Don't auto-select if user has already selected a card manually
    if (selectedCardRefNumber.value !== null) return
    
    // Don't auto-select if we've already done it (prevents re-selection on filter/sort changes)
    if (hasAutoSelected.value) return
    
    // Set first card as selected (this will show it as clicked and open the modal)
    const firstFlight = flights[0]
    if (firstFlight?.refNumber !== undefined && firstFlight.refNumber !== null) {
      selectedCardRefNumber.value = firstFlight.refNumber
      hasAutoSelected.value = true
    }
  },
  { immediate: true }
)

// Reset auto-selection flag when new search starts (loading becomes 'loading')
// This allows auto-selection to happen again for the new search results
watch(
  () => flightSearchStore.loading,
  (loading) => {
    if (loading === 'loading') {
      hasAutoSelected.value = false
      // Also clear selected card when new search starts
      selectedCardRefNumber.value = null
    }
  }
)

// Initialize fare rule composable for mobile purchase flow
// Uses reactive getter to access current selected card data
const fareRuleForPurchase = useFlightFareRule(() => {
  const card = selectedCardData.value
  if (!card || !card.sectors) {
    return {
      sectors: [],
      previousSegments: selectedSegments.value,
      tripType: tripType.value,
      leg: currentLeg.value,
      adultCount: props.searchRequest?.adultCount || props.searchRequest?.adults || 1,
      childCount: props.searchRequest?.childCount || props.searchRequest?.children || 0,
      babyCount: props.searchRequest?.babyCount || props.searchRequest?.infants || 0,
      validatingAirlineCode: undefined,
      itineraryRBDs: undefined,
      fareOptions: []
    }
  }
  
  // Find full flight data to get validatingAirlineCode and itineraryRBDs
  const currentFlight = flightData.value.find(flight => flight.refNumber === card.refNumber)
  
  return {
    sectors: card.sectors,
    previousSegments: selectedSegments.value,
    tripType: tripType.value,
    leg: currentLeg.value,
    adultCount: props.searchRequest?.adultCount || props.searchRequest?.adults || 1,
    childCount: props.searchRequest?.childCount || props.searchRequest?.children || 0,
    babyCount: props.searchRequest?.babyCount || props.searchRequest?.infants || 0,
    validatingAirlineCode: currentFlight?.validatingAirlineCode,
    itineraryRBDs: currentFlight?.itineraryRBDs,
    fareOptions: []
  }
})

function handleCardClick(card: CardRow) {
  // Only handle on mobile
  if (window.innerWidth >= 768) return
  
  // Set selected card (opens modal if not already open, or switches content if already open)
  if (card.refNumber !== undefined && card.refNumber !== null) {
    selectedCardRefNumber.value = card.refNumber
    
    // For roundtrip outbound on mobile: trigger return search when card is clicked
    // This will show skeleton in HeaderStripSummary while loading, then show cheapest result
    if (props.tripType === 'roundtrip' && (props.segmentIndex ?? 0) === 0) {
      roundTripSummary.fetchReturnResults(card.refNumber)
    }
  }
}

// Handle HeaderStripSummary click - navigate to next/previous segment
function handleHeaderStripSummaryClick() {
  if (props.tripType !== 'roundtrip') return
  
  if (currentLeg.value === 'outbound') {
    // On outbound: navigate to return using the currently selected outbound
    // (the one that triggered the return search shown in HeaderStripSummary)
    const selectedRefNumber = roundTripSummary.currentOutboundRefNumber.value
    
    // Find the card with this refNumber, or fallback to cheapest (first in filteredFlights)
    const selectedCard = selectedRefNumber 
      ? filteredFlights.value.find(card => card.refNumber === selectedRefNumber)
      : null
    const card = selectedCard || filteredFlights.value[0]
    
    if (card && card.refNumber !== undefined) {
      handleSelect({
        refNumber: card.refNumber,
        sectors: card.sectors || [],
        totalMinutes: card.durationMinutes || 0,
        stopsCount: Math.max(0, (card.sectors?.length ?? 1) - 1),
        totalPrice: card.price || 0,
        taxAmount: card.taxAmount || 0,
        currency: 'TWD',
        roundTripIncluded: true,
        header: {
          departureTime: card.departureTime || '',
          arrivalTime: card.arrivalTime || '',
          departureAirportCode: card.departureAirportCode || '',
          arrivalAirportCode: card.arrivalAirportCode || '',
          departureTerminal: card.departureTerminal || '',
          arrivalTerminal: card.arrivalTerminal || ''
        }
      })
    }
  } else if (currentLeg.value === 'return') {
    // On return: navigate back to outbound (simple router.back)
    router.back()
  }
}

function handleCardModalFlightInfo() {
  // When "航班資訊" is clicked in FlightActionModal, close FlightActionModal and open FlightInfoModal
  isFlightInfoModalOpen.value = true
  // FlightActionModal will close automatically because :open condition checks !isFlightInfoModalOpen
}

async function handleFlightInfoNextStep() {
  // Close modal and proceed with selection
  const card = selectedCardData.value
  if (!card) return

  // If last step, trigger purchase flow / summary
  if (isLastStep.value) {
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      // 行動版：顯示載入中畫面（保留 selectedCardRefNumber，讓 fareRuleForPurchase 有 sectors）
      isMobileBookingLoading.value = true

      /**
       * Temporary baseFare placeholder (will be replaced by fare-rule API response)
       * Note: card.price includes tax, but this is just a placeholder structure
       * The actual fare-rule API will return the correct price structure
       */
      const baseFare: any = {
        id: 'default-fare',
        cabin: card.sectors?.[0]?.cabinDesc || '經濟艙',
        price: (card.price || 0) - (card.taxAmount || 0), // Placeholder: price without tax
        taxAmount: card.taxAmount || 0,
        notes: []
      }

      // 確保每次都重新呼叫 fare-rule API
      fareRuleForPurchase.fareRuleData.value = null

      // 載入 fare-rule，計算實際票價與說明
      let fareRuleData = null
      let fareWithNotes: any = baseFare

      if (card.sectors && card.sectors.length > 0) {
        await fareRuleForPurchase.fetchFareRule()

        fareRuleData = fareRuleForPurchase.fareRuleData.value
        const availableFares = fareRuleForPurchase.dynamicFareOptions.value.length > 0
          ? fareRuleForPurchase.dynamicFareOptions.value
          : []

        if (availableFares.length > 0) {
          fareWithNotes = availableFares[0]
        }
      }

      // 將結果寫入 bookingStore，關閉載入畫面並導航到摘要頁
      prepareBooking({
        fare: fareWithNotes,
        refNumber: card.refNumber,
        fareRuleData
      })

      isMobileBookingLoading.value = false
      
      // Store final segment and navigate to summary route
      storeSelectedSegment(
        props.tripType,
        props.searchRequest,
        props.segmentIndex ?? 0,
        {
          refNumber: card.refNumber,
          sectors: card.sectors || [],
          totalMinutes: card.durationMinutes || 0,
          stopsCount: Math.max(0, (card.sectors?.length ?? 1) - 1),
          totalPrice: card.price || 0,
          taxAmount: card.taxAmount || 0,
          currency: 'TWD',
          roundTripIncluded: props.tripType === 'roundtrip',
          header: {
            departureTime: card.departureTime || '',
            arrivalTime: card.arrivalTime || '',
            departureAirportCode: card.departureAirportCode || '',
            arrivalAirportCode: card.arrivalAirportCode || '',
            departureTerminal: card.departureTerminal || '',
            arrivalTerminal: card.arrivalTerminal || ''
          }
        }
      )
      
      // Update URL with final selectedRefs
      const currentParams = deserializeSearchParams(route.query)
      if (currentParams) {
        const finalRefs = [...selectedRefNumbers.value, card.refNumber]
        currentParams.selectedRefs = finalRefs.map(ref => String(ref))
        const query = serializeSearchParams(currentParams)
        
        router.push({
          name: 'search-summary',
          query
        })
      }
    } else {
      // 桌機版：維持原本流程，先取得 fare-rule 再導頁
      let fareRuleData = null
      /**
       * Temporary fare placeholder (will be replaced by fare-rule API response)
       * Note: card.price includes tax, but this is just a placeholder structure
       */
      let fareWithNotes: any = {
        id: 'default-fare',
        cabin: card.sectors?.[0]?.cabinDesc || '經濟艙',
        price: (card.price || 0) - (card.taxAmount || 0), // Placeholder: price without tax
        taxAmount: card.taxAmount || 0,
        notes: []
      }

      if (card.sectors && card.sectors.length > 0) {
        if (!fareRuleForPurchase.fareRuleData.value && !fareRuleForPurchase.fareRuleLoading.value) {
          await fareRuleForPurchase.fetchFareRule()
        }

        fareRuleData = fareRuleForPurchase.fareRuleData.value

        const availableFares = fareRuleForPurchase.dynamicFareOptions.value.length > 0
          ? fareRuleForPurchase.dynamicFareOptions.value
          : []

        if (availableFares.length > 0) {
          fareWithNotes = availableFares[0]
        }
      }

      const purchasePayload = {
        fare: fareWithNotes,
        refNumber: card.refNumber,
        fareRuleData
      }

      onPurchase(purchasePayload)
    }
  } else {
    // Not last step, proceed to next segment
    handleSelect({
      refNumber: card.refNumber,
      sectors: card.sectors || [],
      totalMinutes: card.durationMinutes || 0,
      stopsCount: Math.max(0, (card.sectors?.length ?? 1) - 1),
      totalPrice: card.price || 0,
      taxAmount: card.taxAmount || 0,
      currency: 'TWD',
      header: {
        departureTime: card.departureTime || '',
        arrivalTime: card.arrivalTime || '',
        departureAirportCode: card.departureAirportCode || '',
        arrivalAirportCode: card.arrivalAirportCode || '',
        departureTerminal: card.departureTerminal || '',
        arrivalTerminal: card.arrivalTerminal || ''
      }
    })
  }

  // After handling next step (either booking or go to next segment), clear modal state
  selectedCardRefNumber.value = null
  isFlightInfoModalOpen.value = false
}

function handleSortClick() {
  // Close mobile modal when sort is clicked
  selectedCardRefNumber.value = null
  isFlightInfoModalOpen.value = false
  isSortModalOpen.value = true
}

function handleFilterClick() {
  // Close mobile modal when filter is clicked
  selectedCardRefNumber.value = null
  isFlightInfoModalOpen.value = false
  isFilterModalOpen.value = true
}

function handleSortOptionClick(key: typeof sort.key, dir: typeof sort.dir) {
  setSort(key, dir)
}

// (filterInitialState moved to useFilterSortSync composable)

// Lock body scroll when filter or sort modal is open
let savedScrollY = 0

watch([isFilterModalOpen, isSortModalOpen], ([filterOpen, sortOpen]) => {
  const isOpen = filterOpen || sortOpen
  if (isOpen) {
    // Save current scroll position
    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
  } else {
    // Restore scroll position
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    // Use requestAnimationFrame to ensure styles are reset before scrolling
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY)
      savedScrollY = 0
    })
  }
})

// "Infinite" show more
const showCount = ref(5)
const shownFlights = computed(() => filteredFlights.value.slice(0, showCount.value))
const canLoadMore = computed(() => showCount.value < filteredFlights.value.length)

// fake infinite loader when scrolling near bottom
const onScroll = () => {
  if (!canLoadMore.value) return
  const pad = 240
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - pad
  if (nearBottom) {
    window.removeEventListener('scroll', onScroll)
    setTimeout(() => {
      showCount.value = Math.min(showCount.value + 5, filteredFlights.value.length)
      window.addEventListener('scroll', onScroll)
    }, 0)
  }
}

const apply = (on: boolean) => document.body.classList.toggle('result-bg', !!on)

onMounted(() => {
  apply(true)
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  apply(false)
  window.removeEventListener('scroll', onScroll)
  // Clean up body scroll lock if modal is still open
  if (isFilterModalOpen.value || isSortModalOpen.value) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY)
      savedScrollY = 0
    })
  }
})
</script>
<style>
.v-enter-from, .v-leave-to {
  height: 0; /* Start with no height */
  opacity: 0;
}

.v-enter-to, .v-leave-from {
  height: auto; /* End with natural height */
  opacity: 1;
}
.v-enter-active,
.v-leave-active,
.v-move {
  transition: all 0.4s ease;
  display: block;
}
.v-leave-active { position: absolute; }

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>