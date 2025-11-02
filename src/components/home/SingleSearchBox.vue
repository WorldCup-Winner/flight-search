<template>
  <div>
    <!-- Search Form -->
    <div class="border-2 border-primary-gold rounded-xl rounded-tr-none">
      <div class="grid grid-cols-1 lg:grid-cols-5">
        <div class="flex flex-row col-span-2 border-r-2 border-primary-gold">
          <!-- Departure -->
          <div class="relative py-6 pl-6" ref="depTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">出發地</label>
            <div class="cursor-pointer" @click="toggleDeparture">
              <div class="text-others-gray1 mb-1">
                {{ selectedDepartureCity?.cityNameZhTw || 'TPE 台北(任何)' }}
              </div>
            </div>
            <!-- Departure Popover -->
            <transition name="fade-scale">
              <div v-if="isDepartureOpen" ref="depPopoverRef"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[750px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-4">出發地</h3>
                </div>

                <div class="p-4">
                    <div class="flex flex-row gap-1 mb-8">
                        <button v-for="location in locationStore.locations" :key="`dep-${location}`"
                            class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors"
                            :class="[
                                selectedDepartureLocation?.region === location.region
                                    ? 'border-2 border-others-original text-others-original'
                                    : 'text-others-gray1 hover:text-others-original'
                            ]" @click="selectedDepartureLocation = location">
                            {{ location.region }}
                        </button>
                    </div>
                    <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                        <button v-for="airport in selectedDepartureLocation?.airports" :key="`dep-city-${airport}`"
                            class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                            :class="[
                                selectedDepartureCity?.iataCode === airport.iataCode
                                ? 'text-others-original'
                                :'text-others-gray1 hover:text-others-original'
                            ]"
                            @click="selectDepartureCity(airport)">
                            {{ airport.cityNameZhTw }}
                        </button>
                    </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Swap -->
          <button class="flex py-6 pl-6 items-center justify-center hover:opacity-80 transition"
            aria-label="swap cities" @click="swapCities" type="button">
            <img src="@/assets/imgs/arrow-both.svg" alt="Swap Arrow" />
          </button>

          <!-- arrival -->
          <div class="relative py-6 pl-6" ref="destTriggerRef">
              <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">目的地</label>
              <div class="cursor-pointer" :class="errors.arrival ? 'text-text-error' : ''"
                  @click="toggleArrival">
                  <div class="text-others-gray1 mb-1"
                      :class="errors.arrival ? 'text-text-error' : ''">
                      {{ selectedArrivalCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
                  </div>
              </div>
              <!-- arrival Popover -->
              <transition name="fade-scale">
                  <div v-if="isArrivalOpen" ref="arrPopoverRef"
                      class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[700px]"
                      @click.stop>
                      <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                          <h3 class="text-base font-semibold pl-4">目的地</h3>
                      </div>

                      <div class="p-4">
                          <div class="flex flex-row gap-1 mb-8">
                              <button v-for="location in locationStore.locations" :key="`arr-${location}`"
                                  class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors"
                                  :class="[
                                      selectedArrivalLocation?.region === location.region
                                          ? 'border-2 border-others-original text-others-original'
                                          : 'text-others-gray1 hover:text-others-original'
                                  ]" @click="selectedArrivalLocation = location">
                                  {{ location.region }}
                              </button>
                          </div>

                          <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                              <button v-for="airport in selectedArrivalLocation?.airports" :key="`arr-city-${airport}`"
                                  class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                                  :class="[
                                      selectedArrivalCity?.iataCode === airport.iataCode
                                      ? 'text-others-original'
                                      :'text-others-gray1 hover:text-others-original'
                                  ]"
                                  @click="selectArrivalCity(airport)">
                                  {{ airport.cityNameZhTw }}
                              </button>
                          </div>
                      </div>
                  </div>
              </transition>
          </div>
        </div>

        <!-- Date (One-way only has a single date) -->
        <div class="flex relative col-span-2 justify-between border-r-2 border-primary-gold" ref="dateTriggerRef">
          <div class="relative py-6 pl-6 cursor-pointer" @click="toggleDatePicker">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">日期</label>
            <div class="pr-4">
              <div class="text-others-gray1" :class="errors.startDate ? 'text-text-error' : ''">
                {{ outboundDateText || "請選擇日期" }}</div>
            </div>
          </div>

          <!-- (Spacer only to balance layout) -->
          <div class="flex py-6 items-center justify-center opacity-0 select-none">
            <img src="@/assets/imgs/arrow-right.svg" alt="" />
          </div>

          <!-- Empty right slot to keep 2-cols width -->
          <div class="py-6"></div>

          <!-- Date Picker Popover -->
          <transition name="fade-scale">
            <div v-if="isDatePickerOpen" ref="datePopoverRef" class="absolute left-[-2rem] top-3/4 mt-2 z-50"
              @click.stop>

              <DatePicker :modelValue="startDate" :min="new Date()" :max="getMaxDate()" :type="false" @update:modelValue="startDate = $event"
                @apply="handleSingleDateApply" />
            </div>
          </transition>
        </div>

        <!-- Passengers -->
        <div class="relative py-6 pl-6" ref="passTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">人數</label>
            <div class="cursor-pointer" @click="togglePassengers">
                <div class="text-others-gray1">{{ passengerDisplayText }}</div>
            </div>

          <transition name="fade-scale">
            <div v-if="isPassengersOpen" ref="passPopoverRef"
              class="absolute -left-28 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[328px] max-w-[85vw]"
              @click.stop>
              <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                <h3 class="text-base font-semibold">人數</h3>
              </div>

              <div class="px-8 py-3">
                  <!-- Adults -->
                  <div class="flex items-center justify-between mb-2">
                      <div class="text-others-gray1 text-lg">成人 (12+)</div>
                      <div class="flex items-center gap-3">
                          <button @click="decrementAdults"
                              class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50">
                              <span class="text-3xl font-normal">−</span>
                          </button>
                          <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{
                              adultCount }}</span>
                          <button @click="incrementAdults"
                              class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                              :disabled="adultCount >= 9" type="button">
                              <span class="text-3xl font-normal">+</span>
                          </button>
                      </div>
                  </div>

                  <!-- Children -->
                  <div class="flex items-center justify-between mb-4">
                      <div class="text-others-gray1 text-lg">孩童 (2-11)</div>
                      <div class="flex items-center gap-3">
                          <button @click="decrementChildren"
                              class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                              :disabled="childrenCount <= 0" type="button">
                              <span class="text-3xl font-normal">−</span>
                          </button>
                          <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{
                              childrenCount }}</span>
                          <button @click="incrementChildren"
                              class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                              :disabled="childrenCount >= 8" type="button">
                              <span class="text-3xl font-normal">+</span>
                          </button>
                      </div>
                  </div>

                  <div class="text-sm text-others-gray5 mt-4 text-center">
                      如有嬰兒(&lt;2歲)同行，請洽票務人工訂位
                  </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Search Button + filters -->
    <div class="flex justify-between mt-6">
        <div class="flex items-center space-x-2">
            <!-- Airline Search -->
            <div class="relative" ref="airlineTriggerRef">
                <button @click="toggleAirline"
                    class="flex items-center justify-between min-w-[200px] bg-divider-soft text-primary-gold px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200">
                    <span>{{ selectedAirline.nameZhTw?.trim() || "航空公司偏好" }}</span>
                    <svg class="w-4 h-4 ml-2 transition-transform duration-200"
                        :class="{ 'rotate-180': isAirlineOpen }" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 9L2 4h8l-4 5z" />
                    </svg>
                </button>

                <!-- Airline Popover -->
                <transition name="fade-scale">
                    <div v-if="isAirlineOpen" ref="airlinePopoverRef"
                        class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[450px] max-w-[85vw]"
                        @click.stop>
                        <!-- Header -->
                        <div class="bg-primary-gold text-white px-4 py-4 rounded-t-2xl">
                            <h3 class="text-base font-semibold pl-4">航空公司搜尋</h3>
                        </div>

                        <!-- Body -->
                        <div class="p-6">
                            <!-- Search Input -->
                            <div class="mb-6">
                                <input v-model="airlineSearchTerm" type="text" placeholder="輸入航空公司名稱 / 代碼"
                                    class="w-full px-4 py-3 border-2 border-primary-gold rounded-xl text-others-gray1 placeholder-others-gray5 focus:outline-none focus:ring-2 focus:ring-others-original focus:border-transparent" />
                            </div>

                            <!-- Search Results -->
                            <div v-if="airlineSearchTerm.trim() && filteredAirlines.length > 0"
                                class="space-y-0 max-h-60 overflow-y-auto leading-relaxed text-gray-700
                                        [&::-webkit-scrollbar]:w-[6px]
                                        [&::-webkit-scrollbar-track]:bg-others-gray8
                                        [&::-webkit-scrollbar-thumb]:bg-others-original
                                        [&::-webkit-scrollbar-thumb]:rounded-[10px]">
                                <button v-for="airline in filteredAirlines" :key="airline.code"
                                    class="w-full text-left px-4 py-1 rounded-lg hover:bg-others-gray9 transition-colors"
                                    @click="selectAirline(airline)">
                                    <div class="flex items-center">
                                        <span class=" text-others-gray1 mr-2">{{ airline.iataCode }}</span>
                                        <span class="text-others-gray1">{{ airline.nameZhTw }}</span>
                                    </div>
                                </button>
                            </div>

                            <!-- Popular Airlines (when no search) -->
                            <div v-else-if="!airlineSearchTerm.trim()">
                                <h4 class="text-primary-gold font-semibold mb-4 pl-4">熱門航空公司</h4>
                                <div class="grid grid-cols-3 gap-2">
                                    <button v-for="airline in airlineStore.airlines.slice(0, 6)" :key="airline.iataCode"
                                        class="text-left px-4 py-2 rounded-lg hover:text-others-original transition-colors text-others-gray1"
                                        :class="selectedAirline.iataCode === airline.iataCode
                                                ? 'text-others-original'
                                                : 'text-others-gray1'"
                                        @click="selectAirline(airline)">
                                        {{ airline.nameZhTw }}
                                    </button>
                                </div>
                            </div>

                            <!-- No Results -->
                            <div v-else-if="airlineSearchTerm.trim() && filteredAirlines.length === 0"
                                class="text-center py-4 text-primary-gold">
                                找不到相關航空公司
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Cabin Class Selection -->
            <div class="relative" ref="cabinClassTriggerRef">
                <button @click="toggleCabinClass"
                    class="flex items-center justify-between min-w-[150px] bg-divider-soft text-primary-gold px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200">
                    <span>{{ selectedCabinClass }}</span>
                    <svg class="w-4 h-4 ml-2 transition-transform duration-200"
                        :class="{ 'rotate-180': isCabinClassOpen }" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 9L2 4h8l-4 5z" />
                    </svg>
                </button>

                <!-- Cabin Class Popover -->
                <transition name="fade-scale">
                    <div v-if="isCabinClassOpen" ref="cabinClassPopoverRef"
                        class="absolute -left-45 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[200px] max-w-[85vw]"
                        @click.stop>
                        <!-- Header -->
                        <div class="bg-primary-gold text-white px-4 py-4 rounded-t-2xl">
                            <h3 class="text-base font-semibold pl-4">艙等設定</h3>
                        </div>

                        <!-- Body -->
                        <div class="px-6 py-4">
                            <div class="space-y-3">
                                <button v-for="cabinClass in cabinClassOptions" :key="cabinClass"
                                    class="w-full text-left px-4 py-2 rounded-lg transition-colors"
                                    :class="selectedCabinClass === cabinClass
                                        ? 'text-others-original hover:bg-others-gray9'
                                        : 'text-others-gray1 hover:bg-others-gray9'"
                                    @click="selectCabinClass(cabinClass)">
                                    {{ cabinClass }}
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Direct Flight -->
            <div class="relative">
                <input id="directFlight" type="checkbox" v-model="isNonStopFlight" class="sr-only" />
                <label for="directFlight"
                    class="flex items-center justify-between min-w-[120px] bg-divider-soft text-primary-gold px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer">
                    <span>直飛</span>
                    <div class="w-4 h-4 rounded-full border-2 transition-colors duration-200 flex items-center justify-center"
                        :class="isNonStopFlight ? 'border-none bg-others-original' : 'border-primary-gold bg-none'">
                    </div>
                </label>
            </div>
        </div>

        <button
            class="px-4 py-1 w-[150px] h-[50px] rounded-[15px] border-none font-bold bg-others-original text-white hover:bg-others-hover transition"
            @click="onSearch">
            搜尋
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useAirlineStore } from '@/stores/airline'

