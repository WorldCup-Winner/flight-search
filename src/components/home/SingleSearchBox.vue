<template>
  <div>
    <!-- Search Form -->
    <div class="border-2 border-primary-gold rounded-xl rounded-tr-none px-5">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div class="grid grid-cols-12 col-span-2 gap-4 border-r-2 border-primary-gold">
          <!-- Departure -->
          <div class="relative py-6 col-span-4" ref="depTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">出發地</label>
            <div class="cursor-pointer" @click="toggleDeparture">
              <div class="text-others-gray1 mb-1">
                {{ selectedDepartureCity || 'TPE 台北(任何)' }}
              </div>
            </div>

            <!-- Departure Popover -->
            <transition name="fade-scale">
              <div v-if="isDepartureOpen" ref="depPopoverRef"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[680px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-5">出發地</h3>
                </div>

                <div class="p-5">
                  <div class="grid grid-cols-8 gap-1 mb-8">
                    <button v-for="region in regions" :key="`dep-${region}`"
                      class="rounded-xl py-2 px-0 text-[18px] leading-none transition-colors" :class="[
                        selectedDepartureRegion === region
                          ? 'border-2 border-others-original text-others-original'
                          : 'text-others-gray1 hover:text-others-original'
                      ]" @click="selectedDepartureRegion = region">
                      {{ region }}
                    </button>
                  </div>

                  <div class="grid grid-cols-8 gap-0 gap-y-5 pb-4">
                    <button v-for="city in currentDepartureCities" :key="`dep-city-${city}`"
                      class="text-[17px] font-medium text-others-gray1 hover:text-others-original transition-colors"
                      @click="selectDepartureCity(city)">
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Swap -->
          <button class="col-span-1 flex py-6 items-center justify-center hover:opacity-80 transition"
            aria-label="swap cities" @click="swapCities" type="button">
            <img src="@/assets/imgs/arrow-both.svg" alt="Swap Arrow" />
          </button>

          <!-- Destination -->
          <div class="relative py-6 col-span-7" ref="destTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">目的地</label>
            <div class="cursor-pointer pr-4" :class="errors.destination ? 'text-text-error' : ''" @click="toggleDestination">
                <div class="font-medium text-others-gray1 mb-1"
                    :class="errors.destination ? 'text-text-error' : ''">
                    {{ selectedDestinationCity || '輸入國家/城市/機場關鍵字' }}
                </div>
            </div>

            <!-- Destination Popover -->
            <transition name="fade-scale">
              <div v-if="isDestinationOpen" ref="destPopoverRef"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[680px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-5">目的地</h3>
                </div>

                <div class="p-5">
                  <div class="grid grid-cols-8 gap-1 mb-8">
                    <button v-for="region in regions" :key="`dest-${region}`"
                      class="rounded-xl py-2 px-0 text-[18px] leading-none transition-colors" :class="[
                        selectedDestinationRegion === region
                          ? 'border-2 border-others-original text-others-original'
                          : 'text-others-gray1 hover:text-others-original'
                      ]" @click="selectedDestinationRegion = region">
                      {{ region }}
                    </button>
                  </div>

                  <div class="grid grid-cols-8 gap-0 gap-y-5 pb-4">
                    <button v-for="city in currentDestinationCities" :key="`dest-city-${city}`"
                      class="text-[17px] font-medium text-others-gray1 hover:text-others-original transition-colors"
                      @click="selectDestinationCity(city)">
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Date (One-way only has a single date) -->
        <div class="flex relative col-span-2 justify-between gap-4 border-r-2 border-primary-gold" ref="dateTriggerRef">
          <div class="relative py-6 cursor-pointer" @click="toggleDatePicker">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">日期</label>
            <div class="pr-4">
              <div class="font-medium text-others-gray1" :class="errors.startDate ? 'text-text-error' : ''">
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

              <DatePicker :modelValue="startDate" :min="new Date()" @update:modelValue="startDate = $event"
                @apply="handleSingleDateApply" />
            </div>
          </transition>
        </div>

        <!-- Passengers -->
        <div class="relative py-6" ref="passTriggerRef">
          <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">人數</label>
          <div class="cursor-pointer" @click="togglePassengers">
            <div class="font-medium text-others-gray1">{{ passengerDisplayText }}</div>
          </div>

          <transition name="fade-scale">
            <div v-if="isPassengersOpen" ref="passPopoverRef"
              class="absolute -left-28 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[328px] max-w-[85vw]"
              @click.stop>
              <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                <h3 class="text-base font-semibold">人數</h3>
              </div>

              <div class="p-6">
                <!-- Adults -->
                <div class="flex items-center justify-between mb-6">
                  <div class="font-medium text-others-gray1 text-lg">成人 (12+)</div>
                  <div class="flex items-center gap-3">
                    <button @click="decrementAdults"
                      class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                      :disabled="adultCount <= 1" type="button">
                      <span class="text-3xl font-normal">−</span>
                    </button>
                    <span class="text-xl font-medium text-others-gray1 min-w-[2rem] text-center">{{
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
                  <div class="font-medium text-others-gray1 text-lg">孩童 (2-11)</div>
                  <div class="flex items-center gap-3">
                    <button @click="decrementChild"
                      class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                      :disabled="childrenCount <= 0" type="button">
                      <span class="text-3xl font-normal">−</span>
                    </button>
                    <span class="text-xl font-medium text-others-gray1 min-w-[2rem] text-center">{{
                      childrenCount }}</span>
                    <button @click="incrementChild"
                      class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50"
                      :disabled="childrenCount >= 8" type="button">
                      <span class="text-3xl font-normal">+</span>
                    </button>
                  </div>
                </div>

                <div class="text-sm text-primary-gold mt-4 text-center">
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
            <span>{{ selectedAirline }}</span>
            <svg class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isAirlineOpen }"
              fill="currentColor" viewBox="0 0 12 12">
              <path d="M6 9L2 4h8l-4 5z" />
            </svg>
          </button>

          <!-- Airline Popover -->
          <transition name="fade-scale">
            <div v-if="isAirlineOpen" ref="airlinePopoverRef"
              class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[550px] max-w-[85vw]"
              @click.stop>
              <!-- Header -->
              <div class="bg-primary-gold text-white px-6 py-4 rounded-t-2xl">
                <h3 class="text-base font-semibold pl-5">航空公司搜尋</h3>
              </div>

              <!-- Body -->
              <div class="p-6">
                <!-- Search Input -->
                <div class="mb-6">
                  <input v-model="airlineSearchTerm" type="text" placeholder="輸入航空公司名稱 / 代碼"
                    class="w-full px-4 py-3 border-2 border-primary-gold rounded-xl text-others-gray1 placeholder-others-gray1 focus:outline-none focus:ring-2 focus:ring-others-original focus:border-transparent" />
                </div>

                <!-- Search Results -->
                <div v-if="airlineSearchTerm.trim() && filteredAirlines.length > 0"
                  class="space-y-2 max-h-60 overflow-y-auto">
                  <button v-for="airline in filteredAirlines" :key="airline.code"
                    class="w-full text-left px-4 py-3 rounded-lg hover:bg-white transition-colors"
                    @click="selectAirline(airline.name)">
                    <div class="flex items-center">
                      <span class="font-semibold text-others-gray1 mr-2">{{ airline.code }}</span>
                      <span class="text-others-gray1">{{ airline.name }}</span>
                    </div>
                  </button>
                </div>

                <!-- Popular Airlines (when no search) -->
                <div v-else-if="!airlineSearchTerm.trim()">
                  <h4 class="text-lg text-primary-gold font-bold mb-4 pl-4">熱門航空公司</h4>
                  <div class="grid grid-cols-3 gap-4">
                    <button v-for="airline in popularAirlines" :key="airline"
                      class="text-left px-4 py-2 rounded-lg hover:text-others-original transition-colors text-others-gray1 font-medium"
                      @click="selectAirline(airline)">
                      {{ airline }}
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
            <svg class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isCabinClassOpen }"
              fill="currentColor" viewBox="0 0 12 12">
              <path d="M6 9L2 4h8l-4 5z" />
            </svg>
          </button>

          <!-- Cabin Class Popover -->
          <transition name="fade-scale">
            <div v-if="isCabinClassOpen" ref="cabinClassPopoverRef"
              class="absolute -left-45 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[200px] max-w-[85vw]"
              @click.stop>
              <!-- Header -->
              <div class="bg-primary-gold text-white px-6 py-4 rounded-t-2xl">
                <h3 class="text-base font-semibold pl-5">艙等設定</h3>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <div class="space-y-3">
                  <button v-for="cabinClass in cabinClassOptions" :key="cabinClass"
                    class="w-full text-left px-4 py-2 rounded-lg transition-colors text-lg font-medium" :class="selectedCabinClass === cabinClass
                      ? 'text-others-original bg-white'
                      : 'text-others-gray1 hover:bg-othres-gray6'" @click="selectCabinClass(cabinClass)">
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
import DatePicker from '@/components/ui/DatePicker.vue'

