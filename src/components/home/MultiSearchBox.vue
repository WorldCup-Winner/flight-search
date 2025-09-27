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
            <div class="cursor-pointer" :class="errors[idx].source ? 'text-text-error' : ''" @click="toggleDeparture(idx)">
              <div v-if="idx === 0" class="text-others-gray1 mb-1">
                {{ seg.fromCity || 'TPE 台北(任何)' }}
              </div>
              <div v-else class="text-others-gray1 mb-1" :class="errors[idx].source ? 'text-text-error' : ''">
                {{ seg.fromCity || '輸入國家/城市/機場關鍵字' }}
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
                    <button v-for="region in regions" :key="`dep-${idx}-${region}`"
                      class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors" :class="[
                        seg.departureLocation === region
                          ? 'border-2 border-others-original text-others-original'
                          : 'text-others-gray1 hover:text-primary-gold'
                      ]" @click="seg.departureLocation = region">
                      {{ region }}
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                    <button v-for="city in citiesByRegion[seg.departureLocation] || []" :key="`dep-city-${idx}-${city}`"
                      class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                      @click="selectDepartureCity(idx, city)">
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Swap -->
          <button class="flex py-6 w-[20%] items-center justify-center hover:opacity-80 transition"
            aria-label="swap cities" type="button">
            <img src="@/assets/imgs/arrow-right.svg" alt="Swap Arrow" />
          </button>

          <!-- Destination -->
          <div class="relative py-6 w-[45%]" :ref="setDestTriggerRef(idx)">
            <label class="text-h5 text-primary-gold font-bold mb-2 block hover:text-h5-d">目的地</label>
            <div class="cursor-pointer pr-4" :class="errors[idx].destination ? 'text-text-error' : ''" @click="toggleDestination(idx)">
              <div class="text-others-gray1" :class="errors[idx].destination ? 'text-text-error' : ''">
                {{ seg.toCity || '輸入國家/城市/機場關鍵字' }}
              </div>
            </div>

            <!-- Destination Popover -->
            <transition name="fade-scale">
              <div v-if="openDestIndex === idx" :ref="setDestPopoverRef(idx)"
                class="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl w-[750px] max-w-[85vw]"
                @click.stop>
                <div class="bg-primary-gold text-white p-4 rounded-t-2xl">
                  <h3 class="text-base font-semibold pl-4">目的地</h3>
                </div>

                <div class="p-4">
                  <div class="flex flex-row gap-1 mb-8">
                    <button v-for="region in regions" :key="`dest-${idx}-${region}`"
                      class="rounded-xl font-medium py-2 px-3 text-[18px] leading-none transition-colors" :class="[
                        seg.arrivalLocation === region
                          ? 'border-2 border-others-original text-others-original'
                          : 'text-others-gray1 hover:text-others-original'
                      ]" @click="seg.arrivalLocation = region">
                      {{ region }}
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-0 gap-y-5 pb-4">
                    <button v-for="city in citiesByRegion[seg.arrivalLocation] || []" :key="`dest-city-${idx}-${city}`"
                      class="text-[17px] text-others-gray1 hover:text-others-original transition-colors"
                      @click="selectDestinationCity(idx, city)">
                      {{ city }}
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
                <DatePicker :modelValue="seg.departureDate" :min="new Date()"
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
                    <span>{{ selectedAirline }}</span>
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
                                    @click="selectAirline(airline.name)">
                                    <div class="flex items-center">
                                        <span class=" text-others-gray1 mr-2">{{ airline.code }}</span>
                                        <span class="text-others-gray1">{{ airline.name }}</span>
                                    </div>
                                </button>
                            </div>

                            <!-- Popular Airlines (when no search) -->
                            <div v-else-if="!airlineSearchTerm.trim()">
                                <h4 class="text-primary-gold font-semibold mb-4 pl-4">熱門航空公司</h4>
                                <div class="grid grid-cols-3 gap-2">
                                    <button v-for="airline in popularAirlines" :key="airline"
                                        class="text-left px-4 py-2 rounded-lg hover:text-others-original transition-colors text-others-gray1"
                                        :class="selectedAirline === airline
                                            ? 'text-others-original'
                                            : 'text-others-gray1'"
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
import DatePicker from '@/components/ui/DatePicker.vue'