import DatePicker from '@/components/ui/DatePicker.vue'
import { formatDate, getMaxDate, formatDateLocal } from '@/utils'
import dayjs from 'dayjs'

// Stores
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

// Location (Departure and Arrival)
const selectedDepartureLocation = ref('')
const selectedDepartureCity = ref('')
const selectedArrivalLocation = ref('')
const selectedArrivalCity = ref('')

// Date Range
const startDate = ref('')

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
const depTriggerRef = ref(null)
const depPopoverRef = ref(null)
const destTriggerRef = ref(null)
const arrPopoverRef = ref(null)
const dateTriggerRef = ref(null)
const datePopoverRef = ref(null)
const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

// Filter Options
const airlineSearchTerm = ref('')
const selectedAirline = ref({
    iataCode: null,
    nameZhTw: null
})
const selectedCabinClass = ref('艙等不限')
const isNonStopFlight = ref(false)
const cabinClassMap = {
    '艙等不限': null,
    '經濟艙': 'M',
    '豪華經濟艙': 'W',
    '商務艙': 'C',
    '頭等艙': 'F'
}

// Computed
const filteredAirlines = computed(() => {
    const s = airlineSearchTerm.value.toLowerCase()
    return airlineStore.airlines.filter(a => a.iataCode.toLowerCase().includes(s) || a.nameZhTw.toLowerCase().includes(s))
})
const passengerDisplayText = computed(() => `${adultCount.value}成人 / ${childrenCount.value}孩童`)
const outboundDateText = computed(() => (startDate.value ? formatDate(startDate.value) : ''))

