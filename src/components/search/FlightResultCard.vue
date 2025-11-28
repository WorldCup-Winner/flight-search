<template>
  <article
    class="relative z-[50] hover:z-[999] rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-visible"
  >
    <!-- HEADER (always visible) -->
    <div class="flex items-center gap-4 px-5 py-4">
      <!-- Airlines block -->
      <div
        class="relative group flex items-center gap-2 min-w-[150px]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <img
          v-if="airlines.length <= 1"
          :src="airlines[0].logo"
          :alt="airlines[0]?.name || 'airline'"
          class="w-10 h-10 object-contain"
          @error="onImageError"
        />
        <img
          v-else
          :src="AirlineTwo"
          :alt="airlines[0]?.name || 'airlines'"
          class="w-10 h-10 object-contain"
          @error="onImageError"
        />
        <div class="leading-tight">
          <div v-if="airlines.length <= 1" class="text-[16px] text-others-gray7 font-bold">
            {{ airlines[0]?.name }}
          </div>
          <div v-else class="text-[16px] text-others-gray7 font-bold">
            <div v-for="a in airlines" :key="a.code">{{ a.name }}</div>
          </div>
        </div>

        <!-- Tooltip via Teleport -->
        <Teleport to="body">
          <Transition name="fade-scale">
            <div
              v-if="showTooltip"
              :style="tooltipStyle"
              class="fixed w-[220px] rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.15)] p-3 z-[9999]"
              role="tooltip"
            >
              <ul class="divide-y divide-others-gray3">
                <li
                  v-for="a in airlines"
                  :key="a.code"
                  class="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <div class="flex items-center gap-2">
                    <img 
                      v-if="a.logo"
                      class="w-6 h-6 object-contain rounded-sm" 
                      :src="a.logo"
                      :alt="a.name"
                      @error="onImageError"
                    />
                    <span class="text-others-gray7">{{ a.name }}</span>
                  </div>
                  <span class="text-others-gray7 font-semibold">{{ a.code }}</span>
                </li>
              </ul>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- Times -->
      <div class="flex items-center gap-3 flex-1 justify-between min-w-0">
        <div class="text-center flex-shrink-0">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ departureTime }}</div>
          <div class="text-sm text-others-gray1">{{ departureAirportCode }} {{ departureTerminal }}</div>
        </div>

        <div class="relative flex flex-col items-center flex-shrink-0">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <img class="absolute w-10" src="@/assets/imgs/arrow-right.svg"  />
            <div v-if="stopsCount >= 1" class="absolute top-[17px] border-2 border-primary-gold bg-white rounded-full w-3 h-3"></div>
          </div>
          <p :class="[stopsCount >= 1 ? 'block' : 'hidden']" class="absolute w-max bottom-[-15px] text-others-original">
            轉機{{ stopsCount }}次
          </p>
        </div>

        <div class="text-center flex-shrink-0">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold relative inline-block">
            {{ arrivalTime }}
            <span v-if="crossDays && crossDays > 0" class="absolute -top-1 -right-4 text-[12px] text-others-original font-normal">+{{ crossDays }}</span>
          </div>
          <div class="text-sm text-others-gray1">{{ arrivalAirportCode }} {{ arrivalTerminal }}</div>
        </div>

        <div class="ml-2 text-right flex-shrink-0 min-w-[90px]">
          <div class="text-[14px] text-others-gray1 whitespace-nowrap">{{ totalDurationText }}</div>

          <!-- toggle -->
          <button
            class="text-[16px] font-bold text-primary-gold hover:opacity-80 inline-flex items-center gap-1 whitespace-nowrap"
            @click="expanded = !expanded"
            :aria-expanded="expanded"
            type="button"
          >
            航班資訊
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="!expanded ? 'M18 10l-6 6-6-6' : 'M6 14l6-6 6 6'" />
            </svg>
          </button>
        </div>

        <!-- Price & CTA -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="text-right min-w-[170px]" :class="{ 'invisible': leg === 'return' && expanded1 }">
            <div class="flex items-end justify-end font-bold whitespace-nowrap">
              <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
              <div class="text-[28px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
              <div class="text-[12px] text-others-gray1">&nbsp; 起</div>
            </div>
            <div v-if="taxMode == 'in'" class="text-[12px] pt-1 text-others-gray1 whitespace-nowrap text-right">每人均價(含稅及附加費)</div>
            <div v-else class="text-[12px] pt-1 text-others-gray1 whitespace-nowrap text-right">{{ '參考稅費'  }}&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}</div>
          </div>

          <button
            v-if="leg === 'outbound'"
            class="min-w-[98px] px-5 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-primary-gold1 flex-shrink-0"
            @click="goReturn"
            type="button"
          >
            <p class="whitespace-nowrap">選擇</p>
          </button>
          <button
            v-if="leg === 'return'"
            class="flex items-center gap-2 min-w-[98px] px-5 py-3 rounded-[15px] text-white font-bold flex-shrink-0"
            :class="expanded1 ? 'bg-others-gray3 hover:bg-others-gray5' : 'bg-primary-gold hover:bg-primary-gold3'"
            @click="handleExpanded1"
            type="button"
          >
            <p class="whitespace-nowrap">{{ expanded1 ? '收起' : '選擇' }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="!expanded1 ? 'M18 10l-6 6-6-6' : 'M6 14l6-6 6 6'" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- BODY (expanded) -->
    <Transition name="fade">
      <div v-if="expanded" class="bg-[#E5E5E5]" :class="[!expanded1 ? 'rounded-b-[10px]' : '']">
        <!-- Timeline for each sector -->
        <div v-for="(sec, i) in sectors" :key="i">
          <div class="grid grid-cols-12 gap-4 py-8 px-8">
            <!-- left dates/times -->
            <div class="flex items-center flex-col justify-between col-span-12 md:col-span-3">
              <div class="flex flex-row items-center justify-between gap-6">
                <div class="text-others-gray1">{{ formatDateToChinese(sec.departureDate) }}</div>
                <div class="font-bold text-others-gray7">{{ sec.departureTime }}</div>
              </div>
              <div class="text-others-gray1">{{ toDuration(sec.durationMinutes) }}</div>
              <div class="flex items-center justify-between gap-6">
                <div class="text-others-gray1">{{ formatDateToChinese(sec.arrivalDate) }}</div>
                <div class="font-bold text-others-gray7 relative">
                  {{ sec.arrivalTime }}
                  <span v-if="sec.crossDays && sec.crossDays > 0" class="absolute -top-1 -right-4 text-[10px] text-others-original font-normal">+{{ sec.crossDays }}</span>
                </div>
              </div>
            </div>

            <!-- vertical line w/ dots (hidden on mobile) -->
            <div class="hidden relative md:block mx-6">
              <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-white"></span>
              <div class="w-[3px] h-full bg-white"></div>
              <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-white"></span>
            </div>

            <!-- right info -->
            <div class="col-span-12 md:col-span-8 space-y-2">
              <div class="font-bold text-others-gray7">
                {{ sec.departureAirportCode }} {{ sec.departureAirportName }} {{ sec.departureTerminal }} {{ sec.departureCityName }}
              </div>
              <div class="flex items-center gap-2 text-others-gray1">
                <img
                  v-if="airlineLogoFor(sec)"
                  :src="airlineLogoFor(sec)"
                  :alt="sec.marketingAirlineName || sec.operatingAirlineName"
                  class="w-5 h-5 object-contain"
                  @error="onImageError"
                />
                <span class="font-semibold">{{ sec.flightNo || sec.operatingFlightNo }}</span>
                <span class="text-others-gray1">{{ sec.marketingAirlineName || sec.operatingAirlineName }}</span>
                <span class="text-others-gray1">{{ sec.craft?.craftName ? ' ' + sec.craft.craftName : '' }}</span>
              </div>
              <div class="font-bold text-others-gray7">
                {{ sec.arrivalAirportCode }} {{ sec.arrivalAirportName }} {{ sec.arrivalTerminal }} {{ sec.arrivalCityName }}
              </div>
            </div>
          </div>

          <!-- transfer chips (between legs) -->
          <div v-if="i < sectors.length - 1 && sec.transfer" class="mx-10 my-2 text-others-gray1">
            <div class="inline-flex items-center gap-2 bg-white rounded-[10px] px-6 py-2">
              <!-- 使用前一航段的到達城市作為轉機城市 -->
              <span>於{{ sec.arrivalCityName || sec.transfer.transferCity }}轉機</span>
              <span class="text-others-gray3">|</span>
              <span class="text-others-original">{{ toDuration(sec.transfer.transferStayMinutes) }}</span>
              <!-- 只有在真的不同航廈時才顯示 -->
              <template v-if="sec.transfer.isChangeTerminal">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">不同航廈</span>
              </template>
              <!-- 只有在真的不同機場（機場代碼不同）時才顯示 -->
              <template v-if="shouldShowDifferentAirport(i)">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">不同機場</span>
              </template>
              <!-- 行李直掛 -->
              <template v-if="sec.baggageStraight > 0">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">行李直掛</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- BODY (expanded1) -->
    <Transition name="fade">
      <div v-if="expanded1" class="bg-[#E5E5E5] rounded-b-[10px]">
        <!-- Loading state with skeleton -->
        <div v-if="fareRuleLoading" class="bg-white rounded-b-[10px] overflow-hidden">
          <!-- Skeleton fare options (show 2-3 placeholder rows) -->
          <div v-for="n in 2" :key="`skeleton-${n}`" class="relative grid grid-cols-12 gap-4 p-5 border-b border-others-gray3">
            <!-- Cabin skeleton -->
            <div class="col-span-12 md:col-span-2 flex items-center justify-center">
              <div class="skel h-6 w-20 rounded"></div>
            </div>
            
            <!-- Notes skeleton -->
            <div class="col-span-12 md:col-span-6 space-y-3">
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-48 rounded"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-56 rounded"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-40 rounded"></div>
              </div>
              <div class="skel h-4 w-32 rounded"></div>
            </div>
            
            <!-- Price and button skeleton -->
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right space-y-2">
                <div class="skel h-8 w-32 rounded"></div>
                <div class="skel h-3 w-24 rounded"></div>
              </div>
              <div class="skel h-12 w-24 rounded-[10px]"></div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="fareRuleError && !show404Dialog" class="p-8 text-center text-text-error">
          {{ fareRuleError }}
        </div>

        <!-- Fare options -->
        <div v-else-if="visibleFares.length > 0" class="bg-white rounded-b-[10px] overflow-hidden">
          <div v-for="(fare, idx) in visibleFares" :key="idx" class="relative grid grid-cols-12 gap-4 p-5 border-others-gray3">
            <div v-if="idx >= 1" class="absolute mx-[2%] w-[96%] h-[1px] bg-others-gray3"></div>
            <div class="col-span-12 md:col-span-2 text-others-gray1 font-bold flex items-center justify-center">
              {{ fare.cabin }}
            </div>
            <ul class="col-span-12 md:col-span-6 space-y-2">
              <li v-for="(n, i) in fare.notes" :key="i" class="flex items-center gap-2">
                <img :src="noteIcon(n.type as FareNoteType, n.icon as FareIconType)" />
                <span class="text-[14px] text-others-gray1">{{ n.text }}</span>
              </li>
              <li class="text-others-original text-[14px] font-bold cursor-pointer" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</li>
            </ul>
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right">
                <div class="flex items-end font-bold">
                  <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
                  <div class="text-[28px] text-others-original leading-none">
                    {{ formatPrice(taxMode === 'in' ? (price ?? 0) : (price ?? 0) - (taxAmount ?? 0)) }}
                  </div>
                </div>
                <div class="text-[12px] pt-2 text-others-gray1">
                  <template v-if="taxMode === 'in'">
                    每人均價(含稅及附加費)
                  </template>
                  <template v-else>
                    參考稅費&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}
                  </template>
                </div>
              </div>
              <button class="bg-others-original hover:bg-others-hover min-w-[98px] text-white font-bold rounded-[10px] px-6 py-3" @click="goBooking(fare)" type="button">
                訂購
              </button>
            </div>
          </div>

          <div v-if="(dynamicFareOptions.length > 0 ? dynamicFareOptions.length : (fareOptions?.length ?? 0)) > fareShow" class="p-4 flex justify-end">
            <button class="flex items-center w-fit text-others-original hover:opacity-80" @click="fareShow = (dynamicFareOptions.length > 0 ? dynamicFareOptions.length : (fareOptions?.length ?? 0))">
              <span>顯示更多</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 10l-6 6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- No data state -->
        <div v-else class="p-8 text-center text-others-gray1">
          暫無票價資訊
        </div>
      </div>
    </Transition>

    <!-- 404 Error Dialog -->
    <Transition name="fade">
      <div v-if="show404Dialog" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        @click.self="show404Dialog = false">
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div class="text-center">
            <h3 class="text-xl font-bold text-others-gray1 mb-4">無法取得票價規則</h3>
            <p class="text-others-gray7 mb-6">
              抱歉，目前無法取得此航班的票價規則資訊，請重新搜尋。
            </p>
            <button
              @click="handle404Confirm"
              class="px-6 py-2 bg-primary-gold text-white rounded-lg font-medium hover:bg-others-hover transition">
              確定
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { formatDateToChinese, formatPrice, noteIcon, toDuration } from '@/utils'
import { fareRule } from '@/api'
import type { FareRuleResponse, FareRuleRequest, SegmentPick, PaxMix } from '@/utils/types'