/* -------------------- segment model -------------------- */
let nextId = 1
const makeSeg = () => ({
  id: nextId++,
  departureLocation: '日韓',
  arrivalLocation: '日韓',
  fromCity: '',
  toCity: '',
  departureDate: null
})
const segments = ref([makeSeg(), makeSeg()])

const canAdd = computed(() => segments.value.length < 5)

function addSegment() {
  if (!canAdd.value) return
  segments.value.push(makeSeg())
  errors.value.push({
    source: false,
    destination: false,
    startDate: false,
    endDate: false
  })
}

function removeSegment(idx) {
  if (segments.value.length <= 2) return
  segments.value.splice(idx, 1)
  errors.value.splice(idx, 1)
}

/* -------------------- regions & cities -------------------- */
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

/* -------------------- popover management (per-index) -------------------- */
const openDepIndex = ref(-1)
const openDestIndex = ref(-1)
const openDateIndex = ref(-1)

function toggleDeparture(i) { openDepIndex.value = openDepIndex.value === i ? -1 : i }
function toggleDestination(i) { openDestIndex.value = openDestIndex.value === i ? -1 : i }
function toggleDate(i) { openDateIndex.value = openDateIndex.value === i ? -1 : i }

function selectDepartureCity(i, city) {
  segments.value[i].fromCity = city
  openDepIndex.value = -1
}
function selectDestinationCity(i, city) {
  segments.value[i].toCity = city
  openDestIndex.value = -1
}
function onDateApply(i, d) {
  segments.value[i].departureDate = d
  openDateIndex.value = -1
}
function swapCities(i) {
  const s = segments.value[i]
    ;[s.fromCity, s.toCity] = [s.toCity, s.fromCity]
    ;[s.departureLocation, s.arrivalLocation] = [s.arrivalLocation, s.departureLocation]
}

/* -------------------- click-outside handling -------------------- */
const depTriggerRefs = reactive({})
const depPopoverRefs = reactive({})
const destTriggerRefs = reactive({})
const destPopoverRefs = reactive({})
const dateTriggerRefs = reactive({})
const datePopoverRefs = reactive({})

const setDepTriggerRef = i => el => { if (el) depTriggerRefs[i] = el }
const setDepPopoverRef = i => el => { if (el) depPopoverRefs[i] = el }
const setDestTriggerRef = i => el => { if (el) destTriggerRefs[i] = el }
const setDestPopoverRef = i => el => { if (el) destPopoverRefs[i] = el }
const setDateTriggerRef = i => el => { if (el) dateTriggerRefs[i] = el }
const setDatePopoverRef = i => el => { if (el) datePopoverRefs[i] = el }

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
  closeIfOutside(openDestIndex, destPopoverRefs, destTriggerRefs)
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
    openDestIndex.value = -1
    openDateIndex.value = -1
    isPassengersOpen.value = false
    isAirlineOpen.value = false
    isCabinClassOpen.value = false
  }
}

/* -------------------- refs for bottom popovers -------------------- */
const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

/* -------------------- passengers -------------------- */
const isPassengersOpen = ref(false)
const adultCount = ref(1)
const childrenCount = ref(0)

const passengerDisplayText = computed(
  () => `${adultCount.value}成人 / ${childrenCount.value}孩童`
)

function togglePassengers() { isPassengersOpen.value = !isPassengersOpen.value }
function incrementAdults() { if (adultCount.value < 9) adultCount.value++ }
function decrementAdults() { if (adultCount.value > 1) adultCount.value-- }
function incrementChildren() { if (childrenCount.value < 8) childrenCount.value++ }
function decrementChildren() { if (childrenCount.value > 0) childrenCount.value-- }

