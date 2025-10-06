<template>
  <div class="mx-auto max-w-6xl pb-6">
    <div class="grid grid-cols-12 gap-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
        <FilterSideBar
          :stopsPricing="stopsPricing"
          :alliances="alliances"
          :airlines="airlines"
          :depAirports="depAirports"
          :arrAirports="arrAirports"
          @update:filters="onFiltersChange"
        />
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
                <div class="text-[18px]">{{ formatDateToChinese(dateText) }}</div>
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
                <div class="rounded-[10px] p-2 inline-flex gap-2 border-[1.5px] border-primary-gold">
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
              v-for="(it, i) in shownFlights" :key="it.refNumber"
              v-bind="it"
              :style="{ transitionDelay: i * 100 + 'ms' }"
              :leg="departureOrArrival"
              :price-from="displayPrice(it)"
              :round-trip-included="true"
              currency="TWD"
              @update:leg="departureOrArrival = $event"
              @select="handleSelect"
              @purchase="onPurchase"
            />
          </TransitionGroup>
          <TransitionGroup
              v-else
              appear>
            <FlightResultCard
              v-for="(it, i) in shownFlights" :key="it.refNumber"
              v-bind="it"
              :style="{ transitionDelay: i * 100 + 'ms' }"
              :leg="departureOrArrival"
              :price-from="displayPrice(it)"
              :round-trip-included="true"
              currency="TWD"
              @update:leg="departureOrArrival = $event"
              @select="handleSelect"
              @purchase="onPurchase"
            />
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
import { computed, watch, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { timeToMin, inWindow, formatDateToChinese } from '@/utils'
import type { CardRow, Sector } from '@/utils/types'

import FlightResultCard from '@/components/search/FlightResultCard.vue'
import FilterSideBar from '@/components/search/FilterSideBar.vue'
import SorryNoData from '@/components/ui/SorryNoData.vue'

// ---------- Props ----------
const props = defineProps<{
  data: CardRow[]
}>()

// ---------- Header context (derived from props.data) ----------
const first = computed(() => props.data?.[0])
const dateText = computed(() => {
  // prefer itinerary-level date if provided, else first sector
  const d = first.value?.departureDate || first.value?.sectors?.[0]?.departureDate
  return d ? d : ''
})
const origin = computed(() => ({
  code: first.value?.departureCityCode ?? first.value?.sectors?.[0]?.departureCityCode ?? '',
  name: first.value?.departureCityName ?? first.value?.sectors?.[0]?.departureCityName ?? ''
}))
const destination = computed(() => ({
  code: first.value?.arrivalCityCode ?? first.value?.sectors?.slice(-1)?.[0]?.arrivalCityCode ?? '',
  name: first.value?.arrivalCityName ?? first.value?.sectors?.slice(-1)?.[0]?.arrivalCityName ?? ''
}))

const departureOrArrival = ref<'departure' | 'arrival'>('departure')

// ---------- Sidebar data (derived from props.data) ----------
type OptionItem = { id: string; name: string; price: number }
const alliances = ref<OptionItem[]>([]) // unknown in new shape; keep empty unless you add it server-side

const airlines = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of props.data ?? []) {
    const codes = row.airlineCode ?? []
    const names = row.airlineName ?? []
    codes.forEach((code, idx) => {
      const name = names[idx] ?? code
      const current = map.get(code)
      const price = row.price
      if (!current || price < current.min) map.set(code, { name, min: price })
    })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

const depAirports = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of props.data ?? []) {
    const id = row.departureAirportCode
    const name = row.departureAirportName || id
    const price = row.price
    const cur = map.get(id)
    if (!cur || price < cur.min) map.set(id, { name, min: price })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

const arrAirports = computed<OptionItem[]>(() => {
  const map = new Map<string, { name: string; min: number }>()
  for (const row of props.data ?? []) {
    const id = row.arrivalAirportCode
    const name = row.arrivalAirportName || id
    const price = row.price
    const cur = map.get(id)
    if (!cur || price < cur.min) map.set(id, { name, min: price })
  }
  return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, price: v.min }))
})

// Stops pricing (min price for direct vs one-stop+)
const stopsPricing = computed(() => {
  let directMin = Infinity
  let oneStopMin = Infinity
  for (const row of props.data ?? []) {
    const stops = Math.max(0, (row.sectors?.length ?? 1) - 1)
    if (stops === 0) directMin = Math.min(directMin, row.price)
    else oneStopMin = Math.min(oneStopMin, row.price)
  }
  return {
    direct: Number.isFinite(directMin) ? directMin : 0,
    oneStop: Number.isFinite(oneStopMin) ? oneStopMin : 0
  }
})

// ---------- Router / handlers ----------
const router = useRouter()
function onPurchase(payload: any) {
  console.log('purchase', payload)
  router.push('/booking')
}
const handleSelect = (payload: any) => {
  console.log('HandleSelect:', payload)
}

