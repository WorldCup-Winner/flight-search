<template>
  <div class="mx-auto max-w-[1200px] px-4 py-6">
    <div class="grid grid-cols-12 gap-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
        <FilterSideBar :stopsPricing="{ direct: 5545, oneStop: 8545 }" :alliances="alliances" :airlines="airlines"
          :depAirports="depAirports" :arrAirports="arrAirports" @update:filters="onFiltersChange" />
      </aside>

      <!-- MAIN -->
      <section class="col-span-12 md:col-span-9">
        <!-- HEADER STRIP -->
        <div class="mb-4 bg-white">
          <div class="relative bg-primary-gold2 rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] mb-4">
            <!-- Left orange tab -->
            <div class="absolute inset-y-0 left-0 w-40 bg-[#F39800] text-white grid place-items-center rounded-l-xl">
              <span class="text-[28px]">去程</span>
            </div>

            <div class="pl-48 pr-6 py-5 text-white/95">
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div class="text-[26px]">{{ dateText }}</div>
                <div class="text-[26px]">
                  {{ origin.name }}({{ origin.code }}) &nbsp;—&nbsp; {{ destination.name }}({{ destination.code }})
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
              <button class="px-4 py-2 rounded-xl"
                :class="sort.key === 'direct' ? 'text-others-original' : 'text-others-gray7'"
                @click="setSort('direct', 'asc')">
                直飛優先
              </button>

              <button class="px-3 py-2 rounded-xl flex items-center gap-1"
                :class="sort.key === 'price' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('price')">
                <span>價格</span>
                <div class="space-y-[-5px]">
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 12l4-4 4 4" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 8l4 4 4-4" fill="currentColor" />
                </svg></div>
              </button>
              <button class="px-3 py-2 rounded-xl flex items-center gap-1"
                :class="sort.key === 'depTime' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('depTime')">
                <span>出發時間</span>
                <div class="space-y-[-5px]">
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 12l4-4 4 4" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 8l4 4 4-4" fill="currentColor" />
                </svg></div>
              </button>
              <button class="px-3 py-2 rounded-xl flex items-center gap-1"
                :class="sort.key === 'arrTime' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('arrTime')">
                <span>抵達時間</span>
                <div class="space-y-[-5px]">
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 12l4-4 4 4" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 8l4 4 4-4" fill="currentColor" />
                </svg></div>
              </button>
              <button class="px-3 py-2 rounded-xl flex items-center gap-1"
                :class="sort.key === 'duration' ? 'text-others-original' : 'text-others-gray7'"
                @click="toggleSort('duration')">
                <span>飛行總時間</span>
                <div class="space-y-[-5px]">
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 12l4-4 4 4" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 20 20" width="14" height="14" class="opacity-70">
                  <path d="M6 8l4 4 4-4" fill="currentColor" />
                </svg></div>
              </button>

              <div class="ml-auto">
                <!-- Tax segmented control -->
                <div class="rounded-xl p-1 inline-flex gap-2 border-[1.5px] border-primary-gold">
                  <button class="px-6 py-1 rounded-lg text-sm font-bold"
                    :class="taxMode === 'in' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
                    @click="taxMode = 'in'">含稅</button>
                  <button class="px-6 py-1 rounded-lg text-sm font-bold"
                    :class="taxMode === 'ex' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
                    @click="taxMode = 'ex'">未稅</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESULTS LIST -->
        <div class="space-y-4">
          <FlightResultCard v-for="it in shownFlights" :key="it.id" v-bind="it" :price-from="displayPrice(it.priceFrom)"
            :round-trip-included="true" currency="TWD" @purchase="onPurchase" />
        </div>

        <!-- LOAD MORE -->
        <div v-if="canLoadMore" class="py-8 text-center">
          <div class="inline-flex items-center gap-3 text-[#F39800] font-bold">
            <span>更多航班訊息載入中</span>
            <img src="@/assets/imgs/icon-loading.svg" class="animate-spin-slow w-8 h-8" alt="Loading" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import FlightResultCard from '@/components/search/FlightResultCard.vue'
import FilterSideBar from '@/components/search/FilterSideBar.vue'

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

/* -------------------- Data sources (replace with API) -------------------- */
type Airline = { name: string; logo?: string; code?: string }
type EndPoint = { time: string; code: string; terminal?: string; date?: string; airportName?: string }
type Segment = {
  dep: EndPoint; arr: EndPoint; carrier?: Airline; flightNo?: string; equipment?: string; durationMinutes?: number
}

