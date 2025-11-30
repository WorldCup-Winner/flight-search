<template>
  <div>
    <!-- Search Form -->
    <div class="border-2 border-primary-gold rounded-xl rounded-tr-none">
      <div class="grid grid-cols-1 lg:grid-cols-5">
        <div class="grid grid-cols-[1fr_auto_1fr] md:flex md:flex-row col-span-2 lg:border-r-2 border-primary-gold border-b-2 md:border-b-0 px-4 md:px-0 py-3 md:py-0">
          <!-- Departure -->
          <div class="contents md:block md:relative md:py-6 md:pl-6" ref="depTriggerRef">
            <label class="text-sm md:text-h5 text-primary-gold font-bold col-start-1 row-start-1 md:mb-2 md:block">出發地</label>
            <div class="cursor-pointer col-start-1 row-start-2 md:row-auto" @click="toggleDeparture">
              <div class="text-sm md:text-base text-others-gray1">
                {{ selectedDepartureCity?.cityNameZhTw || '台北/桃園' }}
              </div>
            </div>
            <!-- Departure Popover -->
            <transition name="fade-scale">
                <div
                    v-if="isDepartureOpen"
                    ref="depPopoverRef"
                    class="fixed inset-0 z-[100] bg-black/40 flex items-end
                           md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                    @click.self="isDepartureOpen = false"
                >
                    <LocationPicker
                        title="出發地"
                        :locations="locationStore.locations"
                        :selected-city="selectedDepartureCity"
                        search-placeholder="輸入國家/城市/機場關鍵字"
                        @select="selectDepartureCity"
                        @close="isDepartureOpen = false"
                        @search="locationStore.fetchLocationAutocomplete"
                        @clear="locationStore.clearAutocompleteResults"
                    />
                </div>
            </transition>
          </div>

          <!-- Swap -->
          <button class="col-start-2 row-start-1 row-span-2 flex items-center justify-center px-2 md:py-6 md:pl-6 hover:opacity-80 transition"
            aria-label="swap cities" @click="swapCities" type="button">
            <img src="@/assets/imgs/arrow-both.svg" alt="Swap Arrow" class="w-5 h-5 md:w-auto md:h-auto" />
          </button>

          <!-- Arrival -->
          <div class="contents md:block md:relative md:py-6 md:pl-6" ref="destTriggerRef">
              <label class="text-sm md:text-h5 text-primary-gold font-bold col-start-3 row-start-1 md:mb-2 md:block">目的地</label>
              <div class="cursor-pointer col-start-3 row-start-2 md:row-auto" :class="errors.arrival ? 'text-text-error' : ''"
                  @click="toggleArrival">
                  <div class="text-sm md:text-base text-others-gray1"
                      :class="errors.arrival ? 'text-text-error' : ''">
                      {{ selectedArrivalCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
                  </div>
              </div>
              <!-- Arrival Popover -->
              <transition name="fade-scale">
                  <div
                      v-if="isArrivalOpen"
                      ref="arrPopoverRef"
                      class="fixed inset-0 z-[100] bg-black/40 flex items-end
                             md:absolute md:inset-auto md:bg-transparent md:block md:left-0 md:top-full md:mt-2 md:z-50"
                      @click.self="isArrivalOpen = false"
                  >
                      <LocationPicker
                          title="目的地"
                          :locations="locationStore.locations"
                          :selected-city="selectedArrivalCity"
                          search-placeholder="輸入國家/城市/機場關鍵字"
                          @select="selectArrivalCity"
                          @close="isArrivalOpen = false"
                          @search="locationStore.fetchLocationAutocomplete"
                          @clear="locationStore.clearAutocompleteResults"
                      />
                  </div>
              </transition>
          </div>
        </div>

        <!-- Date (One-way only has a single date) -->
        <div class="grid grid-cols-[auto_1fr] md:flex relative col-span-2 lg:border-r-2 border-primary-gold border-b-2 md:border-b-0 px-4 md:px-0 py-3 md:py-0" ref="dateTriggerRef">
          <div class="contents md:block md:relative md:py-6 md:pl-6 cursor-pointer" @click="toggleDatePicker">
            <label class="text-sm md:text-h5 text-primary-gold font-bold col-start-1 row-start-1 md:mb-2 md:block">日期</label>
            <div class="col-start-2 row-start-1 md:row-auto pl-4 md:pl-0">
              <div class="text-sm md:text-base text-others-gray1" :class="errors.startDate ? 'text-text-error' : ''">
                {{ outboundDateText || "請選擇日期" }}</div>
            </div>
          </div>

          <!-- (Spacer only to balance layout - desktop only) -->
          <div class="hidden md:flex py-6 items-center justify-center opacity-0 select-none">
            <img src="@/assets/imgs/arrow-right.svg" alt="" />
          </div>

          <!-- Empty right slot to keep 2-cols width - desktop only -->
          <div class="hidden md:block py-6"></div>

          <!-- Date Picker Popover -->
          <transition name="fade-scale">
            <div
              v-if="isDatePickerOpen"
              ref="datePopoverRef"
              class="fixed inset-0 z-[100] bg-black/40 md:absolute md:inset-auto md:bg-transparent md:z-50 md:left-[-2rem] md:top-3/4 md:mt-2"
              @click.stop
            >
              <DatePicker
                  :modelValue="startDate"
                  :min="new Date()"
                  :max="maxDate"
                  @update:modelValue="startDate = $event"
                  @apply="handleSingleDateApply"
                  @close="isDatePickerOpen = false"
              />
            </div>
          </transition>
        </div>

        <!-- Passengers -->
        <div class="relative py-4 md:py-6 pl-4 md:pl-6" ref="passTriggerRef">
            <label class="text-sm md:text-h5 text-primary-gold font-bold mb-2 block">人數</label>
            <div class="cursor-pointer" @click="togglePassengers">
                <div class="text-sm md:text-base text-others-gray1">{{ passengerDisplayText }}</div>
            </div>

          <transition name="fade-scale">
            <div
              v-if="isPassengersOpen"
              ref="passPopoverRef"
              class="fixed inset-0 z-[100] bg-black/40 flex items-end
                     md:absolute md:inset-auto md:bg-transparent md:block md:-left-28 md:top-full md:mt-2 md:z-50"
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

    <!-- Search Button + filters -->
    <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-0 mt-4 md:mt-6">
        <div class="flex flex-wrap items-center gap-2">
            <!-- Airline Search -->
            <div class="relative flex-1 md:flex-none" ref="airlineTriggerRef">
                <button @click="toggleAirline"
                    class="flex items-center justify-between w-full md:min-w-[200px] bg-divider-soft text-primary-gold px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200">
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
                            @close="isAirlineOpen = false"
                        />
                    </div>
                </transition>
            </div>

            <!-- Cabin Class Selection -->
            <div class="relative flex-1 md:flex-none" ref="cabinClassTriggerRef">
                <button @click="toggleCabinClass"
                    class="flex items-center justify-between w-full md:min-w-[150px] bg-divider-soft text-primary-gold px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200">
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
                <input id="directFlight" type="checkbox" v-model="isNonStopFlight" class="sr-only" />
                <label for="directFlight"
                    class="flex items-center justify-between w-full md:min-w-[120px] bg-divider-soft text-primary-gold px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200 cursor-pointer">
                    <span>直飛</span>
                    <div class="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                        :class="isNonStopFlight ? 'border-none bg-others-original' : 'border-primary-gold bg-none'">
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
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useAirlineStore } from '@/stores/airline'
import type { Location, Airline } from '@/utils/types'

import DatePicker from '@/components/ui/DatePicker.vue'
import LocationPicker from '@/components/ui/LocationPicker.vue'
import AirlinePicker from '@/components/ui/AirlinePicker.vue'
import CabinClassPicker from '@/components/ui/CabinClassPicker.vue'
import PassengerPicker from '@/components/ui/PassengerPicker.vue'
import { formatDate, formatDateToYYYYMMDD } from '@/utils'

interface Airport {
    iataCode: string
    cityNameZhTw: string
    airportNameZh?: string
    cityDisplayOrder?: number
}

// Props
const props = defineProps<{
  initialParams?: any
}>()

// Stores
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

// Location (Departure and Arrival)
const selectedDepartureLocation = ref<Location | null>(locationStore.locations[0] ?? null)
const selectedDepartureCity = ref<Airport | null>(locationStore.locations[0]?.airports?.[0] ?? null)
// 目的地預設選擇「日韓」區域
const selectedArrivalLocation = ref<Location | null>(
    locationStore.locations.find(loc => loc.region === '日韓') ??
    locationStore.locations[0] ??
    null
)
const selectedArrivalCity = ref<Airport | null>(null)

// Date Range
const startDate = ref<Date | null>(null)

// Adults and Children
const adultCount = ref(1)
const childrenCount = ref(0)

// Open States
const isDepartureOpen = ref(false)
const isArrivalOpen = ref(false)
const isDatePickerOpen = ref(false)
const isPassengersOpen = ref(false)
const isAirlineOpen = ref(false)
const isCabinClassOpen = ref(false)

// Triggers
const depTriggerRef = ref<HTMLElement | null>(null)
const depPopoverRef = ref<HTMLElement | null>(null)
const destTriggerRef = ref<HTMLElement | null>(null)
const arrPopoverRef = ref<HTMLElement | null>(null)
const dateTriggerRef = ref<HTMLElement | null>(null)
const datePopoverRef = ref<HTMLElement | null>(null)
const passTriggerRef = ref<HTMLElement | null>(null)
const passPopoverRef = ref<HTMLElement | null>(null)
const airlineTriggerRef = ref<HTMLElement | null>(null)
const airlinePopoverRef = ref<HTMLElement | null>(null)
const cabinClassTriggerRef = ref<HTMLElement | null>(null)
const cabinClassPopoverRef = ref<HTMLElement | null>(null)

// Filter Options
const airlineSearchTerm = ref('')
const selectedAirline = ref<Airline | null>(null)
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙'] as const
type CabinClassOption = typeof cabinClassOptions[number]
const selectedCabinClass = ref<CabinClassOption>('艙等不限')
const isNonStopFlight = ref(false)
const cabinClassMap: Record<CabinClassOption, string | null> = {
    '艙等不限': null,
    '經濟艙': 'M',
    '豪華經濟艙': 'W',
    '商務艙': 'C',
    '頭等艙': 'F'
}

// Computed
const filteredAirlines = computed(() => {
    const term = airlineSearchTerm.value.trim().toLowerCase()
    return airlineStore.airlines.filter((airline: Airline) => {
        const code = airline.iataCode?.toLowerCase() ?? ''
        const name = airline.nameZhTw?.toLowerCase() ?? ''
        return code.includes(term) || name.includes(term)
    })
})
const passengerDisplayText = computed(() => `${adultCount.value}成人 / ${childrenCount.value}孩童`)
const outboundDateText = computed(() => formatDate(startDate.value))

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
  
  // If locations already loaded and we have oneway params, restore immediately
  if (locationStore.locations.length > 0 && props.initialParams && props.initialParams.tripType === 'oneway') {
    console.log('Locations already loaded on mount, restoring oneway params immediately')
    restoreFromParams(props.initialParams)
  }
})

