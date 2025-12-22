<template>
  <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full hidden md:block">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-primary-gold">機票商品資料</h2>
      <p v-if="orderNumber" href="#" class="text-others-original font-semibold whitespace-nowrap">
        <span class="text-others-gray7">訂單編號</span>&nbsp;&nbsp;{{ orderNumber }}
      </p>
    </div>

    <!-- Flight table -->
    <section class="rounded-xl text-center overflow-hidden border-none">
      <table class="w-full text-sm">
        <thead class="bg-primary-gold text-white">
          <tr>
            <th class="px-4 py-3 font-medium">班機起飛</th>
            <th class="px-4 py-3 font-medium">班機抵達</th>
            <th class="px-4 py-3 font-medium">航班</th>
            <th class="px-4 py-3 font-medium">狀態</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="(f, i) in flights" :key="i" class="bg-white border-2 border-t-none">
            <td class="px-4 py-3 align-top">
              <div class="font-medium text-others-gray1">{{ f.departTime }}</div>
              <div class="text-others-gray1">{{ f.departAirport }}</div>
            </td>
            <td class="px-4 py-3 align-top">
              <div class="font-medium text-others-gray1">{{ f.arriveTime }}</div>
              <div class="text-others-gray1">{{ f.arriveAirport }}</div>
            </td>
            <td class="px-4 py-3 align-top">
              <div class="font-medium text-others-gray1">{{ f.flight }}</div>
              <div class="text-others-gray1">{{ f.cabin }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="text-others-gray1">{{ f.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="p-4 text-xs text-others-original border-2 rounded-[10px] rounded-t-none">
        以上班機起飛和抵達時間皆為當地時間，以24小時制呈現，例如：03:00為凌晨3點
      </div>
    </section>

    <!-- Items table -->
    <section class="mt-6 border-none rounded-xl text-center overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-primary-gold text-white">
          <tr>
            <th class="px-4 py-3 font-medium whitespace-nowrap w-[5%]">
            </th>
            <th class="px-4 py-3 font-medium">旅客姓名</th>
            <th class="px-4 py-3 font-medium">商品名稱</th>
            <th class="px-4 py-3 font-medium whitespace-nowrap w-[14%]">商品金額</th>
            <th class="px-4 py-3 font-medium whitespace-nowrap w-[10%]">已付金額</th>
            <th class="px-4 py-3 font-medium whitespace-nowrap w-[10%]">未付金額</th>
            <th class="px-4 py-3 font-medium whitespace-nowrap w-[16%]">付款期限</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="(it, i) in items" :key="i" class="bg-white border-2">
            <td class="py-3 border-t-2 border-b-2 relative">
                <label class="absolute flex text-sm text-slate-600 select-none w-fit top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2">
                    <label class="flex items-center cursor-pointer relative">
                        <input type="checkbox" checked disabled
                            class="mt-[1px] peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md checked:bg-primary-gold disabled:bg-primary-gold/30"
                            id="check" v-model="it.checked" />
                        <span
                            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" stroke-width="1">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                        </span>
                    </label>
                </label>
            </td>
            <td class="px-4 py-3 border-t-2 border-b-2">
                <span class="font-medium text-others-gray1">{{ it.name }}</span>
            </td>
            <td class="px-4 py-3 text-others-gray1 border-t-2 border-b-2">
              {{ it.productName }}
            </td>
            <td class="px-4 py-3 text-center text-others-gray1 border-t-2 border-b-2">
              <div>含稅金</div>
              <div class="tabular-nums font-bold">{{ formatPrice(it.totalWithTax) }}</div>
              <div class="tabular-nums text-sm text-others-gray5">稅金: {{ formatPrice(it.tax) }}</div>
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-others-gray1 border-t-2 border-b-2">
              {{ formatPrice(it.paid) }}
            </td>
            <td class="px-4 py-3 text-center text-others-gray1 font-bold border-t-2 border-b-2">
              {{ formatPrice(Math.max(it.totalWithTax - it.paid, 0)) }}
            </td>
            <td class="px-4 py-3 text-center text-others-original whitespace-nowrap border-t-2 border-b-2">
              {{ it.deadline }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 flex items-baseline justify-end gap-2 border-2 border-t-0 rounded-[10px] rounded-t-none">
        <span class="text-primary-gold font-bold">應付總額</span>
        <span class="text-others-original font-bold text-[12px]">TWD</span>
        <span class="text-[22px] tabular-nums text-others-original font-bold">
          {{ formatPrice(total) }}
        </span>
      </div>
    </section>
  </div>

  <!-- Mobile Version -->
  <div class="md:hidden bg-white mt-20 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.2)] mx-6 px-4 pt-6 pb-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-primary-gold text-lg">機票商品資料</h2>
      <button
        class="text-primary-gold text-md font-bold flex items-center gap-2"
        @click="isDetailModalOpen = true"
      >
        查看詳情<font-awesome-icon icon="chevron-right" class="text-sm" />
      </button>
    </div>

    <!-- Order Number -->
    <div class="mb-4">
      <p class="text-others-gray7 text-sm">
        訂單編號 <span class="text-others-original font-semibold">{{ orderNumber || 'ORD0026597365' }}</span>
      </p>
    </div>

    <!-- Flight Segments (Using BookingHeaderStrip) -->
    <div class="space-y-4 mb-6">
      <div v-for="(flight, index) in groupedFlights" :key="index">
        <BookingHeaderStrip
          :current-leg="index === 0 ? 'outbound' : 'return'"
          :segment-title="index === 0 ? '去程' : '回程'"
          :date-text="getFlightDate(flight)"
          :origin="getFlightOrigin(flight)"
          :destination="getFlightDestination(flight)"
          :no-margin="index > 0"
          :show-detailed-info="true"
          :departure-time="getFlightDepartureTime(flight)"
          :cabin="getCabinLabel(flight[0]?.cabin || 'Y')"
        />
      </div>
    </div>

    <!-- Passenger Details Card -->
    <div class="mb-4 border border-others-gray8 rounded-[10px] overflow-hidden">
      <div v-for="(item, index) in items" :key="index" class="first:rounded-t-[10px] last:rounded-b-[10px] border-others-gray8" :class="{ 'border-b': index < items.length - 1 }">
        <div class="px-4 py-4">
          <!-- Route/Airline info - full width -->
          <div class="text-others-gray1 text-sm mb-2">{{ item.productName }}</div>
          <!-- Passenger name (left) and payment info (right) on same row -->
          <div class="flex items-center justify-between text-sm">
            <div class="text-black font-semibold">{{ formatPassengerName(item.name) }}</div>
            <div class="text-others-original">
              未付 <span class="font-bold">NTD {{ formatPrice(item.totalWithTax - item.paid) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Amount and Payment Deadline -->
    <div class="flex flex-col items-end gap-2">
      <div class="flex items-baseline ">
        <span class="text-primary-gold text-sm mr-2">應付總額 </span>
        <span class="text-others-original font-bold text-[14px] mr-0.5">TWD</span>
        <span class="text-others-original font-bold text-[26px]">{{ formatPrice(total) }}</span>
      </div>
      <div class="border border-others-original rounded-md px-3 py-1.5">
        <p class="text-others-original text-sm font-semibold">
          請於 {{ getPaymentDeadline() }} 前完成付款
        </p>
      </div>
    </div>
  </div>

  <!-- Mobile: Full-screen order detail modal -->
  <TicketBookingDetailModal
    :open="isDetailModalOpen"
    :flights="flights"
    :items="items"
    :total="total"
    @close="isDetailModalOpen = false"
  />
</template>

<script setup lang="ts">
import { computed, ref} from "vue";
import { formatPrice } from "@/utils";
import { useBookingStore } from "@/stores/booking";
import BookingHeaderStrip from "./BookingHeaderStrip.vue";
import TicketBookingDetailModal from "./TicketBookingDetailModal.vue";

const bookingStore = useBookingStore();
const isDetailModalOpen = ref(false)

const orderNumber = computed(() => {
    return bookingStore.bookingResult?.bookingData?.orderNumber || null
});

type Flight = {
  departTime: string;
  departAirport: string;
  departureAirportCode: string;
  arriveTime: string;
  arriveAirport: string;
  arrivalAirportCode: string;
  flight: string;
  cabin: string;
  status: string;
  airlineName?: string;
};

type Item = {
  checked: boolean;
  name: string;
  productName: string;
  totalWithTax: number; // 含稅總價 (price field from API)
  tax: number;          // 稅金 (taxAmount field from API)
  paid: number;
  deadline: string;
};

const flights = computed<Flight[]>(() => {
    // 優先使用 FP02 API 的 fly_list 資料
    const orderData = bookingStore.bookingResult?.bookingData
    if (orderData?.fly_list && orderData.fly_list.length > 0) {
        return orderData.fly_list.map((fly: any) => ({
            departTime: `${fly.FPD05A || ''} ${fly.FPD05B || ''}`.trim(),
            departAirport: fly.FPD07S || fly.FPD07 || '', // FPD07S
            departureAirportCode: fly.FPD07 || '', // FPD07 is the depart airport code
            arriveTime: `${fly.FPD06A || ''} ${fly.FPD06B || ''}`.trim(),
            arriveAirport: fly.FPD08S || fly.FPD08 || '', // FPD08S
            arrivalAirportCode: fly.FPD08 || '', // FPD08 is the arrival airport code
            flight: fly.FPD03S || fly.FPD04 || '',        // FPD03S
            cabin: fly.FPD09 || fly.FPD11S || fly.FPD11 || '-', // FPD09
            status: fly.FPD15S || '處理中',
        }))
    }
    
    if (!bookingStore.bookingResult?.itineraries || bookingStore.bookingResult.itineraries.length === 0) {
        // Fallback: Use outbound and return segments from booking store
        const segments = []
        if (bookingStore.outboundSegment) {
            segments.push(...bookingStore.outboundSegment.sectors.map((sector: any) => ({
                departTime: `${sector.departureDate} ${sector.departureTime}`,
                departAirport: sector.departureAirportCode,
                departureAirportCode: sector.departureAirportCode || '',
                arriveTime: `${sector.arrivalDate} ${sector.arrivalTime}`,
                arriveAirport: sector.arrivalAirportCode,
                arrivalAirportCode: sector.arrivalAirportCode || '',
                flight: `${sector.marketingAirlineCode} ${sector.flightNo}`,
                airlineName: sector.marketingAirlineName || sector.operatingAirlineName || '',
                cabin: sector.bookingClass || 'Y',
                status: "處理中",
            })))
        }
        if (bookingStore.returnSegment) {
            segments.push(...bookingStore.returnSegment.sectors.map((sector: any) => ({
                departTime: `${sector.departureDate} ${sector.departureTime}`,
                departAirport: sector.departureAirportCode,
                departureAirportCode: sector.departureAirportCode || '',
                arriveTime: `${sector.arrivalDate} ${sector.arrivalTime}`,
                arriveAirport: sector.arrivalAirportCode,
                arrivalAirportCode: sector.arrivalAirportCode || '',
                flight: `${sector.marketingAirlineCode} ${sector.flightNo}`,
                airlineName: sector.marketingAirlineName || sector.operatingAirlineName || '',
                cabin: sector.bookingClass || 'Y',
                status: "處理中",
            })))
        }
        return segments
    }
    
    return bookingStore.bookingResult.itineraries.flatMap(itinerary => 
        itinerary.sectors.map((sector: any) => ({
            departTime: `${sector.departureDate} ${sector.departureTime}`,
            departAirport: sector.departureAirportCode,
            arriveTime: `${sector.arrivalDate} ${sector.arrivalTime}`,
            arriveAirport: sector.arrivalAirportCode,
            flight: `${sector.marketingAirlineCode} ${sector.flightNo}`,
            airlineName: sector.marketingAirlineName || sector.operatingAirlineName || '',
            cabin: sector.bookingClass,
            status: "處理中",
        }))
    );
});


const items = computed<Item[]>(() => {
    // 優先使用 FP02 API 的 cust_list 資料
    const orderData = bookingStore.bookingResult?.bookingData
    if (orderData?.cust_list && orderData.cust_list.length > 0) {
        return orderData.cust_list.map((cust: any) => {
            const fare = parseInt(cust.FPC52) || 0
            const paid = parseInt(cust.FPC53) || 0
            return {
                checked: true,
                name: cust.FPC05 || '-',
                productName: cust.FPC51 || '-',           // FPC51 商品名稱
                totalWithTax: fare,                       // FPC52 商品金額（含稅）
                tax: 0,                                   // FP02 沒有單獨的稅額欄位
                paid: paid,
                deadline: formatDateTime(orderData.FPA55) || '2025/12/31 23:59', // FPA55 付款期限
            }
        })
    }
    
    if (!bookingStore.bookingResult?.passengers || bookingStore.bookingResult.passengers.length === 0) {
        // Fallback: Create items from fare rule data
        const fareData = bookingStore.fareRuleData
        const searchParams = bookingStore.searchParams
        
        if (!fareData || !searchParams) return []
        
        const items: Item[] = []
        let itemIndex = 0
        
        // Create items for each passenger type
        fareData.fareSummary.forEach((summary: any) => {
            const passengerType = summary.passengerType
            const count = passengerType === 'ADT' ? searchParams.adults :
                         passengerType === 'CNN' ? searchParams.children :
                         passengerType === 'INF' ? searchParams.infants : 0
            
            for (let i = 0; i < count; i++) {
                const passengerLabel = passengerType === 'ADT' ? '成人' :
                                     passengerType === 'CNN' ? '兒童' : '嬰兒'
                
                items.push({
                    checked: true,
                    name: `乘客 ${itemIndex + 1} (${passengerLabel})`,
                    productName: `${searchParams.departureCityCode}/${searchParams.arrivalCityCode}`,
                    totalWithTax: summary.price,     // price 已經是含稅總價
                    tax: summary.taxAmount,          // 稅金部分
                    paid: 0,
                    deadline: "2025/12/31 23:59",
                })
                itemIndex++
            }
        })
        
        return items
    }
    
    return bookingStore.bookingResult.passengers.map((passenger, index) => {
        const detail = bookingStore.bookingResult?.bookingData?.details?.[index]
        const itinerary = bookingStore.bookingResult?.itineraries?.[0]
        
        return {
            checked: true,
            name: `${passenger.lastName} ${passenger.firstName}, ${passenger.gender === 0 ? 'MR.' : 'MRS.'}`,
            productName: itinerary 
                ? `${itinerary.departureAirportCode}/${itinerary.arrivalAirportCode}`
                : `${bookingStore.searchParams?.departureCityCode || ''}/${bookingStore.searchParams?.arrivalCityCode || ''}`,
            totalWithTax: detail?.amountWithTax || 0,  // 含稅總價
            tax: detail?.tax || 0,                     // 稅金
            paid: 0,
            deadline: detail?.paymentDeadline?.split('T')[0] || "2025/12/31",
        }
    });
});

const total = computed(() =>
  items.value
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.totalWithTax - i.paid, 0)
);



// Mobile version helpers - using existing flights data
const groupedFlights = computed(() => {
  // Group flights by outbound/return (assuming first half is outbound, second half is return)
  const flightList = flights.value
  if (flightList.length === 0) return []
  
  // For round trip, split flights into outbound and return
  // For one way, only outbound
  const midPoint = Math.ceil(flightList.length / 2)
  const outbound = flightList.slice(0, midPoint)
  const returnFlights = flightList.slice(midPoint)
  
  const result = [outbound]
  if (returnFlights.length > 0) {
    result.push(returnFlights)
  }
  return result
})

function getFlightDate(flightGroup: Flight[]): string {
  if (flightGroup.length === 0) return ''
  // Extract date from departTime (format: "YYYY-MM-DD HH:mm")
  const dateTime = flightGroup[0].departTime
  if (!dateTime) return ''
  return dateTime.split(' ')[0] // Return just the date part
}

function getFlightDepartureTime(flightGroup: Flight[]): string {
  if (flightGroup.length === 0) return ''
  // Extract time from departTime (format: "YYYY-MM-DD HH:mm")
  const dateTime = flightGroup[0].departTime
  if (!dateTime) return ''
  return dateTime.split(' ')[1] || '' // Return just the time part
}

function getFlightOrigin(flightGroup: Flight[]): { name: string; code: string } {
  if (flightGroup.length === 0) return { name: '出發地', code: '' }
  // Use airport code as name for now (can be enhanced with airport name lookup if needed)
  return { name: flightGroup[0].departAirport, code: flightGroup[0].departureAirportCode }
}

function getFlightDestination(flightGroup: Flight[]): { name: string; code: string } {
  if (flightGroup.length === 0) return { name: '目的地', code: '' }
  const lastFlight = flightGroup[flightGroup.length - 1]
  // Use airport code as name for now (can be enhanced with airport name lookup if needed)
  return { name: lastFlight.arriveAirport, code: lastFlight.arrivalAirportCode }
}

function getCabinLabel(cabinCode: string): string {
  const cabinMap: Record<string, string> = {
    'Y': '經濟艙',
    'C': '商務艙',
    'F': '頭等艙',
    'W': '豪華經濟艙'
  }
  return cabinMap[cabinCode] || '經濟艙'
}

function formatPassengerName(name: string): string {
  // Remove ", MR." or ", MRS." suffix if present
  return name.replace(/,?\s*(MR\.|MRS\.)$/i, '').trim()
}

function getPaymentDeadline(): string {
  // Get deadline from first item or use default
  if (items.value.length > 0 && items.value[0].deadline) {
    const deadline = items.value[0].deadline
    // Format: "2025/8/31 14:20" or "2025-08-31T14:20:00"
    if (deadline.includes('T')) {
      const [date, time] = deadline.split('T')
      const [year, month, day] = date.split('-')
      const [hour, minute] = time.split(':')
      return `${year}/${parseInt(month)}/${parseInt(day)} ${hour}:${minute}`
    }
    return deadline
  }
  return '2025/8/31 14:20'
}

// Helper function to format FPA55 datetime (format: YYYYMMDDHHMM)
function formatDateTime(dateTime: string): string {
  if (!dateTime || dateTime.length !== 12) return ''
  
  const year = dateTime.substring(0, 4)
  const month = dateTime.substring(4, 6)
  const day = dateTime.substring(6, 8)
  const hour = dateTime.substring(8, 10)
  const minute = dateTime.substring(10, 12)
  
  return `${year}/${parseInt(month)}/${parseInt(day)} ${hour}:${minute}`
}
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
