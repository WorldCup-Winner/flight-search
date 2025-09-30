<template>
  <div class="mx-auto max-w-6xl pb-6">
    <div class="grid grid-cols-12 gap-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
          <FilterSideBar :stopsPricing="{ direct: 5545, oneStop: 8545 }" :alliances="alliances" :airlines="airlines"
            :depAirports="depAirports" :arrAirports="arrAirports" @update:filters="onFiltersChange" />
      </aside>

      <!-- MAIN -->
      <section class="col-span-12 md:col-span-9">
        <!-- HEADER STRIP -->
        <div class="mb-4 bg-none">
          <div class="relative rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] mb-4" :class="[ departureOrArrival === 'departure' ? 'bg-primary-gold2' : 'bg-others-gray4' ]">
            <!-- Left orange tab -->
            <div class="absolute inset-y-0 left-0 w-28 bg-others-original text-white grid place-items-center rounded-l-[10px]">
              <span class="text-[22px]">{{ departureOrArrival === 'departure' ? '去程' : '回程' }}</span>
            </div>

            <div class="pl-48 pr-6 py-5 text-white">
              <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div class="text-[18px]">{{ dateText }}</div>
                <div class="flex flex-row items-center gap-3 text-[18px]">
                  <span>{{ origin.name }}({{ origin.code }})</span>
                  <img src="@/assets/imgs/icon-arrow-right-white.svg" />
                  <span>{{ destination.name }}({{ destination.code }})</span>
                </div>
              </div>
              <div class="text-[15px] mt-1 text-others-gray7">
                共找到 <span class="font-bold">{{ totalCount }}</span> 筆航班 以下皆為當地時間（24小時制），價格為每人均價。
              </div>
            </div>
          </div>

          <!-- SORT BAR -->
          <div class="bg-white px-4 py-3 drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] rounded-[10px]">
            <div class="flex flex-wrap items-center gap-4">
              <button class="px-4 py-2 rounded-[10px]"
                :class="sort.key === 'direct' ? 'text-others-original' : 'text-others-gray7'"
                @click="setSort('direct', 'asc')">
                直飛優先
              </button>

              <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
                :class="sort.key === 'price' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('price')">
                <span>價格</span>
                <div class="space-y-[-5px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'price' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M6 14l6-6 6 6" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'price' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M18 10l-6 6-6-6"/>
                  </svg>
                </div>
              </button>
              <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
                :class="sort.key === 'depTime' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('depTime')">
                <span>出發時間</span>
                <div class="space-y-[-5px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'depTime' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M6 14l6-6 6 6" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'depTime' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M18 10l-6 6-6-6"/>
                  </svg>
                </div>
              </button>
              <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
                :class="sort.key === 'arrTime' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('arrTime')">
                <span>抵達時間</span>
                <div class="space-y-[-5px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'arrTime' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M6 14l6-6 6 6" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'arrTime' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M18 10l-6 6-6-6"/>
                  </svg>
                </div>
              </button>
              <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
                :class="sort.key === 'duration' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('duration')">
                <span>飛行總時間</span>
                <div class="space-y-[-5px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'duration' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M6 14l6-6 6 6" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      :class="sort.key === 'duration' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
                    <path d="M18 10l-6 6-6-6"/>
                  </svg>
                </div>
              </button>

              <div class="ml-auto">
                <!-- Tax segmented control -->
                <div class="rounded-[10px] p-1 inline-flex gap-2 border-[1.5px] border-primary-gold">
                  <button class="px-6 py-1 rounded-md text-sm"
                    :class="taxMode === 'in' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
                    @click="taxMode = 'in'">含稅</button>
                  <button class="px-6 py-1 rounded-md text-sm"
                    :class="taxMode === 'ex' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
                    @click="taxMode = 'ex'">未稅</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- RESULTS LIST -->
        <div v-if="shownFlights.length >= 1" class="space-y-4 relative isolate">
          <TransitionGroup 
              v-if="departureOrArrival === 'departure'"
              appear>
            <FlightResultCard
              v-for="(it, i) in shownFlights" :key="it.id" v-bind="it"
              :style="{
                transitionDelay: i * 100 + 'ms',
                // transitionDelayLeave: ((shownFlights.length - i - 1) * 100) + 'ms'
              }"
              :leg="departureOrArrival"
              :price-from="displayPrice(it.priceFrom)"
              :round-trip-included="true"
              currency="TWD"
              @update:leg="departureOrArrival = $event"
              @select="handleSelect"
              @purchase="onPurchase" />
          </TransitionGroup>
          <TransitionGroup
              v-else
              appear>
            <FlightResultCard
              v-for="(it, i) in shownFlights" :key="it.id" v-bind="it"
              :style="{
                transitionDelay: i * 100 + 'ms',
                // transitionDelayLeave: ((shownFlights.length - i - 1) * 100) + 'ms'
              }"
              :leg="departureOrArrival"
              :price-from="displayPrice(it.priceFrom)"
              :round-trip-included="true"
              currency="TWD"
              @update:leg="departureOrArrival = $event"
              @select="handleSelect"
              @purchase="onPurchase" />
          </TransitionGroup>
        </div>

        <!-- LOAD MORE -->
        <div v-if="canLoadMore && shownFlights.length >= 1" class="py-8 text-center">
          <div class="inline-flex items-center gap-3 text-others-original font-bold">
            <span>更多航班訊息載入中</span>
            <img src="@/assets/imgs/icon-loading.svg" class="animate-spin-slow w-8 h-8" alt="Loading" />
          </div>
        </div>
        <div v-if="shownFlights.length <= 0">
          <SorryNoData />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { timeToMin, inWindow, demoFares, cryptoId, makeDirect } from '@/utils'