// Watch for locations to be loaded, then restore params
watch(
  () => locationStore.locations.length,
  (count, prevCount) => {
    // Only trigger when locations transition from empty to loaded
    if (count > 0 && prevCount === 0 && props.initialParams && props.initialParams.tripType === 'oneway') {
      console.log('Locations just loaded, restoring oneway params')
      restoreFromParams(props.initialParams)
    }
  }
)

// Watch for initialParams changes (e.g., when navigating back)
watch(() => props.initialParams, (newParams) => {
  // Only restore if locations are available
  if (newParams && locationStore.locations.length > 0) {
    console.log('SingleSearchBox: initialParams changed, restoring...', newParams)
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
  console.log('Restoring SingleSearchBox from params:', params)
  
  // Only restore if params are for oneway
  if (params.tripType !== 'oneway') {
    console.log('Params are not for oneway, skipping restoration')
    return
  }
  
  // Restore cities
  if (params.departureCityCode) {
    const depAirport = findAirportByCode(params.departureCityCode)
    if (depAirport) {
      selectedDepartureCity.value = depAirport.airport
      selectedDepartureLocation.value = depAirport.location
    }
  }
  if (params.arrivalCityCode) {
    const arrAirport = findAirportByCode(params.arrivalCityCode)
    if (arrAirport) {
      selectedArrivalCity.value = arrAirport.airport
      selectedArrivalLocation.value = arrAirport.location
    }
  }
  
  // Restore dates
  if (params.departureDate) {
    startDate.value = parseLocalDate(params.departureDate)
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
  if (params.cabinClass && isCabinClassOption(params.cabinClass)) {
    selectedCabinClass.value = params.cabinClass
  }
  if (params.nonStop) {
    isNonStopFlight.value = true
  }
}

function findAirportByCode(code: string): { location: Location; airport: Airport } | null {
  for (const location of locationStore.locations) {
    const airport = location.airports?.find((a: Airport) => a.iataCode === code)
    if (airport) {
      return { location, airport }
    }
  }
  return null
}

// Methods
function selectDepartureCity(city: Airport) {
    selectedDepartureCity.value = city
    isDepartureOpen.value = false
}
function selectArrivalCity(city: Airport) {
    selectedArrivalCity.value = city
    isArrivalOpen.value = false
}
function swapCities() {
    const tempLocation = selectedDepartureLocation.value
    selectedDepartureLocation.value = selectedArrivalLocation.value
    selectedArrivalLocation.value = tempLocation

    const tempCity = selectedDepartureCity.value
    selectedDepartureCity.value = selectedArrivalCity.value
    selectedArrivalCity.value = tempCity
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
function toggleDeparture() { isDepartureOpen.value = !isDepartureOpen.value }
function toggleArrival() { 
    // 點擊目的地時，確保選擇「日韓」區域
    if (!isArrivalOpen.value && locationStore.locations) {
        const japanKorea = locationStore.locations.find(loc => loc.region === '日韓')
        if (japanKorea) {
            selectedArrivalLocation.value = japanKorea
        }
    }
    isArrivalOpen.value = !isArrivalOpen.value 
}
function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function toggleDatePicker() { isDatePickerOpen.value = !isDatePickerOpen.value }
function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}
function selectAirline(airline: Airline) {
  selectedAirline.value = airline
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}
function selectCabinClass(v: string) {
  if (isCabinClassOption(v)) {
    selectedCabinClass.value = v
  }
  isCabinClassOpen.value = false
}

function isCabinClassOption(v: string): v is CabinClassOption {
  return (cabinClassOptions as readonly string[]).includes(v)
}

function onPassengerUpdate(payload: { adults: number; children: number }) {
  adultCount.value = payload.adults
  childrenCount.value = payload.children
}

const errors = ref({
    arrival: false,
    startDate: false,
})

// 👀 Watch arrival
watch(selectedArrivalCity, (newVal: Airport | null) => {
  errors.value.arrival = !newVal
})

// 👀 Watch start date
watch(startDate, (newVal: Date | null) => {
  errors.value.startDate = !newVal
})

// Emit
const emit = defineEmits(['search'])

function onSearch() {
    errors.value = {
        arrival: !selectedArrivalCity.value,
        startDate: !startDate.value,
    }
    // If any error → stop search
    if (Object.values(errors.value).some(v => v)) {
        console.warn("Validation failed", errors.value)
        return
    }
  const payload = {
    flightSegments: [
      {
        order: 1,
        departureLocation: selectedDepartureCity.value?.iataCode || 'TPE',
        arrivalLocation: selectedArrivalCity.value?.iataCode || '',
        departureDate: startDate.value ? formatDateToYYYYMMDD(startDate.value) : null,
        returnDate: null
      }
    ],
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: selectedAirline.value?.iataCode || null,
    cabinId: cabinClassMap[selectedCabinClass.value] || null,
    isNonStopFlight: isNonStopFlight.value,
    selectedRefNumbers: []
  }
  emit('search', payload)
}

function handleSingleDateApply() {
    isDatePickerOpen.value = false
}

// Others
type BooleanRef = Ref<boolean>
type ElementRef = Ref<HTMLElement | null>

function onDocClick(e: MouseEvent) {
  const target = e.target
  if (!(target instanceof Node)) return

  const closeIfOutside = (openRef: BooleanRef, popRef: ElementRef, trigRef: ElementRef) => {
    if (!openRef.value) return
    const pop = popRef.value
    const trig = trigRef.value
    if (pop && !pop.contains(target) && trig && !trig.contains(target)) {
      openRef.value = false
    }
  }

  closeIfOutside(isDepartureOpen, depPopoverRef, depTriggerRef)
  closeIfOutside(isArrivalOpen, arrPopoverRef, destTriggerRef)
  closeIfOutside(isDatePickerOpen, datePopoverRef, dateTriggerRef)
  closeIfOutside(isPassengersOpen, passPopoverRef, passTriggerRef)
  closeIfOutside(isAirlineOpen, airlinePopoverRef, airlineTriggerRef)
  closeIfOutside(isCabinClassOpen, cabinClassPopoverRef, cabinClassTriggerRef)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isDepartureOpen.value = false
    isArrivalOpen.value = false
    isDatePickerOpen.value = false
    isPassengersOpen.value = false
    isAirlineOpen.value = false
    isCabinClassOpen.value = false
  }
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