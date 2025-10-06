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
                      :src="'src/assets/imgs/airlines/' + a.code + '.png'"
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
            <div class="text-[12px] pt-1 text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
          </div>

          <button
            v-if="leg === 'departure'"
            class="min-w-[98px] px-6 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-primary-gold1"
            @click="goArrival"
            type="button"
          >
            <p>選擇</p>
          </button>
          <button
            v-if="leg === 'arrival'"
            class="flex items-center gap-2 min-w-[98px] px-6 py-3 rounded-[15px] text-white font-bold"
            :class="expanded1 ? 'bg-others-gray3 hover:bg-others-gray5' : 'bg-primary-gold hover:bg-primary-gold3'"
            @click="expanded1 = !expanded1"
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
                {{ sec.departureAirportName }}{{ sec.departureTerminal ? ' ' + sec.departureTerminal : '' }}
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
                {{ sec.arrivalAirportName }}{{ sec.arrivalTerminal ? ' ' + sec.arrivalTerminal : '' }}
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
      <div v-if="expanded1" class="bg-[#E5E5E5]">
        <!-- Fare options (optional) -->
        <div v-if="fareOptions?.length" class="mt-4 bg-white rounded-b-[10px] overflow-hidden">
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
                  <div class="text-[28px] text-others-original leading-none">{{ formatPrice(fare.price) }}</div>
                </div>
                <div class="text-[12px] pt-2 text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
              </div>
              <button class="bg-others-original hover:bg-others-hover min-w-[98px] text-white font-bold rounded-[10px] px-6 py-3" @click="goBooking(fare)" type="button">
                訂購
              </button>
            </div>
          </div>

          <div v-if="fareOptions.length > fareShow" class="p-4 flex justify-end">
            <button class="flex items-center w-fit text-others-original hover:opacity-80" @click="fareShow = fareOptions.length">
              <span>顯示更多</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 10l-6 6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { formatDateToChinese, formatPrice, noteIcon, toDuration } from '@/utils'

// Icons
import AirlineTwo from '@/assets/imgs/airlines/airline-two.svg'
import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'
import type { FareIconType, FareNoteType } from '@/utils/types'

/** New-shape ONLY **/

type Craft = {
  craftType: string
  enName: string | null
  minSeats: number
  maxSeats: number
  craftName: string
}

export type SectorNew = {
  departureDate: string
  departureTime: string
  toDate?: string
  arrivalDate: string
  arrivalTime: string
  isRedEye: boolean
  durationMinutes: number
  departureCityCode: string
  departureCityName: string
  arrivalCityCode: string
  arrivalCityName: string
  flightNo: string
  operatingAirlineCode: string
  operatingAirlineName: string
  marketingAirlineCode: string
  marketingAirlineName: string
  operatingFlightNo: string
  craft: Craft
  departureAirportCode: string
  departureAirportName: string
  departureTerminal: string
  arrivalAirportCode: string
  arrivalAirportName: string
  arrivalTerminal: string
  cabinType: string
  cabinDesc: string
  bookingClass: string
  crossDays: number
  transfer: {
    transferCity: string
    transferStayMinutes: number
    isCrossday: boolean
    isChangeAirport: boolean
    isChangeTerminal: boolean
  } | null
  baggageStraight: number
}

export type FareOption = {
  cabin: string
  price: number
  notes: { type: string; icon?: string; text: string }[]
}

const props = defineProps<{
  leg: 'departure' | 'arrival'
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
  sectors?: SectorNew[]

  // UI extras
  currency?: string
  priceFrom?: number
  roundTripIncluded?: boolean
  fareOptions?: FareOption[]
  defaultOpen?: boolean
  defaultOpen1?: boolean

  /** Optional: map airline code -> logo url */
  airlineLogos?: Record<string, string>
  /** Optional: custom resolver if you need dynamic mapping */
  getAirlineLogo?: (code: string) => string | undefined
}>()

/** Emits (new-shape payload, richer)**/
const emit = defineEmits<{
  (e: 'select', payload: {
    refNumber?: number
    sectors: SectorNew[]
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
  (e: 'purchase', payload: { fare: FareOption; refNumber?: number }): void
  (e: 'update:leg', v: 'departure' | 'arrival'): void
}>()

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const expanded1 = ref(!!props.defaultOpen1)
const fareShow = ref(2)
const showTooltip = ref(false)
const tooltipStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' })

/** -------------------- Derived -------------------- */
const sectors = computed<SectorNew[]>(() => props.sectors ?? [])

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
const visibleFares = computed(() => (props.fareOptions ?? []).slice(0, fareShow.value))

function resolveAirlineLogo(code?: string) {
  if (!code) return AirlineDefault;
  const url = `src/assets/imgs/airlines/${code}.png`;
  return url ? url : AirlineDefault;  // Return default if URL is not valid
}

/** -------------------- Image error handler -------------------- */
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = AirlineDefault;  // Fallback to default logo when image fails to load
}

function airlineLogoFor(sec: SectorNew) {
  const code = sec.marketingAirlineCode || sec.operatingAirlineCode
  return resolveAirlineLogo(code)
}

/** -------------------- Shared actions -------------------- */
interface SharedData { isOpenBaggageInfoAndFeeRule?: boolean; isSearch?: boolean }
const updateValue = inject<(val: SharedData) => void>('updateValue')
function openBaggageInfoAndFeeRule() { updateValue?.({ isOpenBaggageInfoAndFeeRule: true }) }

/** -------------------- UI handlers -------------------- */
function onMouseEnter(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipStyle.value = { top: `${rect.bottom + 8}px`, left: `${rect.left}px` }
  showTooltip.value = true
}
function onMouseLeave() { showTooltip.value = false }

/** -------------------- Emits -------------------- */
function goArrival() {
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
  emit('update:leg', 'arrival')
}
function goBooking(fare: FareOption) {
  emit('purchase', { fare, refNumber: props.refNumber })
}
</script>

<style scoped>
/* .fade-scale-enter-active,
.fade-scale-leave-active { transition: all 0.18s ease; }
.fade-scale-enter-from,
.fade-scale-leave-to { transform: translateY(4px) scale(0.95); } */
</style>