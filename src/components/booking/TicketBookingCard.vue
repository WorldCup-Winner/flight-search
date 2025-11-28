<template>
  <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
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
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatPrice } from "@/utils";
import { useBookingStore } from "@/stores/booking";

const bookingStore = useBookingStore();

const orderNumber = computed(() => {
    return bookingStore.bookingResult?.bookingData?.orderNumber || null
});

type Flight = {
  departTime: string;
  departAirport: string;
  arriveTime: string;
  arriveAirport: string;
  flight: string;
  cabin: string;
  status: string;
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
    if (!bookingStore.bookingResult?.itineraries || bookingStore.bookingResult.itineraries.length === 0) {
        // Fallback: Use outbound and return segments from booking store
        const segments = []
        if (bookingStore.outboundSegment) {
            segments.push(...bookingStore.outboundSegment.sectors.map((sector: any) => ({
                departTime: `${sector.departureDate} ${sector.departureTime}`,
                departAirport: sector.departureAirportCode,
                arriveTime: `${sector.arrivalDate} ${sector.arrivalTime}`,
                arriveAirport: sector.arrivalAirportCode,
                flight: `${sector.marketingAirlineCode} ${sector.flightNo}`,
                cabin: sector.bookingClass || 'Y',
                status: "處理中",
            })))
        }
        if (bookingStore.returnSegment) {
            segments.push(...bookingStore.returnSegment.sectors.map((sector: any) => ({
                departTime: `${sector.departureDate} ${sector.departureTime}`,
                departAirport: sector.departureAirportCode,
                arriveTime: `${sector.arrivalDate} ${sector.arrivalTime}`,
                arriveAirport: sector.arrivalAirportCode,
                flight: `${sector.marketingAirlineCode} ${sector.flightNo}`,
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
            cabin: sector.bookingClass,
            status: "處理中",
        }))
    );
});

const items = computed<Item[]>(() => {
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
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
