<template>
  <!-- Main Flight Search Box-->
  <div class="relative top-0 z-10 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 px-14 w-full mx-auto max-w-6xl">
      <div class="flex justify-between w-full">
        <!-- Title -->
        <h1 class="text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

        <!-- Tab Navigation -->
        <div class="flex space-x-2 px-4 py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
          <button @click="activeTab = 'roundtrip'" :class="[
            'px-6 min-w-[148px] min-h-[38px] py-2 rounded-lg font-medium transition',
            activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">來回</button>
          <button @click="activeTab = 'oneway'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">單程</button>
          <button @click="activeTab = 'multi'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">多行程</button>
        </div>
      </div>

      <!-- Search Form -->
      <div class="border-2 border-primary-gold rounded-xl rounded-tr-none px-5">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div class="grid grid-cols-10 items-center col-span-2 gap-4 border-r-2 border-primary-gold">
            <!-- Departure -->
            <div class="relative col-span-3" ref="depTriggerRef">
              <label class="text-h5 text-primary-gold font-bold mb-2 block hover: text-h5-d">出發地</label>
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
                  <!-- Header -->
                  <div class="bg-[#B3A093] text-white px-6 py-4 rounded-t-2xl">
                    <h3 class="text-base font-semibold pl-5">出發地</h3>
                  </div>

                  <!-- Body -->
                  <div class="px-6 py-4">
                    <!-- Regions -->
                    <div class="grid grid-cols-8 gap-1 mb-8">
                      <button v-for="region in departureRegions" :key="region"
                        class="rounded-xl cursor-pointer py-2 px-0 text-[18px] leading-none transition-colors" :class="[
                          selectedDepartureRegion === region
                            ? 'border-2 border-[#F39800] text-[#F39800]'
                            : 'text-[#787878] hover:text-[#F39800]'
                        ]" @click="selectedDepartureRegion = region">
                        {{ region }}
                      </button>
                    </div>

                    <!-- Cities -->
                    <div class="grid grid-cols-8 gap-0 gap-y-5 pb-4">
                      <button v-for="city in currentDepartureCities" :key="city"
                        class="text-[17px] cursor-pointer font-medium text-[#787878] hover:text-[#F39800] transition-colors"
                        @click="selectDepartureCity(city)">
                        {{ city }}
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Swap Arrow (kept visual only) -->
            <div class="col-span-1">
              <img src="@/assets/imgs/arrow-both.svg" alt="Swap Arrow" />
            </div>

            <!-- Destination -->
            <div class="relative col-span-6" ref="destTriggerRef">
              <label class="text-h5 text-primary-gold font-bold mb-2 block hover: text-h5-d">目的地</label>
              <div class="cursor-pointer pr-4" @click="toggleDestination">
                <div class="font-medium text-others-gray1 mb-1">
                  {{ selectedDestinationCity || '輸入國家/城市/機場關鍵字' }}
                </div>
              </div>

              <!-- Destination Popover -->
              <transition name="fade-scale">
                <div v-if="isDestinationOpen" ref="destPopoverRef"
                  class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[680px] max-w-[85vw]"
                  @click.stop>
                  <!-- Header -->
                  <div class="bg-primary-gold text-white px-6 py-4 rounded-t-2xl">
                    <h3 class="text-base font-semibold pl-5">目的地</h3>
                  </div>

                  <!-- Body -->
                  <div class="px-6 py-4">
                    <!-- Regions -->
                    <div class="grid grid-cols-8 gap-1 mb-8">
                      <button v-for="region in destinationRegions" :key="region"
                        class="rounded-xl cursor-pointer py-2 px-0 text-[18px] leading-none transition-colors" :class="[
                          selectedDestinationRegion === region
                            ? 'border-2 border-others-original text-others-original'
                            : 'text-others-gray1 hover:text-primary-gold'
                        ]" @click="selectedDestinationRegion = region">
                        {{ region }}
                      </button>
                    </div>

                    <!-- Cities -->
                    <div class="grid grid-cols-8 gap-0 gap-y-5 pb-4">
                      <button v-for="city in currentDestinationCities" :key="city"
                        class="text-[17px] cursor-pointer font-medium text-others-gray1 hover:text-others-original transition-colors"
                        @click="selectDestinationCity(city)">
                        {{ city }}
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div
            class="relative items-center col-span-2 justify-between gap-4 border-r-2 border-[#B3A093] grid grid-cols-5"
            ref="dateTriggerRef">
            <!-- Outbound Date -->
            <div class="relative col-span-2 cursor-pointer" @click="toggleDatePicker">
              <label class="text-h5 text-primary-gold font-bold mb-2 block hover: text-h5-d">去程</label>
              <div class="font-medium text-others-gray1">{{ outboundDateText }}</div>
            </div>

            <div class="relative col-span-1 mx-auto">
              <img src="@/assets/imgs/arrow-right.svg" alt="Swap Arrow" />
            </div>

            <!-- Return Date -->
            <div class="relative col-span-2 cursor-pointer" @click="toggleDatePicker">
              <label class="text-h5 text-primary-gold font-bold mb-2 block hover: text-h5-d">回程</label>
              <div class="font-medium text-others-gray1">{{ returnDateText }}</div>
            </div>

            <!-- Date Picker Popover -->
            <transition name="fade-scale">
              <div v-if="isDatePickerOpen" ref="datePopoverRef" class="absolute left-[-24rem] top-3/4 mt-2 z-50"
                @click.stop>
                <RangeDatePicker :start="startDate" :end="endDate" :min="new Date()" @update:start="startDate = $event"
                  @update:end="endDate = $event" @apply="handleDateApply" />
              </div>
            </transition>
          </div>

          <!-- Passengers -->
          <div class="relative py-6" ref="passTriggerRef">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover: text-h5-d">人數</label>
            <div class="cursor-pointer" @click="togglePassengers">
              <div class="font-medium text-others-gray1">{{ passengerDisplayText }}</div>
            </div>

            <!-- Passengers Popover -->
            <transition name="fade-scale">
              <div v-if="isPassengersOpen" ref="passPopoverRef"
                class="absolute -left-28 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[328px] max-w-[85vw]"
                @click.stop>
                <!-- Header -->
                <div class="bg-primary-gold text-white px-6 py-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold">人數</h3>
                </div>

                <!-- Body -->
                <div class="px-6 py-4">
                  <!-- Adults -->
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <div class="font-medium text-others-gray1 text-lg">成人 (12+)</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button @click="decrementAdults"
                        class="w-10 h-10 rounded-xl bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray4 transition-colors"
                        :disabled="adultCount <= 1">
                        <span class="text-3xl font-normal">−</span>
                      </button>
                      <span class="text-xl font-medium text-others-gray1 min-w-[2rem] text-center">{{ adultCount
                      }}</span>
                      <button @click="incrementAdults"
                        class="w-10 h-10 rounded-xl bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray4 transition-colors"
                        :disabled="adultCount >= 9">
                        <span class="text-3xl font-normal">+</span>
                      </button>
                    </div>
                  </div>

                  <!-- Children -->
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <div class="font-medium text-others-gray1 text-lg">孩童 (2-11)</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button @click="decrementChild"
                        class="w-10 h-10 rounded-xl bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray4 transition-colors"
                        :disabled="childCount <= 0">
                        <span class="text-3xl font-normal">−</span>
                      </button>
                      <span class="text-xl font-medium text-others-gray1 min-w-[2rem] text-center">{{ childCount
                      }}</span>
                      <button @click="incrementChild"
                        class="w-10 h-10 rounded-xl bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray4 transition-colors"
                        :disabled="childCount >= 8">
                        <span class="text-3xl font-normal">+</span>
                      </button>
                    </div>
                  </div>

                  <!-- Note -->
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
                        ? 'text-[#F39800] bg-[#FEF7E6]'
                        : 'text-[#787878] hover:bg-[#F5F4F2]'" @click="selectCabinClass(cabinClass)">
                      {{ cabinClass }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Direct Flight -->
          <div class="relative">
            <input id="directFlight" type="checkbox" v-model="IsNonStopFlight" class="sr-only" />
            <label for="directFlight"
              class="flex items-center justify-between min-w-[120px] bg-divider-soft text-primary-gold px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer">
              <span>直飛</span>
              <div class="w-4 h-4 rounded-full border-2 transition-colors duration-200 flex items-center justify-center"
                :class="IsNonStopFlight ? 'border-primary-gold bg-none' : 'border-none bg-others-original'">
              </div>
            </label>
          </div>
        </div>

        <button
          class="px-4 py-1 w-[150px] h-[50px] rounded-[15px] border-none bg-others-original text-white hover:bg-others-hover transition">
          搜尋
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CustomDropdown from '@/components/ui/CustomDropdown.vue'
import RangeDatePicker from '@/components/ui/RangeDatePicker.vue'

const activeTab = ref('roundtrip')

/* ----------------- Departure popover state ----------------- */
const isDepartureOpen = ref(false)
const depTriggerRef = ref(null)
const depPopoverRef = ref(null)

/* ----------------- Destination popover state (NEW) ----------------- */
const isDestinationOpen = ref(false)
const destTriggerRef = ref(null)
const destPopoverRef = ref(null)

/* ----------------- Passengers popover state ----------------- */
const isPassengersOpen = ref(false)
const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const adultCount = ref(1)
const childCount = ref(0)

/* ----------------- Date picker popover state ----------------- */
const isDatePickerOpen = ref(false)
const dateTriggerRef = ref(null)
const datePopoverRef = ref(null)
const startDate = ref(new Date(2025, 9, 12)) // October 12, 2025
const endDate = ref(new Date(2025, 9, 24)) // October 24, 2025

/* ----------------- Airline search popover state ----------------- */
const isAirlineOpen = ref(false)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const airlineSearchTerm = ref('')

/* ----------------- Cabin class popover state ----------------- */
const isCabinClassOpen = ref(false)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

/* ----------------- Toggles ----------------- */
function toggleDeparture() {
  isDepartureOpen.value = !isDepartureOpen.value
}
function toggleDestination() {
  isDestinationOpen.value = !isDestinationOpen.value
}
function togglePassengers() {
  isPassengersOpen.value = !isPassengersOpen.value
}
function toggleDatePicker() {
  isDatePickerOpen.value = !isDatePickerOpen.value
}
function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}
function toggleCabinClass() {
  isCabinClassOpen.value = !isCabinClassOpen.value
}