// Icons
import AirlineTwo from '@/assets/imgs/airlines/airline-two.svg'
import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'
import type { FareIconType, FareNoteType, FareOption, Sector } from '@/utils/types'

const props = defineProps<{
  tripType: string
  leg: 'outbound' | 'return'
  // New-shape (v-bind="it")
  refNumber?: number
  price?: number
  taxAmount?: number
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  crossDays?: number
  durationMinutes?: number
  departureCityCode?: string
  arrivalCityCode?: string
  departureCityName?: string
  arrivalCityName?: string
  departureAirportCode?: string
  departureAirportName?: string
  arrivalAirportCode?: string
  arrivalAirportName?: string
  departureTerminal?: string
  arrivalTerminal?: string
  airlineName?: string[]
  airlineCode?: string[]
  sectors?: Sector[]

  // UI extras
  currency?: string
  priceFrom?: number
  taxMode?: string
  roundTripIncluded?: boolean
  fareOptions?: FareOption[]
  defaultOpen?: boolean
  defaultOpen1?: boolean

  /** Optional: map airline code -> logo url */
  airlineLogos?: Record<string, string>
  /** Optional: custom resolver if you need dynamic mapping */
  getAirlineLogo?: (code: string) => string | undefined
  
  /** For multi-segment search */
  adultCount?: number
  childCount?: number
  babyCount?: number
  
  /** Previously selected segments (for fare-rule API) */
  previousSegments?: Array<{ sectors: Sector[] }>
  
  /** New fields from flight-search response */
  validatingAirlineCode?: string
  itineraryRBDs?: string
}>()

