<template>
  <article 
    class="z-0 hover:z-[20]
          rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)]
          overflow-visible">
    <!-- HEADER (always visible) -->
    <div class="flex items-center gap-5 px-6 py-4">
      <!-- Airlines block -->
      <div class="relative group flex items-center gap-3 min-w-[160px]">
        <img v-if="airlines.length <= 1" :src="airlines[0].logo" :alt="airlines[0].name"
          class="w-10 h-10 object-contain" />
        <img v-else :src="AirlineTwo" :alt="airlines[0].name"
          class="w-10 h-10 object-contain" />
        <div class="leading-tight">
          <!-- single or stacked names -->
          <div v-if="airlines.length <= 1" class="text-[16px] text-others-gray7 font-bold">
            {{ airlines[0]?.name }}
          </div>
          <div v-else class="text-[16px] text-others-gray7 font-bold">
            <div v-for="a in airlines" :key="a.name">{{ a.name }}</div>
          </div>
        </div>
        <!-- HOVER CARD -->
        <div
          v-if="airlines?.length"
          class="absolute left-0 top-full mt-2 w-[200px] rounded-[10px] bg-white
                drop-shadow-[0px_2px_10px_rgba(0,0,0,0.15)] p-3 z-[100]
                opacity-0 pointer-events-none translate-y-1 scale-95
                transition duration-150 ease-out
                group-hover:opacity-100 group-hover:pointer-events-auto
                group-hover:translate-y-0 group-hover:scale-100
                group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
          role="tooltip"
          aria-label="Airlines list"
        >
          <ul class="divide-y divide-others-gray3">
            <li
              v-for="a in airlines"
              :key="a.name + (a.code || '')"
              class="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-2">
                <img
                  v-if="a.logo"
                  :src="a.logo"
                  :alt="a.name"
                  class="w-6 h-6 object-contain rounded-sm"
                />
                <span class="text-others-gray7">{{ a.name }}</span>
              </div>
              <span class="text-others-gray7 font-semibold">{{ a.code }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Times -->
      <div class="flex items-center gap-6 flex-1 justify-between">
        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ head.dep.time }}</div>
          <div class="text-sm text-others-gray1">{{ head.dep.code }} {{ head.dep.terminal }}</div>
        </div>

        <div class="relative flex flex-col items-center">
          <img src="@/assets/imgs/arrow-right.svg" />
          <p :class="[airlines.length >= 2 ? 'block' : 'hidden']" class="absolute w-max bottom-[-15px] text-others-original">轉機{{airlines.length - 1}}次</p>
        </div>

        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ head.arr.time }}</div>
          <div class="text-sm text-others-gray1">{{ head.arr.code }} {{ head.arr.terminal }}</div>
        </div>

        <div class="ml-4 text-right">
          <div class="text-[15px] text-others-gray1">{{ totalDurationText }}</div>

          <!-- toggle -->
          <button class="text-[16px] font-bold text-primary-gold hover:opacity-80 inline-flex items-center gap-1"
            @click="expanded = !expanded" :aria-expanded="expanded" type="button">
            航班資訊
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path :d="expanded ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'" fill="currentColor" />
            </svg>
          </button>
        </div>

        <!-- Price & CTA -->
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="flex items-end font-bold">
              <div class="text-[12px] text-others-original">{{ currency }}</div>
              <div class="text-[28px] text-others-original leading-none">
                {{ formatPrice(priceFrom) }}
              </div>
            </div>
            <div class="text-[12px] text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
          </div>

          <button
            v-if="props.leg === 'departure'"
            class="min-w-[98px] px-6 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-primary-gold1"
            @click="goArrival"
            type="button">
            <p>{{ '選擇' }}</p>
          </button>
          <button
            v-if="props.leg === 'arrival'"
            class="flex items-center gap-2 min-w-[98px] px-6 py-3 rounded-[15px] text-white font-bold hover:bg-primary-gold1"
            :class="expanded1 ? 'bg-primary-gold' : 'bg-primary-gold'" @click="expanded1 = !expanded1" type="button">
            <p>{{ expanded1 ? '收起' : '選擇' }}</p>
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path :d="expanded1 ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- BODY (expanded) -->
    <Transition name="fade">
      <div v-if="expanded" class="bg-[#E5E5E5]">
        <!-- Timeline for each segment -->
        <div v-for="(seg, i) in segments" :key="i">
          <div class="grid grid-cols-12 gap-4 py-8">
            <!-- left dates/times -->
            <div class="flex items-center flex-col justify-between col-span-12 md:col-span-3">
              <div class="flex flex-row items-center justify-between gap-6">
                <div class="text-others-gray1">{{ seg.dep.date }}</div>
                <div class="font-bold text-others-gray7">{{ seg.dep.time }}</div>
              </div>
              <div class="text-others-gray1">
                {{ toDuration(seg.durationMinutes) }}
              </div>
              <div class="flex items-center justify-between gap-6">
                <div class="text-others-gray1">{{ seg.arr.date }}</div>
                <div class="font-bold text-others-gray7">{{ seg.arr.time }}</div>
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
                {{ seg.dep.airportName }}{{ seg.dep.terminal ? ' ' + seg.dep.terminal : '' }}
              </div>
              <div class="flex items-center gap-2 text-others-gray1">
                <img v-if="seg.carrier?.logo" :src="seg.carrier.logo" :alt="seg.carrier?.name"
                  class="w-5 h-5 object-contain" />
                <span class="font-semibold">
                  {{ seg.flightNo ? seg.flightNo : seg.carrier?.code }}
                </span>
                <span class="text-others-gray1"> {{ seg.carrier?.name }} </span>
                <span class="text-others-gray1"> {{ seg.equipment ? ' ' + seg.equipment : '' }}</span>
              </div>
              <div class="font-bold text-others-gray7">
                {{ seg.arr.airportName }}{{ seg.arr.terminal ? ' ' + seg.arr.terminal : '' }}
              </div>
            </div>
          </div>
            <!-- transfer chips (between legs) -->
            <div v-if="i < segments.length - 1 && transferNotes?.[i]" class="mx-6 my-4 text-others-gray1">
              <div class="inline-flex items-center gap-2 bg-white rounded-[10px] px-6 py-2">
                <span>於{{ transferNotes[i].location }}轉機</span> | 
                <span class="text-others-original">{{ toDuration(transferNotes[i].durationMinutes) }}</span> | 
                <span v-if="transferNotes[i].differentAirport" class="text-others-original">不同航廈</span> | 
                <span v-if="transferNotes[i].baggageThrough">行李直掛</span>
              </div>
            </div>
        </div>
      </div>
    </Transition>

    <!-- BODY (expanded1) -->
    <Transition name="fade">
      <div v-if="expanded1" class="bg-[#E5E5E5]">
        <!-- Fare options (optional) -->
        <div v-if="fareOptions?.length" class="mt-4 bg-white overflow-hidden">
          <div v-for="(fare, idx) in visibleFares" :key="idx"
            class="grid grid-cols-12 gap-4 p-5 border-b last:border-b-0 border-others-gray3">
            <div class="col-span-12 md:col-span-2 text-others-gray1 font-bold flex items-center justify-center">
              {{ fare.cabin }}
            </div>
            <ul class="col-span-12 md:col-span-6 space-y-2">
              <li v-for="(n, i) in fare.notes" :key="i" class="flex items-center gap-2">
                <img :src="noteIcon(n.type, n.icon)" />
                <span :class="noteTextClass(n.type)" class="text-[14px]">
                  {{ n.text }}
                </span>
              </li>
              <li class="text-others-original text-[14px] font-bold cursor-pointer" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</li>
            </ul>
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right">
                <div class="flex items-end font-bold">
                  <div class="text-[12px] text-others-original">{{ currency }}</div>
                  <div class="text-[28px] text-others-original leading-none">
                    {{ formatPrice(fare.price) }}
                  </div>
                </div>
                <div class="text-[12px] text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
              </div>
              <button class="bg-others-original hover:bg-others-hover min-w-[98px] text-white font-bold rounded-[10px] px-6 py-3"
                @click="goBooking(fare)" type="button">
                訂購
              </button>
            </div>
          </div>

          <div v-if="fareOptions.length > fareShow" class="p-4 text-right">
            <button class="text-others-original font-bold hover:opacity-80" @click="fareShow = fareOptions.length">
              顯示更多 ▾
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'