import type { CardRow } from '@/utils/types'

import FlightResultCard from '@/components/search/FlightResultCard.vue'
import FilterSideBar from '@/components/search/FilterSideBar.vue'
import SorryNoData from '@/components/ui/SorryNoData.vue'

import Airline_One from '@/assets/imgs/airline-one.svg'
import Airline_Sky from '@/assets/imgs/airline-sky.svg'
import Airline_Star from '@/assets/imgs/airline-star.svg'

import Airline_1 from '@/assets/imgs/airlines/airline-1.png'
import Airline_2 from '@/assets/imgs/airlines/airline-2.png'
import Airline_3 from '@/assets/imgs/airlines/airline-3.png'
import Airline_4 from '@/assets/imgs/airlines/airline-4.png'
import Airline_5 from '@/assets/imgs/airlines/airline-5.png'

/* -------------------- Demo query context -------------------- */
const dateText = '2025年08月26日'
const origin = { code: 'TPE', name: '台北' }
const destination = { code: 'KIX', name: '關西機場' }
const departureOrArrival = ref<'departure' | 'arrival'>('departure')

/* -------------------- Data sources (replace with API) -------------------- */

function make1Stop(code1: string, name1: string, logo1: string,
  t1: string, t2: string, xferAt: string, layMins: number,
  t3Code: string, t3: string, t4: string, dur: number, price: number, opt: any = {}): CardRow {
  const code2 = 'CI'
  return {
    id: cryptoId(),
    airlines: [{ name: name1, logo: logo1, code: code1 }, { name: '中華航空', logo: Airline_2, code: code2 }],
    head: { dep: { time: t1, code: 'TPE', terminal: 'T1' }, arr: { time: t4, code: 'KKL', terminal: 'T1' } },
    segments: [
      {
        dep: { date: '8月27日', time: t1, code: 'TPE', terminal: 'T1', airportName: 'TPE桃園國際機場T1台北' },
        arr: { date: '8月27日', time: t2, code: 'NRT', terminal: 'T3', airportName: 'NRT成田機場T3東京' },
        carrier: { name: name1, logo: logo1, code: code1 }, flightNo: `${code1}014`, equipment: 'A320', durationMinutes: 195
      },
      {
        dep: { date: '8月27日', time: t3, code: t3Code, terminal: 'T2', airportName: `${t3Code}羽田機場T2東京` },
        arr: { date: '8月27日', time: t4, code: 'KKL', terminal: 'T1', airportName: 'KKL 首爾國際機場T1 首爾' },
        carrier: { name: '中華航空', logo: Airline_2, code: code2 }, flightNo: `${code2}214`, equipment: 'A320', durationMinutes: 135
      }
    ],
    transferNotes: [{ location: '東京', durationMinutes: layMins, differentAirport: true, baggageThrough: true }],
    durationMinutes: dur,
    stopsCount: 1,
    priceFrom: price,
    fareOptions: opt.fare ? demoFares(price) : undefined
  }
}


/* alliances / airlines / airports for sidebar demo */
const alliances = [
  { id: 'one', name: '寰宇一家', logo: Airline_One, price: 8545 },
  { id: 'sky', name: '天合聯盟', logo: Airline_Sky, price: 9345 },
  { id: 'star', name: '星空聯盟', logo: Airline_Star, price: 11545 },
]
const airlines = [
  { id: 'JX', name: '星宇航空', price: 5545 },
  { id: 'IT', name: '台灣虎行', price: 6545 },
  { id: 'JW', name: '捷星日本航空', price: 6745 },
  { id: 'SL', name: '泰國獅子航空', price: 7145 },
  { id: 'MM', name: '樂桃航空', price: 8545 },
  { id: 'CI', name: '中華航空', price: 8845 },
]
const depAirports = [
  { id: 'DMK', name: '泰國獅子航空', price: 7145 },
  { id: 'KIX', name: '樂桃航空', price: 8545 },
]
const arrAirports = [
  { id: 'NRT', name: '泰國獅子航空', price: 7145 },
]