/** Emits (new-shape payload, richer)**/
const emit = defineEmits<{
  (e: 'select', payload: {
    refNumber?: number
    sectors: Sector[]
    totalMinutes: number
    stopsCount: number
    totalPrice: number
    currency: string
    roundTripIncluded?: boolean
    header: {
      departureTime: string
      arrivalTime: string
      departureAirportCode: string
      arrivalAirportCode: string
      departureTerminal: string
      arrivalTerminal: string
    }
  }): void
  (e: 'purchase', payload: { 
    fare: FareOption; 
    refNumber?: number;
    fareRuleData?: any;
  }): void
}>()

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const expanded1 = ref(!!props.defaultOpen1)
const fareShow = ref(2)
const showTooltip = ref(false)
const tooltipStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' })

// Fare rule data
const fareRuleData = ref<FareRuleResponse['data'] | null>(null)
const fareRuleLoading = ref(false)
const fareRuleError = ref<string | null>(null)
const dynamicFareOptions = ref<FareOption[]>([])
const show404Dialog = ref(false)

// Router
const router = useRouter()
const route = useRoute()

/** -------------------- Derived -------------------- */
const sectors = computed<Sector[]>(() => props.sectors ?? [])

const airlines = computed(() => {
  const codes = props.airlineCode ?? []
  const names = props.airlineName ?? []
  
  if (!codes.length && !names.length && sectors.value.length) {
    const uniq = new Map<string, string>()
    sectors.value.forEach(s => {
      const code = s.marketingAirlineCode || s.operatingAirlineCode
      const name = s.marketingAirlineName || s.operatingAirlineName
      if (code) uniq.set(code, name)
    })
    return Array.from(uniq.entries()).map(([code, name]) => ({ code, name, logo: resolveAirlineLogo(code) }))
  }

  return codes.map((code, i) => ({ code, name: names[i] ?? code, logo: resolveAirlineLogo(code) }))
})

