<template>
  <div>
    <div class="space-y-4">
      <div v-for="(seg, idx) in segments" :key="idx"
        class="border-2 border-primary-gold rounded-xl flex flex-row"
        :class="{ 'rounded-tr-none': idx === 0 }">
        <!-- Left index badge column -->
        <div class="w-[5%]">
          <div
            class="h-full rounded-l-[10px] bg-primary-gold2 russo text-white text-5xl flex items-center justify-center">
            {{ idx + 1 }}
          </div>
        </div>

        <div class="relative flex flex-row w-[60%] border-l-2 border-primary-gold px-10">
          <!-- Departure -->
          <div class="relative py-6 w-[35%]" :ref="setDepTriggerRef(idx)">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">出發地</label>
            <div class="cursor-pointer" :class="errors[idx].departure ? 'text-text-error' : ''" @click="toggleDeparture(idx)">
              <div v-if="idx === 0" class="text-others-gray1 mb-1">
                {{ seg.departureCity?.cityNameZhTw || 'TPE 台北(任何)' }}
              </div>
              <div v-else class="text-others-gray1 mb-1" :class="errors[idx].departure ? 'text-text-error' : ''">
                {{ seg.departureCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
              </div>
            </div>
            <!-- Departure Popover -->
            <transition name="fade-scale">
              <div v-if="openDepIndex === idx" :ref="setDepPopoverRef(idx)"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[750px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-4">出發地</h3>
                </div>

                <div class="p-4">
                  <div class="flex flex-row gap-1 mb-8">
                      <button v-for="location in locationStore.locations" :key="`dep-${idx}-${location}`"
                          class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors"
                          :class="[
                              seg.departureLocation?.region === location.region
                                  ? 'border-2 border-others-original text-others-original'
                                  : 'text-others-gray1 hover:text-others-original'
                          ]" @click="seg.departureLocation = location">
                          {{ location.region }}
                      </button>
                  </div>
                  <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                      <button v-for="airport in seg.departureLocation?.airports" :key="`dep-city-${idx}-${airport}`"
                      class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                      :class="[
                                seg.departureCity?.iataCode === airport.iataCode
                                ? 'text-others-original'
                                :'text-others-gray1 hover:text-others-original'
                            ]"
                      @click="selectDepartureCity(idx, airport)">
                        {{ airport.cityNameZhTw }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Swap -->
          <button class="flex py-6 w-[20%] items-center justify-center hover:opacity-80 transition"
            aria-label="swap cities" @click="swapCities(idx)" type="button">
            <img src="@/assets/imgs/arrow-right.svg" alt="Swap Arrow" />
          </button>

          <!-- Arrival -->
          <div class="relative py-6 w-[45%]" :ref="setArrTriggerRef(idx)">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">目的地</label>
            <div class="cursor-pointer pr-4" :class="errors[idx].arrival ? 'text-text-error' : ''" @click="toggleArrival(idx)">
              <div class="text-others-gray1" :class="errors[idx].arrival ? 'text-text-error' : ''">
                {{ seg.arrivalCity?.cityNameZhTw || '輸入國家/城市/機場關鍵字' }}
              </div>
            </div>

            <!-- Arrival Popover -->
            <transition name="fade-scale">
              <div v-if="openArrIndex === idx" :ref="setArrPopoverRef(idx)"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[750px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-4">目的地</h3>
                </div>

                <div class="p-4">
                  <div class="flex flex-row gap-1 mb-8">
                    <button v-for="location in locationStore.locations" :key="`arr-${idx}-${location}`"
                      class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors" :class="[
                        seg.arrivalLocation?.region === location.region
                          ? 'border-2 border-others-original text-others-original'
                          : 'text-others-gray1 hover:text-others-original'
                      ]" @click="seg.arrivalLocation = location">
                      {{ location.region }}
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                    <button v-for="airport in seg.arrivalLocation?.airports" :key="`arr-city-${idx}-${airport}`"
                      class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                      :class="[
                                seg.arrivalCity?.iataCode === airport.iataCode
                                ? 'text-others-original'
                                :'text-others-gray1 hover:text-others-original'
                            ]"
                      @click="selectArrivalCity(idx, airport)">
                        {{ airport.cityNameZhTw }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Date column -->
        <div class="relative w-[35%] flex flex-row justify-between">
          <div class="border-t-0 border-l-2 border-primary-gold px-6 py-6"
            :ref="setDateTriggerRef(idx)">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">日期</label>
            <div class="text-others-gray1 cursor-pointer" :class="errors[idx].startDate ? 'text-text-error' : ''" @click="toggleDate(idx)">
              {{ formatDate(seg.departureDate) || '請選擇日期' }}
            </div>

            <!-- Date picker -->
            <transition name="fade-scale">
              <div v-if="openDateIndex === idx" :ref="setDatePopoverRef(idx)"
                class="absolute lg:left-auto lg:right-6 left-0 top-full mt-2 z-50" @click.stop>
                <DatePicker :modelValue="seg.departureDate" :min="new Date()" :max="getMaxDate()"
                  @update:modelValue="d => (segments[idx].departureDate = d)" @apply="d => onDateApply(idx, d)" />
              </div>
            </transition>
          </div>

          <!-- Delete button on segments 3..5 -->
          <div class="justify-end mt-4 px-4">
            <button v-if="segments.length > 2 && idx >= 2" @click="removeSegment(idx)" type="button"
              class="w-8 h-8 text-xl rounded-lg bg-others-original text-white grid place-items-center hover:bg-others-original/90"
              aria-label="remove segment" title="移除此航段">
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Add segment -->
      <div class="flex flex-row w-full border-2 border-primary-gold rounded-xl">
        <div class="w-[65%] py-6 px-8">
          <button @click="addSegment" type="button"
            class="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white"
            :class="canAdd ? 'bg-others-original hover:bg-others-original/85' : 'bg-gray-300 cursor-not-allowed'"
            :disabled="!canAdd">
            <span class="text-2xl leading-none">＋</span> 增加航班
          </button>
        </div>
        <div class="w-[35%] border-t-0 border-l-2 border-primary-gold pl-6 py-6">
          <!-- Passengers -->
          <div class="relative" ref="passTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">人數</label>
            <div class="cursor-pointer text-others-gray1" @click="togglePassengers">
              {{ passengerDisplayText }}
            </div>

            <!-- Passengers popover -->
            <transition name="fade-scale">
              <div v-if="isPassengersOpen" ref="passPopoverRef"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[328px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                    <h3 class="text-base font-semibold pl-4">人數</h3>
                </div>

                <div class="px-8 py-3">
                  <!-- Adults -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-others-gray1 text-lg">成人 (12+)</div>
                    <div class="flex items-center gap-3">
                      <button @click="decrementAdults" :disabled="adultCount <= 1" type="button"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50">
                        <span class="text-3xl font-normal">−</span>
                      </button>
                      <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{ adultCount
                      }}</span>
                      <button @click="incrementAdults" :disabled="adultCount >= 9" type="button"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50">
                        <span class="text-3xl font-normal">+</span>
                      </button>
                    </div>
                  </div>
                  <!-- Children -->
                  <div class="flex items-center justify-between">
                    <div class="text-others-gray1 text-lg">孩童 (2-11)</div>
                    <div class="flex items-center gap-3">
                      <button @click="decrementChildren" :disabled="childrenCount <= 0" type="button"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50">
                        <span class="text-3xl font-normal">−</span>
                      </button>
                      <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{ childrenCount
                      }}</span>
                      <button @click="incrementChildren" :disabled="childrenCount >= 8" type="button"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50">
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
import { ref, watch, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useAirlineStore } from '@/stores/airline'

import DatePicker from '@/components/ui/DatePicker.vue'
import { formatDate, getMaxDate } from '@/utils'

// Stores
const airlineStore = useAirlineStore()
const locationStore = useLocationStore()

// Adults and Children
const adultCount = ref(1)
const childrenCount = ref(0)

// Filter Options
const airlineSearchTerm = ref('')
const selectedAirline = ref({
    iataCode: null,
    nameZhTw: null
})
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']
const selectedCabinClass = ref('艙等不限')
const isNonStopFlight = ref(false)
const cabinClassMap = {
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
const depTriggerRefs = reactive({})
const depPopoverRefs = reactive({})
const destTriggerRefs = reactive({})
const destPopoverRefs = reactive({})
const dateTriggerRefs = reactive({})
const datePopoverRefs = reactive({})

const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

const setDepTriggerRef = i => el => { if (el) depTriggerRefs[i] = el }
const setDepPopoverRef = i => el => { if (el) depPopoverRefs[i] = el }
const setArrTriggerRef = i => el => { if (el) destTriggerRefs[i] = el }
const setArrPopoverRef = i => el => { if (el) destPopoverRefs[i] = el }
const setDateTriggerRef = i => el => { if (el) dateTriggerRefs[i] = el }
const setDatePopoverRef = i => el => { if (el) datePopoverRefs[i] = el }

// Methods
function toggleDeparture(i) { openDepIndex.value = openDepIndex.value === i ? -1 : i }
function toggleArrival(i) { openArrIndex.value = openArrIndex.value === i ? -1 : i }
function toggleDate(i) { openDateIndex.value = openDateIndex.value === i ? -1 : i }
function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
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

function addSegment() {
  if (!canAdd.value) return
  segments.value.push(makeSeg())
  errors.value.push({
    departure: false,
    arrival: false,
    startDate: false,
  })
}
function removeSegment(idx) {
  if (segments.value.length <= 2) return
  segments.value.splice(idx, 1)
  errors.value.splice(idx, 1)
}

function selectDepartureCity(i, city) {
  segments.value[i].departureCity = city
  openDepIndex.value = -1
}
function selectArrivalCity(i, city) {
  segments.value[i].arrivalCity = city
  openArrIndex.value = -1
}
function selectCabinClass(v) {
  selectedCabinClass.value = v
  isCabinClassOpen.value = false
}
function onDateApply(i, d) {
  segments.value[i].departureDate = d
  openDateIndex.value = -1
}
function swapCities(i) {
  const s = segments.value[i]

  let temp = s.departureLocation
  s.departureLocation = s.arrivalLocation
  s.arrivalLocation = temp

  temp = s.departureCity
  s.departureCity = s.arrivalCity
  s.arrivalCity = temp
}
function selectAirline(airline) {
  selectedAirline.value = airline
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

// Lifecycles
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

//////////////////////
// Segments
let nextId = 1

const makeSeg = () => ({
  id: nextId++,
  departureLocation: null,
  arrivalLocation: null,
  departureCity: null,
  arrivalCity: null,
  departureDate: null
})

const segments = ref([makeSeg(), makeSeg()])

// Others
const hasSearched = ref(false)

function onDocClick(e) {
  const t = e.target
  const closeIfOutside = (openIdxRef, popRefs, trigRefs) => {
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
function onKey(e) {
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
  errors.value = newSegments.map(seg => ({
    departure: hasSearched.value && !seg.departureCity,
    arrival: hasSearched.value && !seg.arrivalCity,
    startDate: hasSearched.value && !seg.departureDate
  }))
}, { deep: true })

// Emit
const emit = defineEmits(['search'])

function onSearch() {
  hasSearched.value = true
  errors.value = segments.value.map((segment) => ({
    departure: !segment.departureCity,
    arrival: !segment.arrivalCity,
    startDate: !segment.departureDate
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
      departureDate: s.departureDate ? s.departureDate.toISOString().slice(0, 10) : null,
      returnDate: null
    })),
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: selectedAirline.value.iataCode || null,
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
