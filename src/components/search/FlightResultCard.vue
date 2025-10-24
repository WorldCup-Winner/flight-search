<template>
  <article
    class="relative z-[50] hover:z-[999] rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-visible"
  >
    <!-- HEADER (always visible) -->
    <div class="flex items-center gap-5 px-6 py-4">
      <!-- Airlines block -->
      <div
        class="relative group flex items-center gap-3 min-w-[160px]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <img
          v-if="airlines.length <= 1"
          :src="airlineLogoForWithCode(airlines[0].code)"
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
                      :src="airlineLogoForWithCode(a.code)"
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
      <div class="flex items-center gap-6 flex-1 justify-between">
        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ departureTime }}</div>
          <div class="text-sm text-others-gray1">{{ departureAirportCode }} {{ departureTerminal }}</div>
        </div>

        <div class="relative flex flex-col items-center">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <img class="absolute w-10" src="@/assets/imgs/arrow-right.svg"  />
            <div v-if="stopsCount >= 1" class="absolute top-[17px] border-2 border-primary-gold bg-white rounded-full w-3 h-3"></div>
          </div>
          <p :class="[stopsCount >= 1 ? 'block' : 'hidden']" class="absolute w-max bottom-[-15px] text-others-original">
            轉機{{ stopsCount }}次
          </p>
        </div>

        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ arrivalTime }}</div>
          <div class="text-sm text-others-gray1">{{ arrivalAirportCode }} {{ arrivalTerminal }}</div>
        </div>

        <div class="ml-4 text-right">
          <div class="text-[14px] text-others-gray1">{{ totalDurationText }}</div>

          <!-- toggle -->
          <button
            class="text-[16px] font-bold text-primary-gold hover:opacity-80 inline-flex items-center gap-1"
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
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="flex items-end font-bold">
              <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
              <div class="text-[28px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
              <div class="text-[12px] text-others-gray1">&nbsp; 起</div>
            </div>
            <div v-if="taxMode == 'in'" class="text-[12px] pt-1 text-others-gray1">{{ '來回含稅價'  }}</div>
            <div v-else class="text-[12px] pt-1 text-others-gray1">{{ '參考稅費'  }}&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}</div>
          </div>

          <button
            v-if="leg === 'outbound'"
            class="min-w-[98px] px-6 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-primary-gold1"
            @click="goReturn"
            type="button"
          >
            <p>選擇</p>
          </button>
          <button
            v-if="leg === 'return'"
            class="flex items-center gap-2 min-w-[98px] px-6 py-3 rounded-[15px] text-white font-bold"
            :class="expanded1 ? 'bg-others-gray3 hover:bg-others-gray5' : 'bg-primary-gold hover:bg-primary-gold3'"
            @click="handleExpanded1"
            type="button"
          >
            <p>{{ expanded1 ? '收起' : '選擇' }}</p>
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
                <div class="font-bold text-others-gray7">{{ sec.arrivalTime }}</div>
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
                {{ sec.departureAirportCode }}{{ sec.departureAirportName }}{{ sec.departureTerminal }}{{  sec.departureCityName }}
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
                {{ sec.arrivalAirportCode }}{{ sec.arrivalAirportName }}{{ sec.arrivalTerminal }}{{ sec.arrivalCityName }}
              </div>
            </div>
          </div>

          <!-- transfer chips (between legs) -->
          <div v-if="i < sectors.length - 1 && sec.transfer" class="mx-10 my-2 text-others-gray1">
            <div class="inline-flex items-center gap-2 bg-white rounded-[10px] px-6 py-2">
              <span>於{{ sec.transfer.transferCity }}轉機</span>
              <span class="text-others-gray3">|</span>
              <span class="text-others-original">{{ toDuration(sec.transfer.transferStayMinutes) }}</span>
              <span class="text-others-gray3" v-if="sec.transfer.isChangeTerminal">|</span>
              <span v-if="sec.transfer.isChangeTerminal" class="text-others-original">不同航廈</span>
              <span class="text-others-gray3" v-if="sec.transfer.isChangeAirport">|</span>
              <span v-if="sec.transfer.isChangeAirport" class="text-others-original">不同機場</span>
              <span v-if="sec.baggageStraight > 0">｜ 行李直掛</span>
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
          <div v-for="n in 1" :key="`skeleton-${n}`" class="relative grid grid-cols-12 gap-4 p-5 border-b border-others-gray3">
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
        <div v-else-if="fareRuleError" class="p-8 text-center text-text-error">
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
                  <div class="text-[28px] text-others-original leading-none">{{ formatPrice(roundTripIncluded ? priceTotal : fare.price) }}</div>
                </div>
                <div class="text-[12px] pt-2 text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
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
  </article>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { airlineLogoFor, airlineLogoForWithCode, formatDateToChinese, formatPrice, noteIcon, onImageError, resolveAirlineLogo, toDuration } from '@/utils'