const departureTime = computed(() => props.departureTime || sectors.value[0]?.departureTime || '')
const arrivalTime = computed(() => props.arrivalTime || sectors.value[sectors.value.length - 1]?.arrivalTime || '')
const departureAirportCode = computed(() => props.departureAirportCode || sectors.value[0]?.departureAirportCode || '')
const arrivalAirportCode = computed(() => props.arrivalAirportCode || sectors.value[sectors.value.length - 1]?.arrivalAirportCode || '')
const departureTerminal = computed(() => props.departureTerminal || sectors.value[0]?.departureTerminal || '')
const arrivalTerminal = computed(() => props.arrivalTerminal || sectors.value[sectors.value.length - 1]?.arrivalTerminal || '')

const totalMinutes = computed(() => props.durationMinutes ?? sectors.value.reduce((sum, s) => sum + (s.durationMinutes || 0), 0))
const totalDurationText = computed(() => toDuration(totalMinutes.value))
const stopsCount = computed(() => Math.max(0, sectors.value.length - 1))

const currencyDisplay = computed(() => props.currency ?? 'TWD')
const priceTotal = computed(() => (props.priceFrom ?? 0))
const taxMode = computed(() => props.taxMode ?? 'in')
const visibleFares = computed(() => {
  const options = dynamicFareOptions.value.length > 0 ? dynamicFareOptions.value : (props.fareOptions ?? [])
  return options.slice(0, fareShow.value)
})

