<template>
  <div>
    <div class="space-y-4">
      <div v-for="(seg, idx) in segments" :key="idx"
        class="border-2 border-primary-gold rounded-xl flex relative"
        :class="{ 'rounded-t-none md:rounded-tl-xl': idx === 0 }">
        <!-- Delete button: top right of segment card -->
        <button
          v-if="segments.length > 2 && idx >= 2"
          @click="removeSegment(idx)"
          type="button"
          class="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 text-sm md:text-base rounded-md bg-others-original text-white grid place-items-center hover:bg-others-original/90 z-10"
          aria-label="remove segment"
          title="移除此航段"
        >
          ✕
        </button>

        <!-- Left index badge column -->
        <div class="w-10 md:w-[5%] shrink-0">
          <div
            class="h-full rounded-l-[10px] bg-primary-gold2 russo text-white text-2xl md:text-5xl flex items-center justify-center"
            :class="{ 'rounded-t-none md:rounded-tl-xl': idx === 0 }">
            {{ idx + 1 }}
          </div>
        </div>

        <!-- Content wrapper -->
        <div class="flex-1 flex flex-col md:flex-row">
          <!-- Departure/Arrival section -->
          <div class="flex-1 grid grid-cols-[1fr_auto_1fr] md:flex md:flex-row border-l-2 border-primary-gold px-4 md:px-10 py-3 md:py-0">
          <!-- Departure -->
          <div class="contents md:block md:relative md:py-6 md:w-[35%]" :ref="setDepTriggerRef(idx)">
            <label class="text-sm md:text-h5 text-primary-gold font-bold col-start-1 row-start-1 md:mb-2 md:block">出發地</label>
            <div class="cursor-pointer col-start-1 row-start-2 md:row-auto" :class="errors[idx].departure ? 'text-text-error' : ''" @click="toggleDeparture(idx)">
              <div v-if="idx === 0" class="text-sm md:text-base text-others-gray1">
                {{ seg.departureCity?.cityNameZhTw || '台北/桃園' }}
              </div>
              <div v-else class="text-sm md:text-base text-others-gray1" :class="errors[idx].departure ? 'text-text-error' : ''">
                {{ seg.departureCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
              </div>
            </div>
            <!-- Departure Popover -->
            <transition name="fade-scale">
                <div
                    v-if="openDepIndex === idx"
                    :ref="setDepPopoverRef(idx)"
                    class="fixed inset-0 z-[100] bg-black/40 flex items-end
                           md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                    @click.self="openDepIndex = -1"
                >
                    <LocationPicker
                        title="出發地"
                        :locations="locationStore.locations"
                        :selected-city="seg.departureCity"
                        search-placeholder="輸入國家/城市/機場關鍵字"
                        @select="(city) => selectDepartureCity(idx, city)"
                        @close="openDepIndex = -1"
                        @search="locationStore.fetchLocationAutocomplete"
                        @clear="locationStore.clearAutocompleteResults"
                    />
                </div>
            </transition>
          </div>

          <!-- Arrow -->
          <div class="col-start-2 row-start-1 flex items-center justify-center px-2 md:py-6 md:w-[20%]">
            <img src="@/assets/imgs/arrow-right.svg" alt="Arrow" class="w-5 h-5 md:w-auto md:h-auto" />
          </div>

          <!-- Arrival -->
          <div class="contents md:block md:relative md:py-6 md:w-[45%]" :ref="setArrTriggerRef(idx)">
            <label class="text-sm md:text-h5 text-primary-gold font-bold col-start-3 row-start-1 md:mb-2 md:block">目的地</label>
            <div class="cursor-pointer col-start-3 row-start-2 md:row-auto pr-4" :class="errors[idx].arrival ? 'text-text-error' : ''" @click="toggleArrival(idx)">
              <div class="text-sm md:text-base text-others-gray1" :class="errors[idx].arrival ? 'text-text-error' : ''">
                {{ seg.arrivalCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
              </div>
            </div>

            <!-- Arrival Popover -->
            <transition name="fade-scale">
                <div
                    v-if="openArrIndex === idx"
                    :ref="setArrPopoverRef(idx)"
                    class="fixed inset-0 z-[100] bg-black/40 flex items-end
                           md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                    @click.self="openArrIndex = -1"
                >
                    <LocationPicker
                        title="目的地"
                        :locations="locationStore.locations"
                        :selected-city="seg.arrivalCity"
                        search-placeholder="輸入國家/城市/機場關鍵字"
                        @select="(city) => selectArrivalCity(idx, city)"
                        @close="openArrIndex = -1"
                        @search="locationStore.fetchLocationAutocomplete"
                        @clear="locationStore.clearAutocompleteResults"
                    />
                </div>
            </transition>
          </div>
        </div>

          <!-- Date column -->
          <div class="relative md:w-[35%] flex items-center md:block border-t-2 md:border-t-0 border-l-2 border-primary-gold">
            <div class="flex items-center gap-3 md:block px-4 md:px-6 py-3 md:py-6 flex-1"
              :ref="setDateTriggerRef(idx)">
              <label class="text-sm md:text-h5 text-primary-gold font-bold md:mb-2 md:block shrink-0">日期</label>
              <div class="relative" :class="{ 'pb-6': errors[idx].startDate && seg.departureDate }">
                <div class="text-sm md:text-base text-others-gray1 cursor-pointer" :class="errors[idx].startDate ? 'text-text-error' : ''" @click="toggleDate(idx)">
                  {{ formatDate(seg.departureDate) || '請選擇日期' }}
                </div>
                <p v-if="errors[idx].startDate && seg.departureDate" class="absolute left-0 top-full mt-1 text-text-error text-sm whitespace-nowrap">
                  日期必須大於或等於前一段行程的日期
                </p>
              </div>

              <!-- Date picker -->
              <transition name="fade-scale">
                <div
                  v-if="openDateIndex === idx"
                  :ref="setDatePopoverRef(idx)"
                  class="fixed inset-0 z-[100] bg-black/40 md:absolute md:inset-auto md:bg-transparent md:z-50 md:left-0 md:top-full md:mt-2 lg:left-auto lg:right-6"
                  @click.stop
                >
                  <DatePicker
                    :modelValue="seg.departureDate"
                    :min="getMinDateForSegment(idx)"
                    :max="maxDate"
                    @update:modelValue="d => onDateUpdate(idx, d)"
                    @apply="d => onDateApply(idx, d)"
                    @close="openDateIndex = -1"
                  />
                </div>
              </transition>
            </div>

          </div>
        </div>
      </div>

      <!-- Add segment + Passengers -->
      <div class="flex w-full border-2 border-primary-gold rounded-xl">
        <div class="py-3 md:py-6 px-4 md:px-8">
          <button @click="addSegment" type="button"
            class="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-white text-sm md:text-base"
            :class="canAdd ? 'bg-others-original hover:bg-others-original/85' : 'bg-gray-300 cursor-not-allowed'"
            :disabled="!canAdd">
            <span class="text-xl md:text-2xl leading-none">＋</span> 增加航班
          </button>
        </div>
        <div class="flex-1 md:border-l-2 border-primary-gold pl-4 md:pl-6 py-3 md:py-6">
          <!-- Passengers -->
          <div class="relative" ref="passTriggerRef">
            <label class="text-sm md:text-h5 text-primary-gold font-bold mb-1 md:mb-2 block">人數</label>
            <div class="cursor-pointer text-sm md:text-base text-others-gray1" @click="togglePassengers">
              {{ passengerDisplayText }}
            </div>

            <!-- Passengers popover -->
            <transition name="fade-scale">
              <div
                v-if="isPassengersOpen"
                ref="passPopoverRef"
                class="fixed inset-0 z-[100] bg-black/40 flex items-end
                       md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                @click.self="isPassengersOpen = false"
              >
                <PassengerPicker
                  :adult-count="adultCount"
                  :children-count="childrenCount"
                  @update="onPassengerUpdate"
                  @close="isPassengersOpen = false"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Button + filters -->
    <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-0 mt-4 md:mt-6">
        <div class="flex flex-wrap items-center gap-2">
            <!-- Airline Search -->
            <div class="relative flex-1 md:flex-none" ref="airlineTriggerRef">
                <button @click="toggleAirline"
                    class="flex items-center justify-between w-full md:min-w-[200px] bg-divider-soft text-others-gray1 px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200">
                    <span class="truncate">{{ selectedAirline?.nameZhTw?.trim() || "航空公司偏好" }}</span>
                    <svg class="w-3 h-3 md:w-4 md:h-4 ml-2 flex-shrink-0 transition-transform duration-200"
                        :class="{ 'rotate-180': isAirlineOpen }" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 9L2 4h8l-4 5z" />
                    </svg>
                </button>

                <!-- Airline Popover -->
                <transition name="fade-scale">
                    <div
                        v-if="isAirlineOpen"
                        ref="airlinePopoverRef"
                        class="fixed inset-0 z-[100] bg-black/40 flex items-end
                               md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                        @click.self="isAirlineOpen = false"
                    >
                        <AirlinePicker
                            :airlines="airlineStore.airlines"
                            :selected-airline="selectedAirline"
                            @select="selectAirline"
                            @clear="clearAirline"
                            @close="isAirlineOpen = false"
                        />
                    </div>
                </transition>
            </div>

            <!-- Cabin Class Selection -->
            <div class="relative flex-1 md:flex-none" ref="cabinClassTriggerRef">
                <button @click="toggleCabinClass"
                    class="flex items-center justify-between w-full md:min-w-[150px] bg-divider-soft text-others-gray1 px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200">
                    <span class="truncate">{{ selectedCabinClass }}</span>
                    <svg class="w-3 h-3 md:w-4 md:h-4 ml-2 flex-shrink-0 transition-transform duration-200"
                        :class="{ 'rotate-180': isCabinClassOpen }" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 9L2 4h8l-4 5z" />
                    </svg>
                </button>

                <!-- Cabin Class Popover -->
                <transition name="fade-scale">
                    <div
                        v-if="isCabinClassOpen"
                        ref="cabinClassPopoverRef"
                        class="fixed inset-0 z-[100] bg-black/40 flex items-end
                               md:absolute md:inset-auto md:bg-transparent md:block md:-left-45 md:top-full md:mt-2 md:z-50"
                        @click.self="isCabinClassOpen = false"
                    >
                        <CabinClassPicker
                            :selected-class="selectedCabinClass"
                            @select="selectCabinClass"
                            @close="isCabinClassOpen = false"
                        />
                    </div>
                </transition>
            </div>

            <!-- Direct Flight -->
            <div class="relative flex-1 md:flex-none">
                <input :id="`directFlight-${instanceId}`" type="checkbox" v-model="isNonStopFlight" class="sr-only" />
                <label :for="`directFlight-${instanceId}`"
                    class="flex items-center justify-between w-full md:min-w-[120px] bg-divider-soft text-others-gray1 px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200 cursor-pointer">
                    <span>直飛</span>
                    <div class="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                        :class="isNonStopFlight ? 'border-none bg-others-original' : 'border-others-gray1 bg-none'">
                    </div>
                </label>
            </div>
        </div>

        <button
            class="w-full md:w-[150px] px-4 py-2 md:py-1 h-[44px] md:h-[50px] rounded-[15px] border-none font-bold bg-others-original text-white hover:bg-others-hover transition text-sm md:text-base"
            @click="onSearch">
            搜尋
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useAirlineStore } from '@/stores/airline'

import DatePicker from '@/components/ui/pickers/DatePicker.vue'
import LocationPicker from '@/components/ui/pickers/LocationPicker.vue'
import AirlinePicker from '@/components/ui/pickers/AirlinePicker.vue'
import CabinClassPicker from '@/components/ui/pickers/CabinClassPicker.vue'
import PassengerPicker from '@/components/ui/pickers/PassengerPicker.vue'
import { formatDate, formatDateToYYYYMMDD } from '@/utils'

import type { Airline } from '@/utils/types'

// Props
const props = defineProps<{
  initialParams?: any
  instanceId?: string
}>()

// Stores
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

// Adults and Children
const adultCount = ref(1)
const childrenCount = ref(0)

// Filter Options
const airlineSearchTerm = ref('')
const selectedAirline = ref<Airline | null>(null)
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']
const selectedCabinClass = ref('艙等不限')
const isNonStopFlight = ref(false)
const cabinClassMap: Record<string, string | null> = {
  '艙等不限': null,
  '經濟艙': 'M',
  '豪華經濟艙': 'W',
  '商務艙': 'C',
  '頭等艙': 'F'
}

// Open States
const openDepIndex = ref(-1)
const openArrIndex = ref(-1)
const openDateIndex = ref(-1)
const isPassengersOpen = ref(false)
const isAirlineOpen = ref(false)
const isCabinClassOpen = ref(false)

// Triggers
const depTriggerRefs = reactive<Record<number, any>>({})
const depPopoverRefs = reactive<Record<number, any>>({})
const destTriggerRefs = reactive<Record<number, any>>({})
const destPopoverRefs = reactive<Record<number, any>>({})
const dateTriggerRefs = reactive<Record<number, any>>({})
const datePopoverRefs = reactive<Record<number, any>>({})

const passTriggerRef = ref<HTMLElement | null>(null)
const passPopoverRef = ref<HTMLElement | null>(null)
const airlineTriggerRef = ref<HTMLElement | null>(null)
const airlinePopoverRef = ref<HTMLElement | null>(null)
const cabinClassTriggerRef = ref<HTMLElement | null>(null)
const cabinClassPopoverRef = ref<HTMLElement | null>(null)

const setDepTriggerRef = (i: number) => (el: any) => { if (el) depTriggerRefs[i] = el }
const setDepPopoverRef = (i: number) => (el: any) => { if (el) depPopoverRefs[i] = el }
const setArrTriggerRef = (i: number) => (el: any) => { if (el) destTriggerRefs[i] = el }
const setArrPopoverRef = (i: number) => (el: any) => { if (el) destPopoverRefs[i] = el }
const setDateTriggerRef = (i: number) => (el: any) => { if (el) dateTriggerRefs[i] = el }
const setDatePopoverRef = (i: number) => (el: any) => { if (el) datePopoverRefs[i] = el }

// Methods
function toggleDeparture(i: number) { openDepIndex.value = openDepIndex.value === i ? -1 : i }
function toggleArrival(i: number) { 
    // 點擊目的地時，確保選擇「日韓」區域
    if (openArrIndex.value !== i && locationStore.locations) {
        const japanKorea = locationStore.locations.find(loc => loc.region === '日韓')
        if (japanKorea && !segments.value[i].arrivalLocation) {
            segments.value[i].arrivalLocation = japanKorea
        }
    }
    openArrIndex.value = openArrIndex.value === i ? -1 : i 
}
function toggleDate(i: number) { openDateIndex.value = openDateIndex.value === i ? -1 : i }
function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}

function incrementAdults() { 
    const totalPassengers = adultCount.value + childrenCount.value
    if (adultCount.value < 9 && totalPassengers < 9) adultCount.value++ 
}
function decrementAdults() { if (adultCount.value > 1) adultCount.value-- }
function incrementChildren() { 
    const totalPassengers = adultCount.value + childrenCount.value
    if (childrenCount.value < 8 && totalPassengers < 9) childrenCount.value++ 
}
function decrementChildren() { if (childrenCount.value > 0) childrenCount.value-- }

function addSegment() {
  if (!canAdd.value) return
  
  // Get the arrival city of the last segment
  const lastSegment = segments.value[segments.value.length - 1]
  const newSegment = makeSeg()
  
  // Auto-set departure city to previous segment's arrival city
  if (lastSegment?.arrivalCity) {
    newSegment.departureCity = lastSegment.arrivalCity
    // Also set the location if available
    if (lastSegment.arrivalLocation) {
      newSegment.departureLocation = lastSegment.arrivalLocation
    }
  }
  
  segments.value.push(newSegment)
  errors.value.push({
    departure: false,
    arrival: false,
    startDate: false,
  })
}
function removeSegment(idx: number) {
  if (segments.value.length <= 2) return
  segments.value.splice(idx, 1)
  errors.value.splice(idx, 1)
}

function selectDepartureCity(i: number, city: any) {
  segments.value[i].departureCity = city
  openDepIndex.value = -1
}
function selectArrivalCity(i: number, city: any) {
  segments.value[i].arrivalCity = city
  openArrIndex.value = -1
  
  // Auto-update the departure city of the next segment (if exists)
  // User can still manually change it by clicking on the departure field
  if (i + 1 < segments.value.length) {
    const nextSegment = segments.value[i + 1]
    nextSegment.departureCity = city
    // Also update the location if available
    const currentSegment = segments.value[i]
    if (currentSegment.arrivalLocation) {
      nextSegment.departureLocation = currentSegment.arrivalLocation
    }
  }
}
function selectCabinClass(v: string) {
  selectedCabinClass.value = v
  isCabinClassOpen.value = false
}

function onPassengerUpdate(payload: { adults: number; children: number }) {
  adultCount.value = payload.adults
  childrenCount.value = payload.children
}
function onDateUpdate(i: number, d: Date) {
  // Update the date for UI feedback while selecting
  segments.value[i].departureDate = d
  // Validate immediately
  validateSegmentDate(i)
}

function onDateApply(i: number, d: Date) {
  // Validate that this date is >= previous segment's date
  if (!validateSegmentDate(i, d)) {
    // Validation failed - don't close the picker
    return
  }
  
  segments.value[i].departureDate = d
  errors.value[i].startDate = false
  openDateIndex.value = -1
  
  // Auto-update next segment's min date if it exists and is before this date
  if (i + 1 < segments.value.length) {
    const nextSegment = segments.value[i + 1]
    if (nextSegment.departureDate) {
      const nextDate = new Date(nextSegment.departureDate)
      nextDate.setHours(0, 0, 0, 0)
      const currentDate = new Date(d)
      currentDate.setHours(0, 0, 0, 0)
      
      if (nextDate < currentDate) {
        // Next segment's date is before this one - update it
        nextSegment.departureDate = d
        errors.value[i + 1].startDate = false
      }
    }
  }
}

// Validate a segment's date against the previous segment
function validateSegmentDate(idx: number, dateToValidate?: Date): boolean {
  if (idx === 0) {
    // First segment is always valid (only needs to be >= today, which is handled by min date)
    errors.value[idx].startDate = false
    return true
  }
  
  const segment = segments.value[idx]
  const date = dateToValidate || segment.departureDate
  if (!date) {
    errors.value[idx].startDate = false
    return true
  }
  
  const prevSegment = segments.value[idx - 1]
  if (!prevSegment.departureDate) {
    errors.value[idx].startDate = false
    return true
  }
  
  const prevDate = new Date(prevSegment.departureDate)
  prevDate.setHours(0, 0, 0, 0)
  const currentDate = new Date(date)
  currentDate.setHours(0, 0, 0, 0)
  
  if (currentDate < prevDate) {
    // Date is before previous segment's date - show error
    errors.value[idx].startDate = true
    return false
  }
  
  errors.value[idx].startDate = false
  return true
}

// Get minimum date for a segment (previous segment's date or today)
function getMinDateForSegment(idx: number): Date {
  if (idx === 0) {
    // First segment: min date is today
    return new Date()
  }
  
  // For subsequent segments: min date is previous segment's date
  const prevSegment = segments.value[idx - 1]
  if (prevSegment.departureDate) {
    return new Date(prevSegment.departureDate)
  }
  
  // If previous segment has no date, use today
  return new Date()
}

// Check if a segment's date is before the previous segment's date
function isDateBeforePrevious(idx: number): boolean {
  if (idx === 0) return false
  
  const currentSegment = segments.value[idx]
  const prevSegment = segments.value[idx - 1]
  
  if (!currentSegment.departureDate || !prevSegment.departureDate) {
    return false
  }
  
  const currentDate = new Date(currentSegment.departureDate)
  currentDate.setHours(0, 0, 0, 0)
  const prevDate = new Date(prevSegment.departureDate)
  prevDate.setHours(0, 0, 0, 0)
  
  return currentDate < prevDate
}
function swapCities(i: number) {
  const s = segments.value[i]

  let temp = s.departureLocation
  s.departureLocation = s.arrivalLocation
  s.arrivalLocation = temp

  temp = s.departureCity
  s.departureCity = s.arrivalCity
  s.arrivalCity = temp
}
function selectAirline(airline: any) {
  selectedAirline.value = airline
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}
function clearAirline() {
  selectedAirline.value = null
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}

// Computed
const canAdd = computed(() => segments.value.length < 5)
const passengerDisplayText = computed(
  () => `${adultCount.value}成人 / ${childrenCount.value}孩童`
)
const filteredAirlines = computed(() => {
  const s = airlineSearchTerm.value.toLowerCase()
  return airlineStore.airlines.filter(a => a.iataCode.toLowerCase().includes(s) || a.nameZhTw.toLowerCase().includes(s))
})

// 最大日期：從今天起算 350 天
const maxDate = computed(() => {
  const today = new Date()
  const max = new Date(today)
  max.setDate(today.getDate() + 350)
  return max
})

// Lifecycles
onMounted(() => {
  airlineStore.fetchAirlines()
  locationStore.fetchLocations()
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
  
  // If locations already loaded and we have multi-trip params, restore immediately
  if (locationStore.locations.length > 0 && props.initialParams && props.initialParams.tripType === 'multi') {
    console.log('Locations already loaded on mount, restoring multi-trip params immediately')
    restoreFromParams(props.initialParams)
  }
})

// Watch for locations to be loaded, then restore params if needed
watch(
  () => locationStore.locations.length,
  (count, prevCount) => {
    // Only trigger when locations transition from empty to loaded
    if (count > 0 && prevCount === 0 && props.initialParams && props.initialParams.tripType === 'multi') {
      console.log('Locations just loaded, restoring multi-trip params')
      restoreFromParams(props.initialParams)
    }
  }
)

// Watch for initialParams changes (e.g., when navigating back)
watch(() => props.initialParams, (newParams, oldParams) => {
  if (newParams === null || newParams === undefined) {
    // Reset form to initial values when params are cleared
    segments.value = [makeSeg(), makeSeg()]
    errors.value = [
      { departure: false, arrival: false, startDate: false },
      { departure: false, arrival: false, startDate: false }
    ]
    adultCount.value = 1
    childrenCount.value = 0
    selectedAirline.value = null
    selectedCabinClass.value = '艙等不限'
    isNonStopFlight.value = false
  } else if (newParams && 
      locationStore.locations.length > 0 && 
      newParams.tripType === 'multi' &&
      JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
    console.log('MultiSearchBox: initialParams changed, restoring...', newParams)
    restoreFromParams(newParams)
  }
}, { deep: true })

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

// Parse YYYY-MM-DD string as local date (avoid timezone offset)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Restore form from URL params
function restoreFromParams(params: any) {
  // Only restore if params are for multi-trip
  if (params.tripType !== 'multi') {
    return
  }
  
  // Restore segments
  if (params.segments && params.segments.length > 0) {
    segments.value = params.segments.map((seg: any) => {
      const depAirport = findAirportByCode(seg.departureCityCode)
      const arrAirport = findAirportByCode(seg.arrivalCityCode)
      
      return {
        id: nextId++,
        departureLocation: depAirport?.location || null,
        arrivalLocation: arrAirport?.location || null,
        departureCity: depAirport?.airport || null,
        arrivalCity: arrAirport?.airport || null,
        departureDate: seg.departureDate ? parseLocalDate(seg.departureDate) : null
      }
    })
    
    // Update errors array to match segments
    errors.value = segments.value.map(() => ({
      departure: false,
      arrival: false,
      startDate: false
    }))
  } else {
    // If no segments in params, ensure we have at least default segments
    if (segments.value.length === 0) {
      segments.value = [makeSeg(), makeSeg()]
      errors.value = [
        { departure: false, arrival: false, startDate: false },
        { departure: false, arrival: false, startDate: false }
      ]
    }
  }
  
  // Restore passengers
  if (params.adults) adultCount.value = params.adults
  if (params.children) childrenCount.value = params.children
  
  // Restore filters
  if (params.airlineCode && params.airlineName) {
    selectedAirline.value = {
      iataCode: params.airlineCode,
      nameZhTw: params.airlineName
    }
  }
  if (params.cabinClass) {
    selectedCabinClass.value = params.cabinClass
  }
  if (params.nonStop) {
    isNonStopFlight.value = true
  }
}

function findAirportByCode(code: string) {
  for (const location of locationStore.locations) {
    const airport = location.airports?.find((a: any) => a.iataCode === code)
    if (airport) {
      return { location, airport }
    }
  }
  return null
}

//////////////////////
// Segments
let nextId = 1

interface Segment {
  id: number
  departureLocation: any
  arrivalLocation: any
  departureCity: any
  arrivalCity: any
  departureDate: Date | null
}

const makeSeg = (): Segment => ({
  id: nextId++,
  departureLocation: null,
  // 目的地預設選擇「日韓」區域
  arrivalLocation: (locationStore.locations && locationStore.locations.find(loc => loc.region === '日韓')) || null,
  departureCity: null,
  arrivalCity: null,
  departureDate: null
})

const segments = ref<Segment[]>([makeSeg(), makeSeg()])

// Others
const hasSearched = ref(false)

function onDocClick(e: MouseEvent) {
  const t = e.target as Node
  const closeIfOutside = (openIdxRef: any, popRefs: Record<number, any>, trigRefs: Record<number, any>) => {
    const i = openIdxRef.value
    if (i < 0) return
    const pop = popRefs[i], trig = trigRefs[i]
    if (!pop || !trig) return
    if (!pop.contains(t) && !trig.contains(t)) openIdxRef.value = -1
  }
  closeIfOutside(openDepIndex, depPopoverRefs, depTriggerRefs)
  closeIfOutside(openArrIndex, destPopoverRefs, destTriggerRefs)
  closeIfOutside(openDateIndex, datePopoverRefs, dateTriggerRefs)

  // bottom popovers
  if (isPassengersOpen.value && passPopoverRef.value && passTriggerRef.value &&
    !passPopoverRef.value.contains(t) && !passTriggerRef.value.contains(t)) {
    isPassengersOpen.value = false
  }
  if (isAirlineOpen.value && airlinePopoverRef.value && airlineTriggerRef.value &&
    !airlinePopoverRef.value.contains(t) && !airlineTriggerRef.value.contains(t)) {
    isAirlineOpen.value = false
  }
  if (
    isCabinClassOpen.value &&
    cabinClassPopoverRef.value &&
    cabinClassTriggerRef.value &&
    !cabinClassPopoverRef.value.contains(t) &&
    !cabinClassTriggerRef.value.contains(t)
  ) {
    isCabinClassOpen.value = false
  }
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openDepIndex.value = -1
    openArrIndex.value = -1
    openDateIndex.value = -1
    isPassengersOpen.value = false
    isAirlineOpen.value = false
    isCabinClassOpen.value = false
  }
}

const errors = ref([
  {
    departure: false,
    arrival: false,
    startDate: false,
  },
  {
    departure: false,
    arrival: false,
    startDate: false,
  }
])

watch(segments, (newSegments) => {
  errors.value = newSegments.map((seg, idx) => ({
    departure: hasSearched.value && !seg.departureCity,
    arrival: hasSearched.value && !seg.arrivalCity,
    startDate: hasSearched.value && (!seg.departureDate || (idx > 0 && isDateBeforePrevious(idx)))
  }))
}, { deep: true })

// Emit
const emit = defineEmits(['search'])

function onSearch() {
  hasSearched.value = true
  errors.value = segments.value.map((segment, idx) => ({
    departure: !segment.departureCity,
    arrival: !segment.arrivalCity,
    startDate: !segment.departureDate || (idx > 0 && isDateBeforePrevious(idx))
  }))

  errors.value[0].departure = false

  // If any error → stop search
  const hasError = errors.value.some(error =>
    Object.values(error).some(v => v)
  )

  if (hasError) {
    console.warn("Validation failed", errors.value)
    return
  }

  const payload = {
    flightSegments: segments.value.map((s, idx) => ({
      order: idx + 1,
      departureLocation: s.departureCity?.iataCode || 'TPE',
      arrivalLocation: s.arrivalCity?.iataCode || '',
      departureDate: s.departureDate ? formatDateToYYYYMMDD(s.departureDate) : null,
      returnDate: null
    })),
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: selectedAirline.value?.iataCode || null,
    cabinId: cabinClassMap[selectedCabinClass.value] || null,
    isNonStopFlight: isNonStopFlight.value,
    selectedRefNumbers: []
  }
  emit('search', payload)
}
</script>
<style scoped>
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