/* -------------------- airline filter -------------------- */
const isAirlineOpen = ref(false)
const airlineSearchTerm = ref('')
const selectedAirline = ref('新加坡航空')

function toggleAirline() {
  isAirlineOpen.value = !isAirlineOpen.value
  if (isAirlineOpen.value) airlineSearchTerm.value = ''
}

/** ------------------ AIRLINE ------------------ **/
const allAirlines = ref([
    { code: 'JX', name: '星宇航空' },
    { code: 'BR', name: '長榮航空' },
    { code: 'CI', name: '中華航空' },
    { code: 'B7', name: '立榮航空' },
    { code: 'AE', name: '華信航空' },
    { code: 'JL', name: '日本航空' },
    { code: 'SQ', name: 'c' },
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
    { code: 'AF', name: '法國航空' },
    { code: 'AG', name: '榮航空' },
    { code: 'AC', name: '荷蘭皇家航空' },
    { code: 'AE', name: '法國航空' },
    { code: 'TE', name: '荷家航空' },
    { code: 'EA', name: '法國航空' },
    { code: 'QQ', name: '法國航空' },
    { code: 'AA', name: '荷蘭皇家航空' }
])

const popularAirlines = ['日本航空', '新加坡航空', '國泰航空', '長榮航空', '中華航空', '星宇航空']

const filteredAirlines = computed(() => {
  const q = airlineSearchTerm.value.trim().toLowerCase()
  if (!q) return []
  return allAirlines.value.filter(
    a => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
  )
})

function selectAirline(name) {
  selectedAirline.value = name
  isAirlineOpen.value = false
  airlineSearchTerm.value = ''
}

/* -------------------- cabin class -------------------- */
const isCabinClassOpen = ref(false)
const selectedCabinClass = ref('艙等')
const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']

function toggleCabinClass() { isCabinClassOpen.value = !isCabinClassOpen.value }
function selectCabinClass(v) {
  selectedCabinClass.value = v
  isCabinClassOpen.value = false
}

/* -------------------- direct toggle -------------------- */
const isNonStopFlight = ref(false)

/* -------------------- helpers -------------------- */
function formatDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const wd = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  return `${y} / ${m} / ${d} (${wd})`
}

const hasSearched = ref(false)

const errors = ref([
  {
    source: false,
    destination: false,
    startDate: false,
    endDate: false,
  },
  {
    source: false,
    destination: false,
    startDate: false,
    endDate: false,
  }
])

watch(segments, (newSegments) => {
  errors.value = newSegments.map(seg => ({
    source: hasSearched.value && !seg.fromCity,
    destination: hasSearched.value && !seg.toCity,
    startDate: hasSearched.value && !seg.departureDate
  }))
}, { deep: true })

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

// Find airline code from name
function getAirlineCode(nameOrCode) {
  const match = allAirlines.value.find(a => a.name === nameOrCode || a.code === nameOrCode)
  return match ? match.code : nameOrCode
}

function onSearch() {
  hasSearched.value = true 
  errors.value = segments.value.map((segment) => ({
    source: !segment.fromCity,
    destination: !segment.toCity,
    startDate: !segment.departureDate
  }))

  errors.value[0].source = false

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
      departureLocation: s.fromCity || 'TPE',
      arrivalLocation: s.toCity || '',
      departureDate: s.departureDate ? s.departureDate.toISOString().slice(0, 10) : null,
      returnDate: null
    })),
    adultCount: adultCount.value,
    childCount: childrenCount.value,
    carrierId: getAirlineCode(selectedAirline.value),   // always airline code
    cabinId: cabinClassMap[selectedCabinClass.value] || 'ALL',
    isNonStopFlight: isNonStopFlight.value,
    selectedRefNumbers: []
  }
  console.log(payload)
  emit('search', payload)
}

/* -------------------- lifecycle -------------------- */
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