// Import all airline logos at build time using Vite's glob import
const airlineLogosModules = import.meta.glob('@/assets/imgs/airlines/*.png', { eager: true, import: 'default' })

function resolveAirlineLogo(code?: string): string {
  if (!code) return AirlineDefault;
  
  // Try to find the airline logo from the imported modules
  const fullPath = Object.keys(airlineLogosModules).find(path => path.includes(`/${code}.png`))
  
  if (fullPath && airlineLogosModules[fullPath]) {
    return airlineLogosModules[fullPath] as string
  }
  
  // Fallback to default logo if not found
  return AirlineDefault;
}

/** -------------------- Image error handler -------------------- */
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = AirlineDefault;  // Fallback to default logo when image fails to load
}

function airlineLogoFor(sec: Sector) {
  const code = sec.marketingAirlineCode || sec.operatingAirlineCode
  return resolveAirlineLogo(code)
}

/** -------------------- Transfer logic -------------------- */
/**
 * 判斷是否應該顯示「不同機場」標記
 * 只有當前航段的出發機場代碼與前一航段的抵達機場代碼不同時才顯示
 */
function shouldShowDifferentAirport(sectorIndex: number): boolean {
  if (sectorIndex >= sectors.value.length - 1) return false
  
  const currentSector = sectors.value[sectorIndex]
  const nextSector = sectors.value[sectorIndex + 1]
  
  // 比較當前航段的抵達機場與下一航段的出發機場
  // 如果機場代碼不同，表示真的是不同機場
  return currentSector.arrivalAirportCode !== nextSector.departureAirportCode
}

/** -------------------- Shared actions -------------------- */
interface SharedData { 
  isOpenBaggageInfoAndFeeRule?: boolean; 
  isSearch?: boolean;
  fareRuleData?: any;
}
const updateValue = inject<(val: SharedData) => void>('updateValue')
function openBaggageInfoAndFeeRule() { 
  updateValue?.({ 
    isOpenBaggageInfoAndFeeRule: true,
    fareRuleData: fareRuleData.value 
  }) 
}