// Icons
import AirlineTwo from '@/assets/imgs/airlines/airline-two.svg'
import type { CardRow, FareIconType, FareNoteType, FareOption, FareRuleRequest, FareRuleResponse, FareSegment, Pax, Sector } from '@/utils/types'
import { fareRule } from '@/api'

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
  previousSegments?: CardRow[]
}>()

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const expanded1 = ref(!!props.defaultOpen1)
const fareShow = ref(2)
const showTooltip = ref(false)
const tooltipStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' })

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
const taxMode = computed(() => props.taxMode ?? "來回含稅價")
const fareRuleData = ref<FareRuleResponse['data'] | null>(null)
const fareRuleLoading = ref(false)
const fareRuleError = ref<string | null>(null)
const dynamicFareOptions = ref<FareOption[]>([])
const visibleFares = computed(() => {
  const options = dynamicFareOptions.value.length > 0 ? dynamicFareOptions.value : (props.fareOptions ?? [])
  return options.slice(0, fareShow.value)
})

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

  if (!expanded1.value) {
    // Expanding - first expand immediately to show skeleton
    expanded1.value = true
    
    // Then fetch fare-rule API if we haven't loaded data yet
    if (!fareRuleData.value && !fareRuleLoading.value) {
      console.log('Fetching fare rule...')
      await fetchFareRule()
    }
  } else {
    // Collapsing
    expanded1.value = false
  }
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
    const allSectors = [
      ...(props.previousSegments?.flatMap(seg => seg.sectors) ?? []),
      ...props.sectors
    ]
    console.log('All sectors for fare-rule API:', allSectors)
    
    const segments: FareSegment[] = allSectors.map(sector => {
      const airlineCode = sector.marketingAirlineCode || sector.operatingAirlineCode
      let flightNumber = sector.flightNo
      
      if (airlineCode && flightNumber.startsWith(airlineCode)) {
        flightNumber = flightNumber.substring(airlineCode.length)
      } else {
        flightNumber = flightNumber.replace(/^[A-Z]+/, '')
      }
      
      return {
        marketingCarrier: sector.marketingAirlineCode,
        operatingCarrier: sector.operatingAirlineCode,
        flightNumber: flightNumber,
        fromAirport: sector.departureAirportCode,
        toAirport: sector.arrivalAirportCode,
        departureDateLocal: sector.departureDate,
        departureTimeLocal: sector.departureTime,
        rbd: sector.bookingClass
      }
    })

    const pax: Pax = {
      adt: props.adultCount ?? 1,
      cnn: props.childCount ?? 0,
      inf: props.babyCount ?? 0
    }

    const request: FareRuleRequest = { segments, pax }
    
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
      fareRuleError.value = response.data.head.message || 'Failed to fetch fare rules'
      console.error('Fare rule API error:', fareRuleError.value)
    }
  } catch (error: any) {
    fareRuleError.value = error.message || 'Error fetching fare rules'
    console.error('Fare rule fetch error:', error)
  } finally {
    fareRuleLoading.value = false
  }
}

function transformFareRuleToOptions(data: FareRuleResponse['data']): FareOption[] {
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
    } else {
      let baggageText = '無免費託運行李';
      notes.push({ type: 'notallowed', icon: 'suitcase', text: baggageText })
    }

    // 顯示所有規則（退票、去程改期、回程改期...）
    for (const rule of rules.slice(0, rules.length / 2)) {
      let label = rule.type;
      if (rule.type.includes('去程')) label = '去程改期費';
      if (rule.type.includes('回程')) label = '回程改期費';
      if (rule.type.includes('退票')) label = '退票費';
      const fee = rule.before !== null ? rule.before : 0;
      notes.push({
        type: fee === 0 ? 'allowed' : 'permitted',
        icon: rule.type.includes('退票') ? 'ticket' : 'calendar',
        text: `${label}${rule.currency} ${fee.toLocaleString()}起${rule.passengerTypeDisplay ? '（' + rule.passengerTypeDisplay + '）' : ''}`
      });
    }
  }

  notes.push(
    {
      type: 'allowed',
      icon: 'clock',
      text: '付款後48小時出票'
    },
    {
      type: 'allowed',
      icon: 'info',
      text: '由2至多張機票組成'
    },
    {
      type: 'allowed',
      icon: 'info',
      text: '由海外供應商提供'
    }
  )
  console.log("NOTES:", notes)
  // 只顯示一個艙等
  const cabinDesc = sectors.value[0]?.cabinDesc || '經濟艙';
  // 票價以第一個 fareSummary 為主（或可加總/平均，依需求）
  const price = data.fareSummary[0]?.price ?? 0;
  return [{
    id: `fare-0`,
    cabin: cabinDesc,
    price,
    notes
  }];
}
</script>

<style scoped>
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
</style>