// ---------- Filters (from sidebar) ----------
const filters = reactive<{
  studentOnly: boolean
  stops: { direct: boolean; oneStop: boolean }
  alliances: string[]
  airlines: string[]
  depAirports: string[]
  arrAirports: string[]
  departTime: [number, number]
  arriveTime: [number, number]
}>({
  studentOnly: false,
  stops: { direct: false, oneStop: false },
  alliances: [],
  airlines: [],
  depAirports: [],
  arrAirports: [],
  departTime: [0, 1439],
  arriveTime: [0, 1439]
})

function onFiltersChange(v: any) { Object.assign(filters, v) }

// ---------- Sort ----------
const sort = reactive<{ key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration', dir: 'asc' | 'desc' }>({
  key: 'direct', dir: 'asc'
})
function setSort(key: typeof sort.key, dir: typeof sort.dir) { sort.key = key; sort.dir = dir }
function toggleSort(key: typeof sort.key) {
  if (sort.key !== key) { sort.key = key; sort.dir = 'asc'; return }
  sort.dir = sort.dir === 'asc' ? 'desc' : 'asc'
}

// ---------- Tax toggle & price display ----------
const taxMode = ref<'in' | 'ex'>('in')
function displayPrice(row: CardRow) {
  //含稅 = price + taxAmount?  If your API already returns "price" as tax-included, adjust here.
  //Below assumes price is base and taxAmount is taxes/fees.
  const total = row.price + (row.taxAmount ?? 0)
  return taxMode.value === 'in' ? total : row.price
}

// ---------- Derived, filtered & sorted list ----------
const filteredFlights = computed(() => {
  let arr = (props.data ?? []).slice()

  // stops filter
  const wantDirect = filters.stops.direct
  const wantOne = filters.stops.oneStop
  if (wantDirect && !wantOne) arr = arr.filter(f => Math.max(0, (f.sectors?.length ?? 1) - 1) === 0)
  if (wantOne && !wantDirect) arr = arr.filter(f => Math.max(0, (f.sectors?.length ?? 1) - 1) >= 1)

  // airline filter
  if (filters.airlines?.length) {
    const set = new Set(filters.airlines)
    arr = arr.filter(f => (f.airlineCode ?? []).some(c => set.has(c)))
  }

  // airports filter
  if (filters.depAirports?.length) {
    const set = new Set(filters.depAirports)
    arr = arr.filter(f => set.has(f.departureAirportCode))
  }
  if (filters.arrAirports?.length) {
    const set = new Set(filters.arrAirports)
    arr = arr.filter(f => set.has(f.arrivalAirportCode))
  }

  // time windows — use itinerary header time (departureTime / arrivalTime) in "HH:mm"
  const depWin = filters.departTime || [0, 1439]
  const arrWin = filters.arriveTime || [0, 1439]
  arr = arr.filter(f =>
    inWindow(timeToMin(f.departureTime), depWin) &&
    inWindow(timeToMin(f.arrivalTime), arrWin)
  )

  // sort
  arr.sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'direct') {
      const sa = Math.max(0, (a.sectors?.length ?? 1) - 1)
      const sb = Math.max(0, (b.sectors?.length ?? 1) - 1)
      if (sa !== sb) return (sa - sb)
      return ( (a.price + (a.taxAmount ?? 0)) - (b.price + (b.taxAmount ?? 0)) ) * dir
    }
    if (sort.key === 'price') {
      const pa = (a.price + (a.taxAmount ?? 0))
      const pb = (b.price + (b.taxAmount ?? 0))
      return (pa - pb) * dir
    }
    if (sort.key === 'depTime') return (timeToMin(a.departureTime) - timeToMin(b.departureTime)) * dir
    if (sort.key === 'arrTime') return (timeToMin(a.arrivalTime) - timeToMin(b.arrivalTime)) * dir
    if (sort.key === 'duration') return (a.durationMinutes - b.durationMinutes) * dir
    return 0
  })

  return arr
})

const totalCount = computed(() => filteredFlights.value.length)

// "Infinite" show more
const showCount = ref(5)
const shownFlights = computed(() => filteredFlights.value.slice(0, showCount.value))
const canLoadMore = computed(() => showCount.value < filteredFlights.value.length)

// fake infinite loader when scrolling near bottom
const onScroll = () => {
  if (!canLoadMore.value) return
  const pad = 240
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - pad
  if (nearBottom) {
    window.removeEventListener('scroll', onScroll)
    setTimeout(() => {
      showCount.value = Math.min(showCount.value + 5, filteredFlights.value.length)
      window.addEventListener('scroll', onScroll)
    }, 0)
  }
}

const apply = (on: boolean) => document.body.classList.toggle('result-bg', !!on)

onMounted(() => {
  apply(true)
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  apply(false)
  window.removeEventListener('scroll', onScroll)
})
</script>
<style>
.v-enter-from, .v-leave-to {
  height: 0; /* Start with no height */
  opacity: 0;
}

.v-enter-to, .v-leave-from {
  height: auto; /* End with natural height */
  opacity: 1;
}
.v-enter-active,
.v-leave-active,
.v-move {
  transition: all 0.4s ease;
  display: block;
}
.v-leave-active { position: absolute; }
</style>