/** -------------------- UI handlers -------------------- */
function onMouseEnter(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipStyle.value = { top: `${rect.bottom + 8}px`, left: `${rect.left}px` }
  showTooltip.value = true
}
function onMouseLeave() { showTooltip.value = false }

/** -------------------- Emits -------------------- */
function goReturn() {
  emit('select', {
    refNumber: props.refNumber,
    sectors: sectors.value,
    totalMinutes: totalMinutes.value,
    stopsCount: stopsCount.value,
    totalPrice: priceTotal.value,
    currency: currencyDisplay.value,
    roundTripIncluded: props.roundTripIncluded,
    header: {
      departureTime: departureTime.value,
      arrivalTime: arrivalTime.value,
      departureAirportCode: departureAirportCode.value,
      arrivalAirportCode: arrivalAirportCode.value,
      departureTerminal: departureTerminal.value,
      arrivalTerminal: arrivalTerminal.value,
    },
  })
}
function goBooking(fare: FareOption) {
  emit('purchase', { 
    fare, 
    refNumber: props.refNumber,
    fareRuleData: fareRuleData.value 
  })
}

async function handleExpanded1() {
  console.log('handleExpanded1 called, current expanded1:', expanded1.value)
  console.log('leg:', props.leg)
  console.log('fareRuleData:', fareRuleData.value)
  console.log('dynamicFareOptions:', dynamicFareOptions.value)
  
  if (!expanded1.value) {
    // Expanding - first expand immediately to show skeleton
    expanded1.value = true
    console.log('Expanded immediately, will fetch fare rule...')
    
    // Then fetch fare-rule API if we haven't loaded data yet
    if (!fareRuleData.value && !fareRuleLoading.value) {
      console.log('Fetching fare rule...')
      await fetchFareRule()
    }
  } else {
    // Collapsing
    expanded1.value = false
  }
  console.log('After toggle, expanded1:', expanded1.value)
}

async function fetchFareRule() {
  if (!props.sectors || props.sectors.length === 0) {
    console.error('No sectors available for fare rule query')
    return
  }

  console.log('Starting fetchFareRule...')
  console.log('Current flight sectors:', props.sectors)
  console.log('Previous segments:', props.previousSegments)
  
  fareRuleLoading.value = true
  fareRuleError.value = null

  try {
    // Combine previous segments with current flight sectors
    // previousSegments contains segment objects, each with a sectors array
    const allSectors = [
      ...(props.previousSegments?.flatMap(seg => seg.sectors) ?? []),
      ...props.sectors
    ]
    
    console.log('All sectors for fare-rule API:', allSectors)
    
    const segments: SegmentPick[] = allSectors.map(sector => {
      // Remove airline prefix from flight number
      // Example: "7C6101" -> "6101", "CI607" -> "607"
      const airlineCode = sector.marketingAirlineCode || sector.operatingAirlineCode
      let flightNumber = sector.flightNo || ''
      
      if (airlineCode && flightNumber && flightNumber.startsWith(airlineCode)) {
        // Remove the airline code prefix
        flightNumber = flightNumber.substring(airlineCode.length)
      } else if (flightNumber) {
        // Fallback: remove leading letters (but keep letters that are part of the number)
        flightNumber = flightNumber.replace(/^[A-Z]+/, '')
      }
      
      console.log(`Flight number transformation: ${sector.flightNo} -> ${flightNumber}`)
      
      return {
        marketingCarrier: sector.marketingAirlineCode,
        operatingCarrier: sector.operatingAirlineCode,
        flightNumber: flightNumber,
        fromAirport: sector.departureAirportCode,
        toAirport: sector.arrivalAirportCode,
        departureDateLocal: sector.departureDate,
        departureTimeLocal: sector.departureTime,
        rbd: sector.bookingClass,
        cabinType: sector.cabinType
      }
    })

    const pax: PaxMix = {
      adt: props.adultCount ?? 1,
      cnn: props.childCount ?? 0,
      inf: props.babyCount ?? 0
    }

    // 判斷行程類型：1=單程, 2=往返, 3=多行程
    let itineraryType = 1 // 預設單程
    if (props.tripType === 'roundtrip') {
      itineraryType = 2
    } else if (props.tripType === 'multi') {
      itineraryType = 3
    }

    const request: FareRuleRequest = { 
      segments, 
      pax,
      itineraryType,
      validatingAirlineCode: props.validatingAirlineCode,
      itineraryRBDs: props.itineraryRBDs
    }
    
    console.log('Fare rule request:', JSON.stringify(request, null, 2))
    
    const response = await fareRule(request)
    
    console.log('Fare rule response:', response)
    
    if (response.data.head.code === 0) {
      fareRuleData.value = response.data.data
      
      console.log('Fare rule data received:', fareRuleData.value)
      
      // Transform fare rule data into fare options for display
      dynamicFareOptions.value = transformFareRuleToOptions(response.data.data)
      
      console.log('Dynamic fare options generated:', dynamicFareOptions.value)
    } else {
      // Check if it's a 404 error (could be in response code or HTTP status)
      if (response.data.head.code === 404 || response.status === 404) {
        show404Dialog.value = true
        fareRuleError.value = null
      } else {
        fareRuleError.value = response.data.head.message || 'Failed to fetch fare rules'
        console.error('Fare rule API error:', fareRuleError.value)
      }
    }
  } catch (error: any) {
    // Check if it's a 404 error
    if (error.response?.status === 404) {
      show404Dialog.value = true
      fareRuleError.value = null
    } else {
      fareRuleError.value = error.message || 'Error fetching fare rules'
      console.error('Fare rule fetch error:', error)
    }
  } finally {
    fareRuleLoading.value = false
  }
}