/** ------------------ STATE ------------------ **/
const isDepartureOpen = ref(false)
const isDestinationOpen = ref(false)
const isDatePickerOpen = ref(false)
const isPassengersOpen = ref(false)
const isAirlineOpen = ref(false)
const isCabinClassOpen = ref(false)

const depTriggerRef = ref(null)
const depPopoverRef = ref(null)
const destTriggerRef = ref(null)
const destPopoverRef = ref(null)
const dateTriggerRef = ref(null)
const datePopoverRef = ref(null)
const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

const selectedDepartureRegion = ref('日韓')
const selectedDestinationRegion = ref('日韓')
const selectedDepartureCity = ref('')
const selectedDestinationCity = ref('')

const startDate = ref(null)

const adultCount = ref(1)
const childrenCount = ref(0)

const selectedAirline = ref('航空公司偏好')
const selectedCabinClass = ref('艙等')
const isNonStopFlight = ref(false)

const airlineSearchTerm = ref('')


function handleSingleDateApply(d) {
  startDate.value = d
  // close your popover here (you already do this)
}
/** ------------------ DATA ------------------ **/
const regions = ['台灣', '日韓', '東南亞', '港澳大陸', '美洲', '歐洲', '紐澳', '其他']
const citiesByRegion = {
  '台灣': ['台北', '台中', '台南', '高雄', '桃園', '新竹'],
  '日韓': ['東京', '大阪', '沖繩', '首爾', '釜山', '福岡', '名古屋', '札幌', '神戶', '熊本', '仙台', '高松', '函館', '濟州島', '大邱'],
  '東南亞': ['曼谷', '新加坡', '吉隆坡', '雅加達', '馬尼拉', '胡志明市'],
  '港澳大陸': ['香港', '澳門', '上海', '北京', '廣州', '深圳'],
  '美洲': ['洛杉磯', '紐約', '舊金山', '多倫多', '溫哥華', '芝加哥'],
  '歐洲': ['倫敦', '巴黎', '羅馬', '阿姆斯特丹', '法蘭克福', '馬德里'],
  '紐澳': ['雪梨', '墨爾本', '奧克蘭', '布里斯本', '伯斯', '阿德萊德'],
  '其他': ['杜拜', '伊斯坦堡', '新德里', '孟買', '開羅', '約翰尼斯堡'],
}

