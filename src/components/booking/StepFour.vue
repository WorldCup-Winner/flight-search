<template>
    <div class="max-w-6xl w-full">
        <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="text-others-gray1 text-[26px]">訂單查詢</h2>
            <div class="bg-white mt-6 rounded-[10px] border-[2px] px-8 py-4 w-full">
                <h2 class="font-semibold text-primary-gold">訂單狀況</h2>
                <div class="space-x-4 mt-4">
                    <span v-if="orderData?.FPA50 === '10'" class="text-green-600 text-[22px] font-bold">付款完成</span>
                    <span v-else-if="orderData?.FPA50 === '5'" class="text-text-error text-[22px] font-bold">{{ orderData?.FPA50S || '訂單成立' }}</span>
                    <span v-else-if="paymentType === 'A1' || paymentType === 'A5'" class="text-others-original text-[22px] font-bold">
                        <span class="inline-flex items-center">
                            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            等待付款中
                        </span>
                    </span>
                    <span v-else class="text-others-gray1 text-[22px] font-bold">{{ orderData?.FPA50S || '處理中' }}</span>
                    <span v-if="orderData?.FPA50 === '10'" class="text-others-gray7">感謝您的訂購，客服人員將為您開票，並於開票完成後寄送電子機票email給您。</span>
                    <span v-else-if="orderData?.FPA50 === '5' && paymentType === 'B1'" class="text-others-gray7">為保留機位及票價，請於付款期限內完成付款，逾期訂單將自動取消並釋出機位。</span>
                    <span v-else-if="paymentType === 'A1' || paymentType === 'A5'" class="text-others-gray7">
                        正在確認付款狀態，系統每 30 秒自動更新一次。如已完成付款，請稍候片刻，訂單狀態將自動更新。
                    </span>
                    <span v-else-if="paymentType === 'A4'" class="text-others-gray7">付款已處理，正在確認訂單狀態...</span>
                </div>
                <div class="space-x-4 mt-2">
                    <span class="text-others-gray7">應付金額</span>
                    <span class="text-others-gray7 text-[18px] font-bold">{{ formatPrice(total) }}</span>
                </div>
                <div class="space-x-4 mt-2">
                    <span class="text-others-gray7">訂單編號</span>
                    <span class="text-others-gray7 text-[18px] font-bold">{{ orderData?.FPA01 }}</span>
                </div>
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
                                <span class="text-text-error font-semibold">{{ formateDateYYYYMMDDHHMM(pay.PEP06) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="font-semibold text-primary-gold mb-4">航班資料</h2>
            <section class="border-none rounded-xl text-center overflow-hidden">
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
                            <div class="font-medium text-others-gray1">{{ f.departureTime }}</div>
                            <div class="text-others-gray1">{{ f.departureAirportName }}</div>
                            </td>
                            <td class="px-4 py-3 align-top">
                            <div class="font-medium text-others-gray1">{{ f.arrivalTime }}</div>
                            <div class="text-others-gray1">{{ f.arrivalAirportName }}</div>
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
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="font-semibold text-primary-gold mb-4">旅客資料</h2>
            <section class="mt-6 border-none rounded-xl text-center overflow-hidden">
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
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="font-semibold text-primary-gold mb-4">主要聯絡人</h2>
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 font-medium col-span-4 text-center">
                    <p>聯絡人姓名</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-4 text-center">
                    <p>聯絡手機</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-4 text-center">
                    <p>聯絡email</p>
                </div>
            </div>
            <div v-for="(contact, i) in contacts" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-4 text-center">
                        <p>{{ contact.name }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-4 text-center">
                        <p>{{ contact.number }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-4 text-center">
                        <p>{{ contact.mail }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white mt-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="font-semibold text-primary-gold mb-4">代收轉付收據</h2>
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 font-medium col-span-3 text-center">
                    <p>是否開立抬頭或統編</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center">
                    <p>公司名稱</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center">
                    <p>統一編號</p>
                </div>
                <div class="px-4 py-3 font-medium col-span-3 text-center">
                    <p>收據內容摘要</p>
                </div>
            </div>
            <div v-for="(receipt, i) in receipts" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-3 text-center">
                        <p>{{ receipt.type }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center">
                        <p>{{ receipt.name }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center">
                        <p>{{ receipt.number }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-3 text-center">
                        <p>{{ receipt.summary }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
            <h2 class="font-semibold text-primary-gold mb-4">特殊協力事項</h2>
            
            <div class="grid grid-cols-12 w-full items-center bg-primary-gold text-white rounded-t-[10px]">
                <div class="px-4 py-3 col-span-3 text-center">
                    <p>是否有特殊需求</p>
                </div>
                <div class="px-4 py-3 col-span-9 text-center">
                    <p>需求內容</p>
                </div>
            </div>
            <div v-for="(cooper, i) in specialCooperations" :key="i">
                <div class="grid grid-cols-12 w-full items-center text-others-gray1 border-2 border-t-0" :class="[i <= contacts.length - 1 ? 'rounded-b-[10px]' : '']">
                    <div class="px-4 py-3 col-span-3 text-center">
                        <p>{{ cooper.type }}</p>
                    </div>
                    <div class="px-4 py-3 col-span-9 text-center">
                        <p>{{ cooper.detail }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { onUnmounted } from 'vue'
import { LiyiFP02 } from "@/api";
import { formateDateYYYYMMDDHHMM, formatPrice } from "@/utils";
import type { Contact, Flight, Item, Receipt, SpecialCooperation } from "@/utils/types";

const flights = reactive<Flight[]>([])
const items = reactive<Item[]>([])
const orderData = ref<any>(null)
const paymentInfo = ref<any[]>([])
const paymentType = ref<string>('')
const contacts = reactive<Contact[]>([])
const receipts = reactive<Receipt[]>([])
const specialCooperations = reactive<SpecialCooperation[]>([])

const passengerInfoAllChecked = ref(true)

const total = computed(() =>
  items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.fare - i.paid, 0)
);

let pollingTimer: number | null = null

onMounted(async () => {
  const orderBasicInfoStr = localStorage.getItem('ORDER_BASIC_INFO')
  let orderBasicInfo: any = null
  
  if (orderBasicInfoStr) {
    try {
      orderBasicInfo = JSON.parse(orderBasicInfoStr)
      paymentType.value = orderBasicInfo.pep04
      console.log('Loaded order basic info:', orderBasicInfo)
    } catch (error) {
      console.error('Failed to parse order basic info:', error)
    }
  }
  
  if (paymentType.value === 'B1') {
    const orderDataStr = localStorage.getItem('ORDER_DATA')
    if (orderDataStr) {
      try {
        orderData.value = JSON.parse(orderDataStr)
        console.log('Loaded B1 order data with payment:', orderData.value)
        processOrderData()
      } catch (error) {
        console.error('Failed to parse order data:', error)
      }
    }
  } else if (paymentType.value === 'A1' || paymentType.value === 'A5') {
    if (orderBasicInfo) {
      console.log(`Starting polling for ${paymentType.value} payment`)
      await pollOrderStatus(orderBasicInfo.orderNumber, orderBasicInfo.orderUniqId)
    }
  } else if (paymentType.value === 'A4') {
    if (orderBasicInfo) {
      console.log('A4 payment completed, fetching order status')
      await fetchOrderStatus(orderBasicInfo.orderNumber, orderBasicInfo.orderUniqId)
    }
  }
  
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
})

const pollOrderStatus = async (orderNumber: string, orderUniqId: string) => {
  
  const checkStatus = async () => {
    try {
      console.log('Polling order status...')
      const response = await LiyiFP02({
        PAR01: orderNumber,
        PAR02: orderUniqId,
        PAR03: '',
        from_ip: '',
        from_url: window.location.href
    })
      
      if (response.data?.status == 1) {
        orderData.value = response.data
        processOrderData()
        
        if (response.data.FPA50 === '10') {
          console.log('Payment completed!')
          if (pollingTimer) {
            clearInterval(pollingTimer)
            pollingTimer = null
          }
        }
      }
    } catch (error) {
      console.error('Failed to poll order status:', error)
    }
  }
  
  await checkStatus()
  
  pollingTimer = window.setInterval(checkStatus, 30000)
}

const fetchOrderStatus = async (orderNumber: string, orderUniqId: string) => {  
  try {
    console.log('Fetching order status...')
      const response = await LiyiFP02({
        PAR01: orderNumber,
        PAR02: orderUniqId,
        PAR03: '',
        from_ip: '',
        from_url: window.location.href
    })
    
    if (response.data?.status == 1) {
      orderData.value = response.data
      processOrderData()
    }
  } catch (error) {
    console.error('Failed to fetch order status:', error)
  }
}

onUnmounted(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
})

const processOrderData = () => {
  if (!orderData.value) return
  
  flights.length = 0
  if (orderData.value.fly_list) {
    orderData.value.fly_list.forEach((fly: any) => {
      flights.push({
        departureTime: `${fly.FPD05A || ''} ${fly.FPD05B || ''}`.trim(),
        departureAirportCode: fly.FPD07 || '',
        departureAirportName: fly.FPD07S || '',
        arrivalTime: `${fly.FPD06A || ''} ${fly.FPD06B || ''}`.trim(),
        arrivalAirportCode: fly.FPD08 || '',
        arrivalAirportName: fly.FPD08S || '',
        flight: fly.FPD04 || '',
        cabin: fly.FPD11S || fly.FPD11 || '',
        status: fly.FPD15S || '處理中'
      })
    })
  }
  
  items.length = 0
  if (orderData.value.cust_list) {
    orderData.value.cust_list.forEach((cust: any) => {
      items.push({
        checked: true,
        name: cust.FPC05 || '-',
        productName: cust.FPC51 || '-',
        fare: parseInt(cust.FPC52) || 0,
        tax: 0,
        paid: parseInt(cust.FPC53) || 0,
        deadline: formateDateYYYYMMDDHHMM(orderData.value.FPA55) || '2025/12/31 23:59'
      })
    })
  }
  
  contacts.length = 0
  if (orderData.value.FPA05S) {
    contacts.push({
      name: orderData.value.FPA05S,
      number: orderData.value.FPA08 || orderData.value.FPA09 || '-',
      mail: orderData.value.FPA10 || '-'
    })
  }
  
  receipts.length = 0
  receipts.push({
    type: orderData.value.FPA31 === 'Y' ? '是' : '否',
    name: orderData.value.FPA33 || '-',
    number: orderData.value.FPA32 || '-',
    summary: orderData.value.FPA34 === 'A' ? '列出航班資訊' : '僅開立「機票款」三個字'
  })
  
  specialCooperations.length = 0
  if (orderData.value.FPA41) {
    specialCooperations.push({
      type: '是',
      detail: orderData.value.FPA41
    })
  } else {
    specialCooperations.push({
      type: '否',
      detail: '-'
    })
  }
  
  if (orderData.value.pay_list && orderData.value.pay_list.length > 0) {
    paymentInfo.value = orderData.value.pay_list
    console.log('Payment info loaded:', paymentInfo.value)
  }
}
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>