/* sample flights */
const allFlights = ref<CardRow[]>([
  makeDirect('JAL', '加加航空', Airline_1, '06:45', '11:00', 195, 5799, { fare: true }),
  makeDirect('BR', '長榮航空', Airline_1, '06:45', '11:00', 195, 5799, { fare: true }),
  makeDirect('CI', '中華航空', Airline_2, '07:30', '11:45', 195, 5899, { fare: true }),
  makeDirect('MM', '樂桃航空', Airline_3, '08:00', '12:15', 195, 6199, { fare: true }),
  make1Stop('BR', '長榮航空', Airline_5, '06:45', '11:00', 'NRT', 170, 'HND', '14:45', '17:00', 195 + 135, 6099, { fare: true }),
  makeDirect('BR', '長榮航空', Airline_3, '22:45', '02:00', 195, 5799, { nextDay: '+1', fare: true }),
  makeDirect('BR', '長榮航空', Airline_4, '23:45', '02:30', 195, 5799, { nextDay: '+1', fare: true }),
])

const router = useRouter()

function onPurchase({ fare }: any) {
  // hook up your checkout flow here
  console.log('purchase', fare)
  router.push('/booking')
}

const handleSelect = (payload: any) => {
  console.log("HandleSelect:", payload)
}

/* -------------------- Filters (from sidebar) -------------------- */
const filters = reactive<any>({
  studentOnly: false,
  stops: { direct: false, oneStop: false },
  alliances: [], airlines: [], depAirports: [], arrAirports: [],
  departTime: [0, 1439], arriveTime: [0, 1439]
})

function onFiltersChange(v: any) { Object.assign(filters, v) }

/* -------------------- Sort -------------------- */
const sort = reactive<{ key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration', dir: 'asc' | 'desc' }>({
  key: 'direct', dir: 'asc'
})
function setSort(key: any, dir: any) { sort.key = key; sort.dir = dir }
function toggleSort(key: any) {
  if (sort.key !== key) { sort.key = key; sort.dir = 'asc'; return }
  sort.dir = sort.dir === 'asc' ? 'desc' : 'asc'
}

/* -------------------- Tax toggle -------------------- */
const taxMode = ref<'in' | 'ex'>('in')
function displayPrice(p: number) {
  return taxMode.value === 'in' ? p : Math.max(0, p - 500) // demo offset
}

/* -------------------- Derived list -------------------- */
const filteredFlights = computed(() => {
  let arr = allFlights.value.slice()

  // stops filter
  const wantDirect = filters.stops.direct
  const wantOne = filters.stops.oneStop
  if (wantDirect && !wantOne) arr = arr.filter(f => f.stopsCount === 0)
  if (wantOne && !wantDirect) arr = arr.filter(f => f.stopsCount === 1)

  // airline filter
  if (filters.airlines?.length) {
    const set = new Set(filters.airlines)
    arr = arr.filter(f => f.airlines.some(a => set.has(a.code)))
  }

  // time windows (use header times)
  const depWin = filters.departTime || [0, 1439]
  const arrWin = filters.arriveTime || [0, 1439]
  arr = arr.filter(f =>
    inWindow(timeToMin(f.head.dep.time), depWin) &&
    inWindow(timeToMin(f.head.arr.time), arrWin)
  )

  // sort
  arr.sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'direct') {
      const s = (a.stopsCount - b.stopsCount)
      if (s !== 0) return s
      return (a.priceFrom - b.priceFrom) * dir
    }
    if (sort.key === 'price') return (a.priceFrom - b.priceFrom) * dir
    if (sort.key === 'depTime') return (timeToMin(a.head.dep.time) - timeToMin(b.head.dep.time)) * dir
    if (sort.key === 'arrTime') return (timeToMin(a.head.arr.time) - timeToMin(b.head.arr.time)) * dir
    if (sort.key === 'duration') return (a.durationMinutes - b.durationMinutes) * dir
    return 0
  })

  return arr
})

const totalCount = computed(() => filteredFlights.value.length)

/* “infinite” show more */
const showCount = ref(6)
const shownFlights = computed(() => filteredFlights.value.slice(0, showCount.value))
const canLoadMore = computed(() => showCount.value < filteredFlights.value.length)

/* fake infinite loader when scrolling near bottom */
const onScroll = () => {
  if (!canLoadMore.value) return
  const pad = 240
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - pad
  if (nearBottom) {
    // small debounce via RAF + timeout
    window.removeEventListener('scroll', onScroll)
    setTimeout(() => {
      showCount.value = Math.min(showCount.value + 1, filteredFlights.value.length)
      window.addEventListener('scroll', onScroll)
    }, 650)
  }
}

const apply = (on: boolean) => document.body.classList.toggle('result-bg', !!on)

onBeforeUnmount(() => {
  document.body.classList.remove('home-special')
})
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  apply(true)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.classList.remove('result-bg')
})

</script>

<style>
.v-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.v-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
.v-enter-active,
.v-leave-active,
.v-move {
  transition: all 0.4s ease;
  display: block;
}
.v-leave-active { position: absolute; }
.v-leave-from { opacity: 1; }
.v-leave-to { opacity: 0; }
</style>