const currentDepartureCities = computed(() => citiesByRegion[selectedDepartureRegion.value] || [])
const currentDestinationCities = computed(() => citiesByRegion[selectedDestinationRegion.value] || [])

/** ------------------ AIRLINE ------------------ **/
const allAirlines = ref([
  { code: 'JX', name: '星宇航空' },
  { code: 'BR', name: '長榮航空' },
  { code: 'CI', name: '中華航空' },
  { code: 'B7', name: '立榮航空' },
  { code: 'AE', name: '華信航空' },
  { code: 'JL', name: '日本航空' },
  { code: 'SQ', name: '新加坡航空' },
  { code: 'CX', name: '國泰航空' },
  { code: 'BF', name: 'FRENCH BEE' },
  { code: 'HM', name: '暹席爾航空' },
  { code: 'KL', name: '荷蘭皇家航空' },
  { code: 'LH', name: '德國漢莎航空' },
  { code: 'MM', name: '樂桃航空' },
  { code: 'MU', name: '中國東方航空' },
  { code: 'OK', name: '捷克航空' },
  { code: 'NH', name: 'ANA全日空' },
  { code: 'OZ', name: '韓亞航空' },
  { code: 'KE', name: '大韓航空' },
  { code: 'TG', name: '泰國國際航空' },
  { code: 'AF', name: '法國航空' }
])
const popularAirlines = ['日本航空', '新加坡航空', '國泰航空', '長榮航空', '中華航空', '星宇航空']

const filteredAirlines = computed(() => {
  if (!airlineSearchTerm.value.trim()) return []
  const s = airlineSearchTerm.value.toLowerCase()
  return allAirlines.value.filter(a => a.code.toLowerCase().includes(s) || a.name.toLowerCase().includes(s))
})

