<template>
  <Teleport to="body">
    <transition name="fade-scale">
      <div
        v-if="open"
        class="fixed inset-0 z-[120] bg-black/40 md:hidden overflow-hidden"
        @click.self="emit('close')"
      >
        <div class="flex flex-col h-full w-full bg-white overflow-hidden shadow-2xl">
          <!-- Header -->
          <div class="bg-primary-gold text-white px-4 py-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0">
            <span class="tracking-wide">訂單詳情</span>
            <button
              class="text-white hover:opacity-80 transition"
              @click="emit('close')"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            <!-- Flight Info -->
            <div class="mb-6">
              <h3 class="text-others-gray1 font-semibold mb-3">航班資料</h3>

              <!-- Match the same card style used by mobile passenger list in TicketBookingCard -->
              <div class="border border-others-gray8 rounded-[10px] overflow-hidden bg-white">
                <div
                  v-for="(f, idx) in flights"
                  :key="idx"
                  class="px-4 py-4"
                  :class="{ 'border-b border-others-gray8': idx < flights.length - 1 }"
                >
                  <!-- Top row: depart -> arrive -->
                  <div class="flex items-start justify-between gap-3 text-[12px]">
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-others-gray1">{{ formatDateTime(f.departTime) }}</div>
                      <div class="text-others-gray1">{{ f.departAirport }}</div>
                    </div>

                    <div class="pt-1 text-others-gray5"><img src="@/assets/imgs/arrow-right.svg" /></div>

                    <div class="flex-1 min-w-0 text-right">
                      <div class="font-semibold text-others-gray1">{{ formatDateTime(f.arriveTime) }}</div>
                      <div class="text-others-gray1">{{ f.arriveAirport }}</div>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="mt-3 text-others-gray1 text-[12px] space-y-1">
                    <div>
                      航空公司：
                      <span class="font-semibold">
                        {{ [f.airlineName, compactFlightNo(f.flight), formatCabinLabel(f.cabin)].filter(Boolean).join(' ') }}
                      </span>
                    </div>
                    <div>
                      狀態：<span class="font-semibold">{{ f.status || '處理中' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-t border-others-gray8 px-4 py-3 text-[12px] text-others-original leading-relaxed">
                  以上班機起飛和抵達時間皆為當地時間，以24小時制呈現，例如：03:00為凌晨3點
                </div>
              </div>
            </div>

            <!-- Passenger Info -->
            <div>
              <h3 class="text-others-gray1 font-semibold mb-3">旅客資料</h3>

              <div class="space-y-4">
                <div
                  v-for="(it, idx) in items"
                  :key="idx"
                  class="border border-others-gray8 rounded-[10px] overflow-hidden bg-white"
                >
                  <!-- Card header -->
                  <div class="bg-primary-gold text-white px-4 py-3 flex items-center gap-3">
                    <div class="flex items-center justify-center w-5 h-5 bg-white/20 rounded-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-[13px] truncate">{{ formatPassengerName(it.name) }}</div>
                    </div>
                    <div class="text-[12px] whitespace-nowrap">
                      出發：{{ departureDate }}
                    </div>
                  </div>

                  <!-- Card body -->
                  <div class="px-4 py-4 text-[12px] text-others-gray1 space-y-3">

                    <div class="flex items-start justify-between gap-4">
                      <div class="space-y-1">
                        <div>{{ it.productName }}</div>
                      </div>
                      <div class="space-y-1 ">
                        <div>未付： <span class="font-semibold tabular-nums text-others-original">{{ formatPrice(unpaid(it)) }}</span></div>
                        <div>已付： <span class="font-semibold tabular-nums">{{ formatPrice(it.paid) }}</span></div>
                    </div>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                      <div class="text-others-original font-semibold">
                        付款期限：{{ formatDeadline(it.deadline) }}
                      </div>
                      <div class="text-others-original font-semibold whitespace-nowrap">
                        未付： <span class="font-bold tabular-nums">{{ formatPrice(unpaid(it)) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-baseline justify-end gap-2">
                <span class="text-primary-gold font-semibold text-[12px]">應付總額</span>
                <span class="text-others-original font-bold text-[12px]">TWD</span>
                <span class="text-others-original font-bold text-[22px] tabular-nums">{{ formatPrice(total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPrice } from '@/utils'

type Flight = {
  departTime: string
  departAirport: string
  arriveTime: string
  arriveAirport: string
  flight: string
  cabin: string
  status: string
  airlineName?: string
}

type Item = {
  checked: boolean
  name: string
  productName: string
  totalWithTax: number
  tax: number
  paid: number
  deadline: string
}

const props = defineProps<{
  open: boolean
  flights: Flight[]
  items: Item[]
  total: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const departureDate = computed(() => {
  const raw = props.flights?.[0]?.departTime || ''
  const date = raw.split(' ')[0] || ''
  return date ? date.replace(/-/g, '/') : ''
})

function formatDateTime(raw: string): string {
  if (!raw) return ''
  // Expect "YYYY-MM-DD HH:mm"
  const [date, time] = raw.split(' ')
  if (!date) return raw
  return `${date.replace(/-/g, '/')}${time ? ` ${time}` : ''}`
}

function compactFlightNo(raw: string): string {
  return (raw || '').replace(/\s+/g, '')
}

function formatCabinLabel(cabinCode: string): string {
  const cabinMap: Record<string, string> = {
    Y: '經濟艙',
    C: '商務艙',
    F: '頭等艙',
    W: '豪華經濟艙'
  }
  if (!cabinCode) return '經濟艙'
  return cabinMap[cabinCode] || cabinCode
}

function formatPassengerName(name: string): string {
  return (name || '').replace(/,?\s*(MR\.|MRS\.)$/i, '').trim()
}

function unpaid(it: Item): number {
  return Math.max((it?.totalWithTax || 0) - (it?.paid || 0), 0)
}

function formatDeadline(deadline: string): string {
  if (!deadline) return ''
  if (deadline.includes('T')) {
    const [date, time] = deadline.split('T')
    const [y, m, d] = date.split('-')
    const [hh, mm] = (time || '').split(':')
    return `${y}/${parseInt(m)}/${parseInt(d)} ${hh}:${mm}`
  }
  return deadline
}
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>