function handle404Confirm() {
  show404Dialog.value = false
  
  // Get current search params from URL to preserve user inputs
  const currentQuery = route.query as Record<string, string | string[]>
  const searchParams: Record<string, string> = {}
  
  // Extract all search-related params (preserve trip type, all segments, dates, passengers, filters)
  // This handles single, round trip, and multi-segment searches
  // Clear selectedRefs to reset to first step (no segments selected)
  Object.keys(currentQuery).forEach(key => {
    // Keep all search-related params (tripType, dep*, arr*, date*, returnDate*, passengers, filters)
    // Exclude booking-specific params (step, tripId) and selectedRefs (to reset to first step)
    if (
      key === 'tripType' ||
      key.startsWith('dep') ||
      key.startsWith('arr') ||
      key.startsWith('date') ||
      key.startsWith('returnDate') ||
      key === 'adults' ||
      key === 'children' ||
      key === 'infants' ||
      key === 'airline' ||
      key === 'cabin' ||
      key === 'nonStop'
    ) {
      const value = currentQuery[key]
      if (Array.isArray(value)) {
        searchParams[key] = value[0]
      } else if (value) {
        searchParams[key] = value
      }
    }
  })
  
  // Note: We intentionally exclude 'selectedRefs' to reset to the first step of flight search
  
  // Navigate to home page with preserved search params
  router.push({
    path: '/',
    query: searchParams
  })
}

