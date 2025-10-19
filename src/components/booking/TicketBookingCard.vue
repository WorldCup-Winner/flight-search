<template>
  <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-primary-gold">機票商品資料</h2>
      <p href="#" class="text-others-original font-semibold whitespace-nowrap"><span class="text-others-gray7">訂單編號</span>&nbsp;&nbsp;{{ bookingResponse.orderNumber }}</p>
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
          <!-- <tr v-for="(f, i) in flights" :key="i" class="bg-white border-2 border-t-none">
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
          </tr> -->
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
              <div class="tabular-nums font-bold">{{ formatPrice(it.fare) }}</div>
              <div class="tabular-nums">{{ formatPrice(it.tax) }}</div>
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-others-gray1 border-t-2 border-b-2">
              {{ formatPrice(it.paid) }}
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-others-gray1 font-bold border-t-2 border-b-2">
              {{ formatPrice(Math.max(it.fare + it.tax - it.paid, 0)) }}
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
import { reactive, computed, ref } from "vue";
import { formatPrice } from "@/utils";
import type { Sector, Flight, Item } from '@/utils/types'

const props = defineProps({
  bookingResponse: { type: Object, default: null },
  bookingData: { type: Object, default: null}
})

function convertSectorsToFlights(sectorGroups: Sector[][]): Flight[] {
  const flights: Flight[] = [];

  for (const sectorGroup of sectorGroups) {
    for (const sector of sectorGroup) {
      const flight: Flight = {
        departTime: sector.departureTime,
        departAirport: `${sector.departureAirportName} (${sector.departureAirportCode})`,
        arriveTime: sector.arrivalTime,
        arriveAirport: `${sector.arrivalAirportName} (${sector.arrivalAirportCode})`,
        flight: `${sector.marketingAirlineCode}${sector.flightNo}`,
        cabin: sector.cabinDesc + sector.bookingClass,
        status: '處理中' // Or dynamically from another source
      };

      flights.push(flight);
    }
  }

  return flights;
}

const flights: Flight[] = convertSectorsToFlights(props.bookingData.sectors)

const items = reactive<Item[]>([
  {
    checked: true,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3485, // adjust to match your real data
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
  {
    checked: true,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3316,
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
  {
    checked: true,
    name: "LEE WEIEN - -, MR.",
    productName: "SL/台北/東京/台北/泰國獅子航空 - TPE/NRT NRT/TPE",
    fare: 5278,
    tax: 3316,
    paid: 0,
    deadline: "2025/8/31 14:20",
  },
]);

const total = computed(() =>
  items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.fare + i.tax - i.paid, 0)
);
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