// Lifecycles
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

// Methods
function selectDepartureCity(city) {
    selectedDepartureCity.value = city
    isDepartureOpen.value = false
}
function selectArrivalCity(city) {
    selectedArrivalCity.value = city
    isArrivalOpen.value = false
}
function swapCities() {
    let temp = selectedDepartureLocation.value
    selectedDepartureLocation.value = selectedArrivalLocation.value
    selectedArrivalLocation.value = temp

    temp = selectedDepartureCity.value
    selectedDepartureCity.value = selectedArrivalCity.value
    selectedArrivalCity.value = temp
}
function incrementAdults() { 
  const totalPassengers = adultCount.value + childrenCount.value
  if (adultCount.value < 9 && totalPassengers < 9)
    adultCount.value++ 
}
function decrementAdults() {
  if (adultCount.value > 1) adultCount.value--
}
function incrementChildren() { 
  const totalPassengers = adultCount.value + childrenCount.value
  if (childrenCount.value < 8 && totalPassengers < 9)
    childrenCount.value++ 
}
function decrementChildren() {
  if (childrenCount.value > 0) childrenCount.value--
}
function toggleDeparture() { isDepartureOpen.value = !isDepartureOpen.value }
function toggleArrival() { isArrivalOpen.value = !isArrivalOpen.value }
function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function toggleDatePicker() { isDatePickerOpen.value = !isDatePickerOpen.value }
function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}
function selectAirline(airline) {
  selectedAirline.value = airline
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']
function selectCabinClass(v) {
  selectedCabinClass.value = v
  isCabinClassOpen.value = false
}

const errors = ref({
    arrival: false,
    startDate: false,
})

// 👀 Watch arrival
watch(selectedArrivalCity, (newVal) => {
  errors.value.arrival = !newVal
})

// 👀 Watch start date
watch(startDate, (newVal) => {
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
        departureDate: formatDateLocal(startDate.value),
        returnDate: null
      }
    ],
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: selectedAirline.value.iataCode || null,
    cabinId: cabinClassMap[selectedCabinClass.value] || null,
    isNonStopFlight: isNonStopFlight.value,
    selectedRefNumbers: []
  }
  emit('search', payload)
}

function handleSingleDateApply(date) {
    isDatePickerOpen.value = false
}

// Others
function onDocClick(e) {
  const t = e.target
  const closeIfOutside = (openRef, popRef, trigRef, setter) => {
    if (!openRef.value) return
    if (popRef.value && !popRef.value.contains(t) && trigRef.value && !trigRef.value.contains(t)) setter(false)
  }

  closeIfOutside(isDepartureOpen, depPopoverRef, depTriggerRef, v => (isDepartureOpen.value = v))
  closeIfOutside(isArrivalOpen, arrPopoverRef, destTriggerRef, v => (isArrivalOpen.value = v))
  closeIfOutside(isDatePickerOpen, datePopoverRef, dateTriggerRef, v => (isDatePickerOpen.value = v))
  closeIfOutside(isPassengersOpen, passPopoverRef, passTriggerRef, v => (isPassengersOpen.value = v))
  closeIfOutside(isAirlineOpen, airlinePopoverRef, airlineTriggerRef, v => (isAirlineOpen.value = v))
  closeIfOutside(isCabinClassOpen, cabinClassPopoverRef, cabinClassTriggerRef, v => (isCabinClassOpen.value = v))
}
function onKey(e) {
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