function transformFareRuleToOptions(data: FareRuleResponse['data']): FareOption[] {
  // 根據展開的航段方向（props.leg）決定要顯示哪一組 baggage
  let baggageGroup = null;
  if (Array.isArray(data.baggage)) {
    if (props.leg === 'outbound') {
      baggageGroup = data.baggage[0];
    } else if (props.leg === 'return') {
      baggageGroup = data.baggage.length > 1 ? data.baggage[1] : data.baggage[0];
    } else {
      baggageGroup = data.baggage[0];
    }
  }

  // 合併所有乘客類型的 notes
  const notes: { type: FareNoteType; icon: FareIconType; text: string }[] = [];
  const passengerTypes = [...new Set(data.fareSummary.map(f => f.passengerType))];
  for (const ptc of passengerTypes) {
    const summary = data.fareSummary.find(s => s.passengerType === ptc);
    const baggageInfo = baggageGroup?.passengers?.find(p => p.passengerType === ptc);
    const rules = data.fareRuleTable.filter(r => r.passengerType === ptc);

    // Baggage info
    if (baggageInfo?.checkInData) {
      const bag = baggageInfo.checkInData;
      let baggageText = '';
      if (bag.text) {
        baggageText = `行李${summary?.passengerType === 'ADT' ? '每成人' : summary?.passengerType === 'CNN' ? '每兒童' : '每嬰兒'} ${bag.text}`;
      } else if (bag.piece > 0) {
        baggageText = `行李${summary?.passengerType === 'ADT' ? '每成人' : summary?.passengerType === 'CNN' ? '每兒童' : '每嬰兒'} ${bag.piece}*${bag.weight}KG`;
      }
      if (baggageText) {
        notes.push({ type: 'allowed', icon: 'suitcase', text: baggageText });
      }
    }

    // 顯示所有規則（退票、去程改期、回程改期...）
    for (const rule of rules) {
      let label = rule.type;
      if (rule.type.includes('去程')) label = '去程改期費';
      if (rule.type.includes('回程')) label = '回程改期費';
      if (rule.type.includes('退票')) label = '退票費';
      const fee = rule.before !== null ? rule.before : 0;
      
      // 處理費用顯示文字
      let feeText = '';
      if (fee === -1) {
        feeText = '不可退改';
      } else if (fee === 0) {
        feeText = '免費';
      } else {
        feeText = `${rule.currency} ${fee.toLocaleString()}起`;
      }
      
      notes.push({
        type: fee === 0 ? 'allowed' : 'permitted',
        icon: rule.type.includes('退票') ? 'ticket' : 'calendar',
        text: `${label}${feeText}${rule.passengerTypeDisplay ? '（' + rule.passengerTypeDisplay + '）' : ''}`
      });
    }
  }

  // 只顯示一個艙等
  const cabinDesc = sectors.value[0]?.cabinDesc || '經濟艙';
  
  // 計算總價：需要根據每個乘客類型的價格和數量加總
  // 注意：fare-rule API 的 price 是「單一旅客含稅總價」，taxAmount 是「單一旅客總稅額」
  let totalPriceWithTax = 0;
  let totalTaxAmount = 0;
  
  for (const summary of data.fareSummary) {
    const priceWithTax = summary.price ?? 0;  // 單一旅客含稅總價
    const taxAmount = summary.taxAmount ?? 0;  // 單一旅客總稅額
    
    // 根據乘客類型取得對應的數量
    let passengerCount = 0;
    if (summary.passengerType === 'ADT') {
      passengerCount = props.adultCount ?? 1;
    } else if (summary.passengerType === 'CNN') {
      passengerCount = props.childCount ?? 0;
    } else if (summary.passengerType === 'INF') {
      passengerCount = props.babyCount ?? 0;
    }
    
    // 加總：單人含稅價 × 人數
    totalPriceWithTax += priceWithTax * passengerCount;
    totalTaxAmount += taxAmount * passengerCount;
    
    console.log(`Passenger type ${summary.passengerType}: price(含稅)=${priceWithTax}, tax=${taxAmount}, count=${passengerCount}, subtotal=${priceWithTax * passengerCount}`);
  }
  
  // 計算未稅價 = 含稅總價 - 稅費總額
  const totalPriceWithoutTax = totalPriceWithTax - totalTaxAmount;
  
  console.log(`Total price (with tax): ${totalPriceWithTax}, Total tax: ${totalTaxAmount}, Total (without tax): ${totalPriceWithoutTax}`);
  
  return [{
    id: `fare-0`,
    cabin: cabinDesc,
    price: totalPriceWithoutTax,  // 儲存總未稅價（含稅價 - 稅費）
    taxAmount: totalTaxAmount,     // 儲存總稅費（已乘以人數）
    notes
  }];
}
</script>

<style scoped>
/* .fade-scale-enter-active,
.fade-scale-leave-active { transition: all 0.18s ease; }
.fade-scale-enter-from,
.fade-scale-leave-to { transform: translateY(4px) scale(0.95); } */

/* Skeleton loading animation */
.skel {
  position: relative;
  overflow: hidden;
  background: #F5F5F5;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Fade transition for 404 dialog */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>