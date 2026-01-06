<template>
  <main class="w-full mt-[100px] flex flex-col items-center justify-center">
    <div class="max-w-6xl w-full mx-auto bg-divider-bg md:bg-transparent px-4 md:px-0 py-4 md:py-0">
        <div class="bg-white my-0 md:my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <h2 class="text-others-gray1 text-base md:text-[26px]">訂單查詢</h2>
            <div class="bg-white mt-6 rounded-[10px] border-[2px] px-4 md:px-8 py-4 w-full">
                <h2 class="font-semibold text-base md:text-[22px] text-primary-gold">訂單狀況</h2>
                <!-- Status row (mobile: stacked, desktop: inline) -->
                <div class="mt-4 flex flex-col md:flex-row md:items-start md:gap-4">
                    <!-- Status text -->
                    <div class="flex items-center gap-3">
                        <span v-if="orderData?.FPA50 === '10'" class="text-green-600 text-sm md:text-[22px] font-bold">{{ orderData?.FPA50S || '付款完成' }}</span>
                        <span v-else-if="orderData?.FPA50 === '5'" class="text-text-error text-sm md:text-[22px] font-bold">{{ orderData?.FPA50S || '訂單成立' }}</span>
                        <span v-else class="text-others-gray1 text-sm md:text-[22px] font-bold">{{ orderData?.FPA50S || '處理中' }}</span>
                    </div>
                    <!-- Description (mobile goes to next line) -->
                    <div class="mt-2 md:mt-0 text-others-gray7 text-xs md:text-base leading-relaxed md:flex-1">
                        <span v-html="orderData?.FPA50D || ''"></span>
                    </div>
                </div>
                <div class="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="space-y-2">
                        <div class="space-x-4">
                            <span class="text-others-gray7 text-sm md:text-base">應付金額</span>
                            <span class="text-others-gray7 text-base md:text-[18px] font-bold tabular-nums">{{ formatPrice(total) }}</span>
                        </div>
                        <div class="space-x-4">
                            <span class="text-others-gray7 text-sm md:text-base">訂單編號</span>
                            <span class="text-others-gray7 text-base md:text-[18px] font-bold tabular-nums">{{ orderData?.FPA01 }}</span>
                        </div>
                    </div>
                    <div v-if="orderData?.FPA53 === 'Y'">
                        <button
                            @click="showPaymentDialog = true"
                            class="w-full md:w-[200px] h-[50px] md:h-[60px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                            >
                            立即付款
                        </button>
                    </div>
                </div>
                <!-- 虛擬匯款資訊顯示區域 - 只有 B1 付款方式才顯示 -->
                <div v-if="paymentType === 'B1' && paymentInfo && paymentInfo.length > 0" class="mt-6 pt-6 border-t-2">
                    <h3 class="font-semibold text-primary-gold mb-4">匯款資訊</h3>
                    <div v-for="(pay, idx) in paymentInfo" :key="idx" class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-others-gray7">付款方式：</span>
                                <span class="text-others-gray1 font-semibold">{{ pay.PEP04S }}</span>
                            </div>
                            <div>
                                <span class="text-others-gray7">付款狀態：</span>
                                <span class="font-semibold" :class="pay.PEP11 === 'A' ? 'text-text-error' : 'text-green-600'">
                                    {{ pay.PEP11S }}
                                </span>
                            </div>
                            <div>
                                <span class="text-others-gray7">銀行：</span>
                                <span class="text-others-gray1 font-semibold">{{ pay.KEY11S }}</span>
                            </div>
                            <div>
                                <span class="text-others-gray7">匯款帳號：</span>
                                <span class="text-others-original font-bold text-lg">{{ pay.KEY12 }}</span>
                            </div>
                            <div>
                                <span class="text-others-gray7">應付金額：</span>
                                <span class="text-others-gray1 font-semibold">{{ formatPrice(parseInt(pay.PEP05) || 0) }}</span>
                            </div>
                            <div>
                                <span class="text-others-gray7">付款期限：</span>
                                <span class="text-text-error font-semibold">{{ formatDateTime(pay.PEP06) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 航班資料: mobile card + desktop table -->
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">航班資料</h2>

            <!-- Mobile: card layout -->
            <div class="md:hidden border border-others-gray8 rounded-[10px] overflow-hidden bg-white">
                <div
                    v-for="(f, i) in flights"
                    :key="i"
                    class="px-4 py-4"
                    :class="{ 'border-b border-others-gray8': i < flights.length - 1 }"
                >
                    <div class="flex items-start justify-between gap-3 text-[12px]">
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-others-gray1">{{ f.departTime }}</div>
                            <div class="text-others-gray1">{{ f.departAirport }}</div>
                        </div>
                        <div class="pt-1 text-others-gray5">
                            <img src="@/assets/imgs/arrow-right.svg" class="w-4 h-4" alt="to" />
                        </div>
                        <div class="flex-1 min-w-0 text-right">
                            <div class="font-semibold text-others-gray1">{{ f.arriveTime }}</div>
                            <div class="text-others-gray1">{{ f.arriveAirport }}</div>
                        </div>
                    </div>

                    <div class="mt-3 text-others-gray1 text-[12px] space-y-1">
                        <div>
                            航空公司：
                            <span class="font-semibold">{{ f.flight }} {{ f.cabin }}</span>
                        </div>
                        <div>
                            狀態：<span class="font-semibold">{{ f.status }}</span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-others-gray8 px-4 py-3 text-xs text-others-original leading-relaxed">
                    以上班機起飛和抵達時間皆為當地時間，以24小時制呈現，例如：03:00為凌晨3點
                </div>
            </div>

            <!-- Desktop: Flight table -->
            <section class="hidden md:block border-none rounded-xl text-center overflow-hidden">
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
        </div>
        <!-- 旅客資料: mobile cards + desktop table -->
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold mb-4">旅客資料</h2>

            <!-- Mobile: cards -->
            <div class="md:hidden space-y-4">
                <div
                    v-for="(it, i) in items"
                    :key="i"
                    class="bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] border border-others-gray8 overflow-hidden"
                >
                    <div class="bg-primary-gold text-white px-4 py-3 flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2 min-w-0">
                            <div class="flex items-center justify-center w-5 h-5 bg-white/20 rounded-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="font-semibold text-[13px] truncate">{{ it.name }}</div>
                        </div>
                        <div class="text-[12px] whitespace-nowrap">
                            出發：{{ flights?.[0]?.departTime?.split(' ')?.[0] || '' }}
                        </div>
                    </div>

                    <div class="px-4 py-4 text-[12px] text-others-gray1 space-y-3">
                        <div class="flex items-start justify-between gap-4">
                            <div class="space-y-1 flex-1 min-w-0">
                                <div class="break-words">{{ it.productName }}</div>
                            </div>
                            <div class="space-y-1 text-right">
                                <div>未付： <span class="font-semibold tabular-nums text-others-original">{{ formatPrice(Math.max(it.fare - it.paid, 0)) }}</span></div>
                                <div>已付： <span class="font-semibold tabular-nums">{{ formatPrice(it.paid) }}</span></div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-3">
                            <div class="text-others-original font-semibold text-[11px]">
                                付款期限：{{ it.deadline }}
                            </div>
                            <div class="text-others-original font-semibold whitespace-nowrap text-[11px]">
                                未付： <span class="font-bold tabular-nums">{{ formatPrice(Math.max(it.fare - it.paid, 0)) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-baseline justify-end gap-2">
                    <span class="text-primary-gold font-semibold text-[12px]">應付總額</span>
                    <span class="text-others-original font-bold text-[12px]">TWD</span>
                    <span class="text-others-original font-bold text-[22px] tabular-nums">{{ formatPrice(total) }}</span>
                </div>
            </div>

            <!-- Desktop: Items table -->
            <section class="hidden md:block mt-6 border-none rounded-xl text-center overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-primary-gold text-white">
                        <tr>
                            <th class="px-4 py-3 font-medium whitespace-nowrap relative">
                                <label class="absolute flex text-sm text-slate-600 select-none w-fit top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <label class="flex items-center cursor-pointer relative">
                                        <input type="checkbox" checked disabled
                                            class="mt-[1px] peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-white"
                                            id="check" v-model="passengerInfoAllChecked" />
                                        <span
                                            class="absolute text-primary-gold opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                                            stroke="currentColor" stroke-width="1">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                            </svg>
                                        </span>
                                    </label>
                                </label>
                            </th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">旅客姓名</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">商品名稱</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">商品金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">已付金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">未付金額</th>
                            <th class="px-4 py-3 font-medium whitespace-nowrap">付款期限</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                    <tr v-for="(it, i) in items" :key="i" class="bg-white border-2">
                        <td class="py-3 border-t-2 border-b-2 relative">
                            <label class="absolute flex text-sm text-slate-600 select-none w-fit top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
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
                            {{ formatPrice(Math.max(it.fare - it.paid, 0)) }}
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
        <!-- Remaining sections keep desktop markup but become responsive via padding -->
        <div class="bg-white text-xs md:text-base mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold text-base mb-4">主要聯絡人</h2>
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 font-medium col-span-4 text-center min-w-0">
                    <p>聯絡人姓名</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-4 text-center min-w-0">
                    <p>聯絡手機</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-4 text-center min-w-0">
                    <p>聯絡email</p>
                </div>
            </div>
            <div v-for="(contact, i) in contacts" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-4 text-center min-w-0">
                        <p class="break-words">{{ contact.name }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-4 text-center min-w-0">
                        <p class="break-words">{{ contact.number }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-4 text-center min-w-0">
                        <p class="break-all">{{ contact.mail }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white text-xs md:text-base mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold text-base mb-4">代收轉付收據</h2>
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 font-medium col-span-3 text-center min-w-0">
                    <p>是否開立抬頭或統編</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center min-w-0">
                    <p>公司名稱</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center min-w-0">
                    <p>統一編號</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center min-w-0">
                    <p>收據內容摘要</p>
                </div>
            </div>
            <div v-for="(receipt, i) in receipts" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-3 text-center min-w-0">
                        <p class="break-words">{{ receipt.type }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center min-w-0">
                        <p class="break-words">{{ receipt.name }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center min-w-0">
                        <p class="break-all">{{ receipt.number }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center min-w-0">
                        <p class="break-words">{{ receipt.summary }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white text-xs md:text-base my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 w-full">
            <!-- Header -->
            <h2 class="font-semibold text-primary-gold text-base mb-4">特殊協力事項</h2>
            
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 col-span-3 text-center min-w-0">
                    <p>是否有特殊需求</p>
                </div>
                <div class="px-4 py-3 col-span-9 text-center min-w-0">
                    <p>需求內容</p>
                </div>
            </div>
            <div v-for="(cooper, i) in specialCooperations" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-3 text-center min-w-0">
                        <p class="break-words">{{ cooper.type }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-9 text-center min-w-0">
                        <p class="break-words">{{ cooper.detail }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 付款對話框 -->
    <div v-if="showPaymentDialog" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         @click.self="showPaymentDialog = false">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <!-- 關閉按鈕 -->
        <button
          @click="showPaymentDialog = false"
          class="absolute top-4 right-4 text-others-gray7 hover:text-others-gray1 text-2xl font-bold z-10"
          aria-label="關閉">
          ×
        </button>
        
        <!-- PaymentMethodCard 組件 -->
        <PaymentMethodCard
          :orderNumber="orderNumber"
          :orderUniqId="orderUniqId"
          :totalAmount="total"
          @payment-completed="handlePaymentCompleted"
          @close="showPaymentDialog = false" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from "vue";
import { formatPrice, formatFPA55, getPaymentDeadline30MinutesFromNow } from "@/utils";
import PaymentMethodCard from "@/components/booking/PaymentMethodCard.vue";
import { useRouter, useRoute } from "vue-router";

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
  fare: number; // tax-included amount (total price)
  tax: number;  // tax portion (for reference only, already included in fare)
  paid: number;
  deadline: string;
};

type Contact = {
    name: string;
    number: string;
    mail: string;
}

type Receipt = {
    type: string;
    name: string;
    number: string;
    summary: string;
}

type SpecialCooperation = {
    type: string;
    detail: string;
}

// 從 router state 取得訂單資料
const router = useRouter()
const route = useRoute()
const orderData = ref<any>(null)
const orderNumber = ref<string>('')
const orderUniqId = ref<string>('')
const paymentInfo = ref<any[]>([])
const paymentType = ref<string>('')

// 付款對話框狀態
const showPaymentDialog = ref(false)

// 載入訂單資料的函數
const loadOrderData = () => {
  // 取得從 BookingSearch 傳來的訂單資料
  const state = history.state as any
  
  if (state && state.orderData) {
    orderData.value = state.orderData
    
    // 多層 fallback 取得 orderNumber 和 orderUniqId
    // 1. 優先從 state 取得（直接從 FP04 傳來的值）
    // 2. 從 orderData (FP02 response) 取得
    // 3. 從 sessionStorage 的 orderBasicInfo 取得（PayInfo 場景）
    let foundOrderNumber = state.orderNumber || state.orderData.FPA01 || ''
    let foundOrderUniqId = state.uniqId || state.orderData.FPA02 || ''
    
    // 如果還是沒有，嘗試從 sessionStorage 取得（處理 PayInfo 場景）
    if (!foundOrderNumber || !foundOrderUniqId) {
      console.log('Trying to get order info from sessionStorage...')
      const cachedBasicInfo = sessionStorage.getItem('orderBasicInfo')
      if (cachedBasicInfo) {
        try {
          const basicInfo = JSON.parse(cachedBasicInfo)
          if (!foundOrderNumber) foundOrderNumber = basicInfo.orderNumber || ''
          if (!foundOrderUniqId) foundOrderUniqId = basicInfo.orderUniqId || ''
          console.log('Supplemented from sessionStorage:', { orderNumber: foundOrderNumber, orderUniqId: foundOrderUniqId })
        } catch (e) {
          console.warn('Failed to parse orderBasicInfo from sessionStorage', e)
        }
      }
    }
    
    orderNumber.value = foundOrderNumber
    orderUniqId.value = foundOrderUniqId
    
    console.log('Order data loaded:', {
      orderNumber: orderNumber.value,
      orderUniqId: orderUniqId.value,
      source: state.orderNumber ? 'state' : (state.orderData.FPA01 ? 'orderData' : 'sessionStorage')
    })
    
    processOrderData()
  } else {
    // 備用：從 sessionStorage 取得
    console.warn('No order data in router state, trying sessionStorage...')
    const cachedBasicInfo = sessionStorage.getItem('orderQueryBasicInfo')
    
    if (cachedBasicInfo) {
      const basicInfo = JSON.parse(cachedBasicInfo)
      orderNumber.value = basicInfo.orderNumber
      orderUniqId.value = basicInfo.uniqId
      
      console.log('Loaded from sessionStorage:', { orderNumber: orderNumber.value, orderUniqId: orderUniqId.value })
      // 如果需要，可以重新呼叫 FP02 API
      alert('正在重新載入訂單資料...')
      // TODO: 實作重新呼叫 FP02 的邏輯
    } else {
      console.error('No order data found')
      alert('訂單資料遺失，請重新查詢')
    }
  }
}

// 首次載入
onMounted(() => {
  loadOrderData()
})

// 監聽路由變化（處理同一路由重新查詢的情況）
watch(
  () => route.query.t,
  (newTime, oldTime) => {
    // 當查詢參數改變時（重新查詢訂單），重新載入資料
    if (newTime && newTime !== oldTime) {
      console.log('Route query changed, reloading order data...')
      loadOrderData()
    }
  }
)

// 處理訂單資料，轉換成畫面需要的格式
const flights = reactive<Flight[]>([])
const items = reactive<Item[]>([])
const contacts = reactive<Contact[]>([])
const receipts = reactive<Receipt[]>([])
const specialCooperations = reactive<SpecialCooperation[]>([])

const processOrderData = () => {
  if (!orderData.value) return
  
  // 處理航班資料 - FP02 的 fly_list 在根層級
  flights.length = 0
  if (orderData.value.fly_list) {
    orderData.value.fly_list.forEach((fly: any) => {
      flights.push({
        departTime: `${fly.FPD05A || ''} ${fly.FPD05B || ''}`.trim(),
        departAirport: fly.FPD07S || fly.FPD07 || '',
        arriveTime: `${fly.FPD06A || ''} ${fly.FPD06B || ''}`.trim(),
        arriveAirport: fly.FPD08S || fly.FPD08 || '',
        flight: fly.FPD04 || '',
        cabin: fly.FPD11S || fly.FPD11 || '-',
        status: fly.FPD10S || '處理中'
      })
    })
  }
  
  // 處理旅客/商品資料 - FP02 的 cust_list 在根層級
  items.length = 0
  if (orderData.value.cust_list) {
    orderData.value.cust_list.forEach((cust: any) => {
      items.push({
        checked: true,
        name: cust.FPC05 || '-',
        productName: cust.FPC51 || '-',
        fare: parseInt(cust.FPC52) || 0,
        tax: 0, // FP02 沒有單獨的稅額欄位
        paid: parseInt(cust.FPC53) || 0,
        deadline: formatFPA55(orderData.value.FPA55) || getPaymentDeadline30MinutesFromNow()
      })
    })
  }
  
  // 處理聯絡人資料
  contacts.length = 0
  if (orderData.value.FPA05S) {
    contacts.push({
      name: orderData.value.FPA05S,
      number: orderData.value.FPA08 || orderData.value.FPA09 || '-',
      mail: orderData.value.FPA10 || '-'
    })
  }
  
  // 處理收據資訊
  receipts.length = 0
  receipts.push({
    type: orderData.value.FPA31 === 'Y' ? '是' : '否',
    name: orderData.value.FPA33 || '-',
    number: orderData.value.FPA32 || '-',
    summary: orderData.value.FPA34 === 'A' ? '列出航班資訊' : '僅開立「機票款」三個字'
  })
  
  // 處理特殊協力事項（如果有的話）
  specialCooperations.length = 0
  if (orderData.value.FPA30) {
    specialCooperations.push({
      type: '是',
      detail: orderData.value.FPA30
    })
  } else {
    specialCooperations.push({
      type: '否',
      detail: '-'
    })
  }
  
  // 處理付款資訊 - 當 FPA50=5 且 pay_list 有資料時
  if (orderData.value.FPA50 === '5' && orderData.value.pay_list && orderData.value.pay_list.length > 0) {
    paymentInfo.value = orderData.value.pay_list
    // 從第一筆付款資料取得付款類型（PEP04）
    if (paymentInfo.value.length > 0 && paymentInfo.value[0].PEP04) {
      paymentType.value = paymentInfo.value[0].PEP04
      console.log('Payment type:', paymentType.value)
    }
    console.log('Payment info loaded:', paymentInfo.value)
  }
}

// 格式化日期時間
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '/')
  } catch {
    return dateStr
  }
}

const passengerInfoAllChecked = ref(true)

const total = computed(() =>
  items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.fare - i.paid, 0)
);

// 處理付款按鈕點擊
const handlePaymentClick = () => {
  // 檢查是否有必要的資料
  if (!orderData.value) {
    console.error('orderData is null or undefined')
    alert('訂單資料遺失，請重新查詢訂單')
    return
  }
  
  if (!orderNumber.value) {
    console.error('orderNumber is missing')
    alert('訂單號碼遺失，請重新查詢訂單')
    return
  }
  
  if (!orderUniqId.value) {
    console.error('orderUniqId is missing')
    alert('訂單識別碼遺失，請重新查詢訂單')
    return
  }
  
  // 在打開付款對話框前，先將訂單資訊存入 sessionStorage
  // 這樣在付款完成後的回調流程中就能使用
  sessionStorage.setItem('orderBasicInfo', JSON.stringify({
    orderNumber: orderNumber.value,
    orderUniqId: orderUniqId.value
  }))
  
  console.log('Stored order info for payment:', {
    orderNumber: orderNumber.value,
    orderUniqId: orderUniqId.value
  })
  
  showPaymentDialog.value = true
}

// 處理付款完成
const handlePaymentCompleted = async () => {
  // 關閉對話框
  showPaymentDialog.value = false
  
  // 重新載入訂單資料
  if (orderData.value?.FPA01 && orderData.value?.FPA02) {
    try {
      // 這裡可以呼叫 FP02 API 重新取得訂單資料
      // 暫時先重新整理頁面，或顯示成功訊息
      alert('付款處理中，請稍後查詢訂單狀態')
      
      // 可選：導向訂單查詢頁面或重新載入當前頁面
      // 未來可以使用 router.push({ name: 'booking-search' }) 導向
      console.log('Router available for future redirect:', router)
    } catch (error) {
      console.error('Failed to refresh order data:', error)
    }
  }
}

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>
<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>