/** ------------------ COMPUTED ------------------ **/
const passengerDisplayText = computed(() => `${adultCount.value}成人 / ${childrenCount.value}孩童`)
const outboundDateText = computed(() => (startDate.value ? formatDate(startDate.value) : ''))

/** ------------------ METHODS ------------------ **/
function formatDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${y} / ${m} / ${d} (${weekdays[date.getDay()]})`
}

function selectDepartureCity(city) {
  selectedDepartureCity.value = city
  isDepartureOpen.value = false
}
function selectDestinationCity(city) {
  selectedDestinationCity.value = city
  isDestinationOpen.value = false
}

function swapCities() {
  ;[selectedDepartureCity.value, selectedDestinationCity.value] = [selectedDestinationCity.value, selectedDepartureCity.value]
}

function incrementAdults() { if (adultCount.value < 9) adultCount.value++ }
function decrementAdults() { if (adultCount.value > 1) adultCount.value-- }
function incrementChild() { if (childrenCount.value < 8) childrenCount.value++ }
function decrementChild() { if (childrenCount.value > 0) childrenCount.value-- }

function toggleDeparture() { isDepartureOpen.value = !isDepartureOpen.value }
function toggleDestination() { isDestinationOpen.value = !isDestinationOpen.value }
function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function toggleDatePicker() { isDatePickerOpen.value = !isDatePickerOpen.value }
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}
function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }

function selectAirline(name) {
  selectedAirline.value = name
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']
function selectCabinClass(v) {
  selectedCabinClass.value = v
  isCabinClassOpen.value = false
}

const errors = ref({
    destination: false,
    startDate: false,
})

// 👀 Watch destination
watch(selectedDestinationCity, (newVal) => {
  errors.value.destination = !newVal
})

// 👀 Watch start date
watch(startDate, (newVal) => {
  errors.value.startDate = !newVal
})


/** ------------------ SEARCH PAYLOAD ------------------ **/
const emit = defineEmits(['search'])

// Map cabin class label → booking code
const cabinClassMap = {
  '艙等不限': 'ALL',
  '經濟艙': 'M',
  '豪華經濟艙': 'W',
  '商務艙': 'C',
  '頭等艙': 'F'
}

function onSearch() {// Reset errors
    errors.value = {
        destination: !selectedDestinationCity.value,
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
        departureLocation: selectedDepartureCity.value || 'TPE',
        arrivalLocation: selectedDestinationCity.value || '',
        departureDate: startDate.value ? startDate.value.toISOString().slice(0, 10) : null,
        returnDate: null
      }
    ],
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: selectedAirline.value,
    cabinId: cabinClassMap[selectedCabinClass.value] || 'ALL',
    isNonStopFlight: isNonStopFlight.value,
    selectedRefNumbers: []
  }
  console.log(payload)

  emit('search', payload)
}

/** ------------------ CLOSE ON OUTSIDE / ESC ------------------ **/
function onDocClick(e) {
  const t = e.target
  const closeIfOutside = (openRef, popRef, trigRef, setter) => {
    if (!openRef.value) return
    if (popRef.value && !popRef.value.contains(t) && trigRef.value && !trigRef.value.contains(t)) setter(false)
  }

  closeIfOutside(isDepartureOpen, depPopoverRef, depTriggerRef, v => (isDepartureOpen.value = v))
  closeIfOutside(isDestinationOpen, destPopoverRef, destTriggerRef, v => (isDestinationOpen.value = v))
  closeIfOutside(isDatePickerOpen, datePopoverRef, dateTriggerRef, v => (isDatePickerOpen.value = v))
  closeIfOutside(isPassengersOpen, passPopoverRef, passTriggerRef, v => (isPassengersOpen.value = v))
  closeIfOutside(isAirlineOpen, airlinePopoverRef, airlineTriggerRef, v => (isAirlineOpen.value = v))
  closeIfOutside(isCabinClassOpen, cabinClassPopoverRef, cabinClassTriggerRef, v => (isCabinClassOpen.value = v))
}

function onKey(e) {
  if (e.key === 'Escape') {
    isDepartureOpen.value = false
    isDestinationOpen.value = false
    isDatePickerOpen.value = false
    isPassengersOpen.value = false
    isAirlineOpen.value = false
    isCabinClassOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
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