import { formatPrice, noteIcon, noteTextClass, toDuration } from '@/utils'
import type { Airline, Segment, EndPoint, TransferNote, FareOption } from '@/utils/types'

import AirlineTwo from '@/assets/imgs/airlines/airline-two.svg'
import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

// Same type as grandparent
interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean
}

// Inject function and type it properly
const updateValue = inject<(val: SharedData) => void>('updateValue')

function openBaggageInfoAndFeeRule() {
  updateValue?.({ isOpenBaggageInfoAndFeeRule: true})
}

const props = defineProps<{
  airlines: Airline[]
  segments: Segment[]
  head: { dep: EndPoint; arr: EndPoint }               // quick info for header
  durationMinutes: number
  stopsCount?: number                                  // 0=直飛, 1=轉機1次 ...
  priceFrom: number
  currency?: string
  roundTripIncluded?: boolean
  transferNotes?: TransferNote[]
  fareOptions?: FareOption[]
  defaultOpen?: boolean
  defaultOpen1?: boolean
  leg: 'departure' | 'arrival'
}>()

const emit = defineEmits<{
  (e: 'select', payload: {
    segments: Segment[]
    head: { dep: EndPoint, arr: EndPoint }
    durationMinutes: number
    stopsCount?: number
    priceFrom: number
    currency?: string
    roundTripIncluded?: boolean
    transferNotes?: TransferNote[]
    fareOptions?: FareOption[]
  }): void
  (e: 'purchase', payload: { fare: FareOption }): void
  (e: 'update:leg', v: 'departure' | 'arrival'): void
}>()

function goArrival() {
  emit('select', {
    segments: props.segments,
    head: props.head,
    durationMinutes: props.durationMinutes,
    stopsCount: props.stopsCount,
    priceFrom: props.priceFrom,
    currency: props.currency,
    roundTripIncluded: props.roundTripIncluded,
    transferNotes: props.transferNotes,
  })
  emit('update:leg', 'arrival')
}

function goBooking(fare: any) {
  emit('select', {
    segments: props.segments,
    head: props.head,
    durationMinutes: props.durationMinutes,
    stopsCount: props.stopsCount,
    priceFrom: props.priceFrom,
    currency: props.currency,
    roundTripIncluded: props.roundTripIncluded,
    transferNotes: props.transferNotes,
  })
  emit('purchase', {
    fare: fare
  })
}

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const expanded1 = ref(!!props.defaultOpen1)
const fareShow = ref(2)

/** -------------------- Computed -------------------- */
const currency = computed(() => props.currency ?? 'TWD')
const totalDurationText = computed(() => toDuration(props.durationMinutes))
const visibleFares = computed(() =>
  props.fareOptions ? props.fareOptions.slice(0, fareShow.value) : []
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .18s ease;
}

.fade-enter-from,

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>