/* click outside + ESC to close */
function onDocClick(e) {
  const t = e.target

  // Departure
  if (isDepartureOpen.value) {
    if (
      depPopoverRef.value &&
      !depPopoverRef.value.contains(t) &&
      depTriggerRef.value &&
      !depTriggerRef.value.contains(t)
    ) {
      isDepartureOpen.value = false
    }
  }

  // Destination (NEW)
  if (isDestinationOpen.value) {
    if (
      destPopoverRef.value &&
      !destPopoverRef.value.contains(t) &&
      destTriggerRef.value &&
      !destTriggerRef.value.contains(t)
    ) {
      isDestinationOpen.value = false
    }
  }

  // Passengers
  if (isPassengersOpen.value) {
    if (
      passPopoverRef.value &&
      !passPopoverRef.value.contains(t) &&
      passTriggerRef.value &&
      !passTriggerRef.value.contains(t)
    ) {
      isPassengersOpen.value = false
    }
  }

  // Date picker
  if (isDatePickerOpen.value) {
    if (
      datePopoverRef.value &&
      !datePopoverRef.value.contains(t) &&
      dateTriggerRef.value &&
      !dateTriggerRef.value.contains(t)
    ) {
      isDatePickerOpen.value = false
    }
  }

  // Airline
  if (isAirlineOpen.value) {
    if (
      airlinePopoverRef.value &&
      !airlinePopoverRef.value.contains(t) &&
      airlineTriggerRef.value &&
      !airlineTriggerRef.value.contains(t)
    ) {
      isAirlineOpen.value = false
    }
  }

  // Cabin class
  if (isCabinClassOpen.value) {
    if (
      cabinClassPopoverRef.value &&
      !cabinClassPopoverRef.value.contains(t) &&
      cabinClassTriggerRef.value &&
      !cabinClassTriggerRef.value.contains(t)
    ) {
      isCabinClassOpen.value = false
    }
  }
}
function onKey(e) {
  if (e.key === 'Escape') {
    isDepartureOpen.value = false
    isDestinationOpen.value = false
    isPassengersOpen.value = false
    isDatePickerOpen.value = false
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

/* ----------------- Departure data ----------------- */
const selectedDepartureRegion = ref('日韓')
const selectedDepartureCity = ref('')

const departureRegions = ['台灣', '日韓', '東南亞', '港澳大陸', '美洲', '歐洲', '紐澳', '其他']

const departureCitiesByRegion = {
  '台灣': ['台北', '台中', '台南', '高雄', '桃園', '新竹'],
  '日韓': ['東京', '大阪', '沖繩', '首爾', '釜山', '福岡', '名古屋', '札幌', '神戶', '熊本', '仙台', '高松', '函館', '濟州島', '大邱'],
  '東南亞': ['曼谷', '新加坡', '吉隆坡', '雅加達', '馬尼拉', '胡志明市'],
  '港澳大陸': ['香港', '澳門', '上海', '北京', '廣州', '深圳'],
  '美洲': ['洛杉磯', '紐約', '舊金山', '多倫多', '溫哥華', '芝加哥'],
  '歐洲': ['倫敦', '巴黎', '羅馬', '阿姆斯特丹', '法蘭克福', '馬德里'],
  '紐澳': ['雪梨', '墨爾本', '奧克蘭', '布里斯本', '伯斯', '阿德萊德'],
  '其他': ['杜拜', '伊斯坦堡', '新德里', '孟買', '開羅', '約翰尼斯堡']
}

const currentDepartureCities = computed(() => departureCitiesByRegion[selectedDepartureRegion.value] || [])

function selectDepartureCity(city) {
  selectedDepartureCity.value = city
  isDepartureOpen.value = false
}

/* ----------------- Destination data (NEW) ----------------- */
const selectedDestinationRegion = ref('日韓')
const selectedDestinationCity = ref('')

const destinationRegions = ['台灣', '日韓', '東南亞', '港澳大陸', '美洲', '歐洲', '紐澳', '其他']

const destinationCitiesByRegion = {
  '台灣': ['台北', '台中', '台南', '高雄', '桃園', '新竹'],
  '日韓': ['東京', '大阪', '沖繩', '首爾', '釜山', '福岡', '名古屋', '札幌', '神戶', '熊本', '仙台', '高松', '函館', '濟州島', '大邱'],
  '東南亞': ['曼谷', '新加坡', '吉隆坡', '雅加達', '馬尼拉', '胡志明市'],
  '港澳大陸': ['香港', '澳門', '上海', '北京', '廣州', '深圳'],
  '美洲': ['洛杉磯', '紐約', '舊金山', '多倫多', '溫哥華', '芝加哥'],
  '歐洲': ['倫敦', '巴黎', '羅馬', '阿姆斯特丹', '法蘭克福', '馬德里'],
  '紐澳': ['雪梨', '墨爾本', '奧克蘭', '布里斯本', '伯斯', '阿德萊德'],
  '其他': ['杜拜', '伊斯坦堡', '新德里', '孟買', '開羅', '約翰尼斯堡']
}

const currentDestinationCities = computed(() => destinationCitiesByRegion[selectedDestinationRegion.value] || [])

function selectDestinationCity(city) {
  selectedDestinationCity.value = city
  isDestinationOpen.value = false
}

/* ----------------- Passengers functions ----------------- */
const passengerDisplayText = computed(() => `${adultCount.value}成人 / ${childCount.value}孩童`)

function incrementAdults() {
  if (adultCount.value < 9) adultCount.value++
}
function decrementAdults() {
  if (adultCount.value > 1) adultCount.value--
}
function incrementChild() {
  if (childCount.value < 8) childCount.value++
}
function decrementChild() {
  if (childCount.value > 0) childCount.value--
}

/* ----------------- Date picker functions ----------------- */
function formatDate(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]
  return `${year} / ${month} / ${day} (${weekday})`
}

const outboundDateText = computed(() => formatDate(startDate.value))
const returnDateText = computed(() => formatDate(endDate.value))

function handleDateApply(range) {
  if (range.start) startDate.value = range.start
  if (range.end) endDate.value = range.end
  isDatePickerOpen.value = false
}

/* ----------------- Airline data ----------------- */
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
const selectedAirline = ref('星宇航空')

const filteredAirlines = computed(() => {
  if (!airlineSearchTerm.value.trim()) return []
  const searchTerm = airlineSearchTerm.value.toLowerCase()
  return allAirlines.value.filter(a =>
    a.code.toLowerCase().includes(searchTerm) ||
    a.name.toLowerCase().includes(searchTerm)
  )
})

function selectAirline(airlineName) {
  selectedAirline.value = airlineName
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}

/* ----------------- Cabin class data ----------------- */
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']
const selectedCabinClass = ref('艙等不限')

function selectCabinClass(cabinClass) {
  selectedCabinClass.value = cabinClass
  isCabinClassOpen.value = false
}

/* ----------------- Other controls ----------------- */
const IsNonStopFlight = ref(false)
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