type CardRow = {
  id: string
  airlines: Airline[]
  head: { dep: EndPoint; arr: EndPoint }
  segments: Segment[]
  transferNotes?: { location?: string; durationMinutes?: number; differentAirport?: boolean; baggageThrough?: boolean }[]
  durationMinutes: number
  stopsCount: number
  priceFrom: number
  fareOptions?: any[]
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
  makeDirect('JAL', '加加航空', Airline_1, '06:45', '11:00', 195, 5799),
  makeDirect('BR', '長榮航空', Airline_1, '06:45', '11:00', 195, 5799, { fare: true }),
  makeDirect('CI', '中華航空', Airline_2, '07:30', '11:45', 195, 5899),
  makeDirect('MM', '樂桃航空', Airline_3, '08:00', '12:15', 195, 6199),
  make1Stop('BR', '長榮航空', Airline_5, '06:45', '11:00', 'NRT', 170, 'HND', '14:45', '17:00', 195 + 135, 6099),
  makeDirect('BR', '長榮航空', Airline_3, '22:45', '02:00', 195, 5799, { nextDay: '+1' }),
  makeDirect('BR', '長榮航空', Airline_4, '23:45', '02:30', 195, 5799, { nextDay: '+1' }),
])

function makeDirect(code: string, name: string, logo: string, t1: string, t2: string, dur: number, price: number, opt: any = {}): CardRow {
  return {
    id: cryptoId(),
    airlines: [{ name, logo, code }],
    head: { dep: { time: t1, code: 'TPE', terminal: 'T1' }, arr: { time: t2, code: 'NRT', terminal: 'T1N' } },
    segments: [{
      dep: { date: '8月27日', time: t1, code: 'TPE', terminal: 'T1', airportName: 'TPE桃園國際機場T1台北' },
      arr: { date: '8月27日', time: t2, code: 'NRT', terminal: 'T1N', airportName: 'NRT成田機場T1N東京' },
      carrier: { name, logo, code }, flightNo: `${code}014`, equipment: '空中巴士 A320', durationMinutes: dur
    }],
    durationMinutes: dur,
    stopsCount: 0,
    priceFrom: price,
    fareOptions: opt.fare ? demoFares(price) : undefined
  }
}

function make1Stop(code1: string, name1: string, logo1: string,
  t1: string, t2: string, xferAt: string, layMins: number,
  t3Code: string, t3: string, t4: string, dur: number, price: number): CardRow {
  const code2 = 'CI'
  return {
    id: cryptoId(),
    airlines: [{ name: name1, logo: logo1, code: code1 }, { name: '中華航空', logo: '/logos/CI.svg', code: code2 }],
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
        carrier: { name: '中華航空', logo: '/logos/CI.svg', code: code2 }, flightNo: `${code2}214`, equipment: 'A320', durationMinutes: 135
      }
    ],
    transferNotes: [{ location: '東京', durationMinutes: layMins, differentAirport: true, baggageThrough: true }],
    durationMinutes: dur,
    stopsCount: 1,
    priceFrom: price
  }
}

function demoFares(base: number) {
  return [
    {
      id: 'F1', cabin: '商務艙', price: base + 9880, notes: [
        { type: 'good', text: '行李每成人1*23KG' },
        { type: 'good', text: '退票費 TWD 5,136起' },
        { type: 'good', text: '日期更改 TWD 2,568起' },
        { type: 'good', text: '付款後48小時內出票' },
        { type: 'good', text: '由2至多張機票組成' },
        { type: 'good', text: '由海外供應商提供' },
      ]
    },
    {
      id: 'F2', cabin: '商務艙', price: base + 1900, notes: [
        { type: 'bad', text: '無免費托運行李' },
        { type: 'bad', text: '不可退票 / 不可更改日期' },
        { type: 'warn', text: '出票時間' },
        { type: 'neutral', text: '由2至多張機票組成' },
      ]
    },
    {
      id: 'F3', cabin: '商務艙', price: base - 200, notes: [
        { type: 'bad', text: '無免費托運行李' },
        { type: 'bad', text: '不可更改日期 / 不可退票' },
      ]
    },
  ]
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10)
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

onMounted(() => window.addEventListener('scroll', onScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

/* -------------------- Utils -------------------- */
function timeToMin(t: string): number {
  const [hs = '0', ms = '0'] = t?.split?.(':') ?? ['0', '0'];
  const h = Number(hs);
  const m = Number(ms);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}


function inWindow(v: number, [s, e]: [number, number]) {
  return v >= s && v <= e
}

function onPurchase({ fare }: any) {
  // hook up your checkout flow here
  // console.log('purchase', fare)
}
</script>
<style scoped></style>