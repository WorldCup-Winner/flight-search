<template>
  <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.2)] md:drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-4 md:px-10 py-4 md:py-8 mx-6 md:mx-0 md:w-full">
      <!-- A4 IFRAME 付款顯示區域 -->
      <div v-if="showIframePayment" class="w-full">
          <h2 class="font-semibold text-primary-gold mb-4">線上刷卡付款</h2>
          <div class="w-full border-2 border-others-gray8 rounded-lg overflow-hidden">
              <iframe 
                  :src="iframeUrl"
                  class="w-full h-[600px] border-none"
                  @load="handleIframeLoad">
              </iframe>
          </div>
          <div class="mt-4 text-center text-others-gray7 text-sm">
              <p>請在上方視窗完成付款，完成後系統將自動跳轉到訂單確認頁面</p>
              <p class="mt-2">
                  如未自動跳轉, 請
                  <span 
                      class="text-others-original cursor-pointer hover:text-others-hover underline"
                      @click="handleManualJumpToStep4">
                      點此連結手動跳轉
                  </span>
              </p>
          </div>
      </div>
      
      <!-- 一般付款方式選擇區域 -->
      <div v-else>
      <h2 class="font-semibold text-primary-gold mb-4 md:mb-0">付款方式</h2>
      <div class="grid grid-cols-12 py-4 md:py-6 gap-4 md:gap-12">
        <!-- 左側：付款方式選擇 (群組一: DET03) -->
        <!-- Mobile: horizontal layout -->
        <div class="col-span-12 md:hidden flex flex-row gap-3">
            <button 
                v-for="group in paymentGroups" 
                :key="group.code" 
                @click="selectedGroup = group.code"
                class="flex-1 py-4 rounded-md transition-colors"
                :class="selectedGroup === group.code ? 'text-white bg-primary-gold' : 'bg-primary-gold1 text-others-gray1'">
                {{ group.name }}
            </button>
        </div>
        <!-- Desktop: vertical layout (original with space-y-4) -->
        <div class="hidden md:block md:col-span-3 w-full space-y-4">
            <button 
                v-for="group in paymentGroups" 
                :key="group.code" 
                @click="selectedGroup = group.code"
                class="w-full py-4 rounded-md transition-colors"
                :class="selectedGroup === group.code ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1'">
                {{ group.name }}
            </button>
        </div>
        <!-- 右側：付款選項詳細設定 -->
        <div class="col-span-12 md:col-span-9 w-full space-y-6">
            <!-- 信用卡付款 (DET03 = 'A') -->
            <div v-if="selectedGroup === 'A'">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">信用卡選擇與付款設定</h2>

                    <!-- 信用卡類型選擇 (DET04) -->
                    <div v-if="selectedGroupOptions.length > 0" class="mt-5">
                        <h3 class="text-sm font-medium text-others-gray1 mb-3">選擇信用卡類型</h3>
                        <div class="flex gap-2 md:gap-3 flex-wrap">
                            <label
                                v-for="option in selectedGroupOptions"
                                :key="option.DET04"
                                class="relative inline-block">
                                <input
                                    :id="`card-${option.DET04}`"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType"
                                    :value="option.DET04"
                                    v-model="selectedOption"
                                />
                                <span
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-others-gray1 transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    {{ option.DET04S }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- 分期期數選擇 (DET06) -->
                    <div v-if="installmentOptions.length > 0" class="mt-5">
                        <h3 class="text-sm font-medium text-others-gray1 mb-3">分期方式</h3>
                        <div class="flex gap-2 md:gap-3 flex-wrap">
                            <label
                                v-for="installment in installmentOptions"
                                :key="installment.periods"
                                class="relative inline-block">
                                <input
                                    :id="`installment-${installment.periods}`"
                                    class="peer sr-only"
                                    type="radio"
                                    name="installmentPeriods"
                                    :value="installment.periods"
                                    v-model="selectedInstallment"
                                />
                                <span
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-others-gray1 transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    {{ installment.periods === 1 ? '一次付清' : `${installment.periods}期` }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- 分期金額資訊 -->
                    <div v-if="selectedInstallment > 1 && currentInstallment" class="mt-5 p-4 bg-others-gray4 rounded-lg">
                        <div class="flex justify-between items-center text-sm">
                            <div>總金額：<span class="font-bold text-primary-gold">{{ formatPrice(currentInstallment.totalAmount) }} TWD</span></div>
                            <div>每期金額：<span class="font-bold text-others-original">{{ formatPrice(currentInstallment.perPeriodAmount) }} TWD</span></div>
                        </div>
                    </div>
                </div>

                <!-- 付款注意事項 (DET04D) -->
                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">{{ selectedInstallment === 1 ? '付款注意事項' : '分期付款說明' }}</h2>
                    <div class="mt-4 text-others-gray1 text-sm space-y-3 md:space-y-2 [&>*]:mb-3 md:[&>*]:mb-2 [&>*:last-child]:mb-0" v-html="currentOptionNote"></div>
                </div>
            </div>

            <!-- LINE Pay 付款 (DET03 = 'L') -->
            <div v-if="selectedGroup === 'L'">

                <!-- LINE Pay 選項 -->
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-4 md:p-6">
                    <h2 class="font-bold text-primary-gold hidden md:block">LINE Pay 付款方式</h2>

                    <!-- LINE Pay 選項 (DET04) -->
                    <div class="bg-white border-others-gray8">
                      <h2 class="font-bold text-primary-gold mb-4 md:hidden">付款設定</h2>
                      <div v-if="selectedGroupOptions.length > 0" class="mt-0 md:mt-5">
                          <div class="flex gap-3 flex-wrap">
                              <label
                                  v-for="option in selectedGroupOptions"
                                  :key="option.DET04"
                                  class="relative inline-block">
                                  <input
                                      :id="`linepay-${option.DET04}`"
                                      class="peer sr-only"
                                      type="radio"
                                      name="linepayType"
                                      :value="option.DET04"
                                      v-model="selectedOption"
                                  />
                                  <span
                                      class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                              bg-divider-soft text-others-gray1 transition-color duration-200
                                              before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                              peer-checked:before:bg-others-original peer-checked:before:border-none">
                                      {{ option.DET04S }}
                                  </span>
                              </label>
                          </div>
                      </div>
                    </div>
                </div>

                <!-- Payment Instructions Card -->
                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-4 md:p-6">
                    <h2 class="font-bold text-primary-gold">LINE Pay 付款說明</h2>
                    <div class="mt-4 text-others-gray1 text-sm space-y-3 md:space-y-2 [&>*]:mb-3 md:[&>*]:mb-2 [&>*:last-child]:mb-0" v-html="currentOptionNote"></div>
                </div>
            </div>

            <!-- 匯款付款 (DET03 = 'B') -->
            <div v-if="selectedGroup === 'B'">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-4 md:p-6">
                    <h2 class="font-bold text-primary-gold">銀行匯款資訊</h2>

                    <!-- 匯款選項 (DET04) -->
                    <div v-if="selectedGroupOptions.length > 0" class="mt-4 md:mt-5">
                        <div class="flex gap-3 flex-wrap">
                            <label
                                v-for="option in selectedGroupOptions"
                                :key="option.DET04"
                                class="relative inline-block">
                                <input
                                    :id="`transfer-${option.DET04}`"
                                    class="peer sr-only"
                                    type="radio"
                                    name="transferType"
                                    :value="option.DET04"
                                    v-model="selectedOption"
                                />
                                <span
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-others-gray1 transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    {{ option.DET04S }}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 匯款說明 (DET04D) -->
                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-4 md:p-6">
                    <h2 class="font-bold text-primary-gold">匯款注意事項</h2>
                    <div class="mt-4 text-others-gray1 text-sm space-y-3 md:space-y-2 [&>*]:mb-3 md:[&>*]:mb-2 [&>*:last-child]:mb-0" v-html="currentOptionNote"></div>
                </div>
            </div>

            <!-- 下一步按鈕 -->
            <div class="flex justify-center mt-6 md:mt-8">
                <button
                    @click="handleNextStep"
                    :disabled="!selectedOption || isProcessing"
                    class="px-8 py-3 w-full md:w-[60%] h-[50px] md:h-[60px] rounded-md font-semibold transition-colors relative"
                    :class="selectedOption && !isProcessing ? 'bg-others-original text-white hover:bg-others-hover' : 'bg-others-gray4 text-others-gray1 cursor-not-allowed'">
                    <span v-if="isProcessing" class="inline-flex items-center">
                        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        處理中...
                    </span>
                    <span v-else>{{ buttonLabel }}</span>
                </button>
            </div>
        </div>
      </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getSupportedPaymentTypes, viewOrder } from '@/api'
import { useBookingStore } from '@/stores/booking'

// Props for when used from order query page
const props = defineProps<{
  orderNumber?: string
  orderUniqId?: string
  totalAmount?: number
}>()

// Step navigation now handled by router (no longer using emit('update:step'))
import { useRouter } from 'vue-router'
const router = useRouter()

// Emits
const emit = defineEmits<{
  (e: 'payment-completed'): void
  (e: 'close'): void
}>()
interface PaymentMethod {
  DET01: string;        // 付款方式代碼
  DET02: string;        // 排序 (API 回傳字串)
  DET03: string;        // 群組一代號 (A=信用卡, B=匯款, L=LINE Pay)
  DET03S: string;       // 群組一頁籤名稱
  DET04: string;        // 群組二代號 (信用卡類型等)
  DET04S: string;       // 群組二選項名稱
  DET04D: string;       // 群組二備註
  DET05?: string;       // 付款方式說明（選填）
  DET06: number;        // 分期期數
  DET07: number;        // 總金額
  DET08: number;        // 每期金額
  DET09?: string;       // 付款類型代碼（選填）
  DET09S?: string;      // 付款類型說明（選填）
}

// Interface for grouped payment options
interface PaymentGroup {
  code: string;   // DET03 code
  name: string;   // DET03S name
  options: PaymentMethod[];
}

const bookingStore = useBookingStore()

// Reactive state
const allPaymentMethods = ref<PaymentMethod[]>([])
const selectedGroup = ref<string>('A') // Default to 信用卡
const selectedOption = ref<string>('')  // DET04 code
const selectedInstallment = ref<number>(1) // DET06 periods

// Loading state
const isProcessing = ref<boolean>(false)

// A4 IFRAME 付款相關
const showIframePayment = ref<boolean>(false)
const iframeUrl = ref<string>('')
const iframeKey = ref<string>('')

// 處理 iframe 載入和跳轉偵測
const handleIframeLoad = () => {
  // 嘗試偵測 iframe 是否跳轉回到 galilee 網址
  try {
    const iframe = document.querySelector('iframe')
    if (iframe && iframe.contentWindow) {
      const iframeLocation = iframe.contentWindow.location.href
      
      // 檢查是否跳轉回到 galilee 網址（表示付款完成）
      if (iframeLocation.includes("galilee")) {
        console.log('Payment completed, redirecting to Step 4')
        
        // 如果在對話框中，發送完成事件
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          // 取得訂單資訊
          const orderBasicInfo = sessionStorage.getItem('orderBasicInfo')
          if (orderBasicInfo) {
            // 導向 Step 4
            router.push({ name: 'booking-step-4' })
          }
        }
      }
    }
  } catch (error) {
    // 跨域限制會導致錯誤，這是正常的
    // 可以使用 message 事件來監聽
    console.log('Iframe cross-origin check (expected)')
  }
}

// 監聽來自 iframe 的 message 事件（用於 A4 付款完成通知）
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    // 驗證來源（根據實際銀行網址調整）
    if (event.data && event.data.paymentCompleted) {
      console.log('Payment completed message received')
      // 如果在對話框中，發送完成事件
      if (props.orderNumber) {
        emit('payment-completed')
      } else {
        router.push({ name: 'booking-step-4' })
      }
    }
  })
}

// Group payment methods by DET03 (群組一)
const paymentGroups = computed<PaymentGroup[]>(() => {
  const groupMap = new Map<string, PaymentGroup>()
  
  allPaymentMethods.value.forEach(method => {
    if (!groupMap.has(method.DET03)) {
      groupMap.set(method.DET03, {
        code: method.DET03,
        name: method.DET03S,
        options: []
      })
    }
    groupMap.get(method.DET03)!.options.push(method)
  })
  
  // Define custom order: A (Credit Card) first, then L (LINE Pay), then others
  const orderMap: Record<string, number> = {
    'A': 1,  // Credit Card
    'L': 2,  // LINE Pay
    'B': 3   // Bank Transfer
  }
  
  return Array.from(groupMap.values()).sort((a, b) => {
    const orderA = orderMap[a.code] || 999
    const orderB = orderMap[b.code] || 999
    return orderA - orderB
  })
})

// Get options for currently selected group (DET04 choices)
const selectedGroupOptions = computed<PaymentMethod[]>(() => {
  const group = paymentGroups.value.find(g => g.code === selectedGroup.value)
  if (!group) return []
  
  // Remove duplicates by DET04 code
  const uniqueOptions = new Map<string, PaymentMethod>()
  group.options.forEach(opt => {
    if (!uniqueOptions.has(opt.DET04)) {
      uniqueOptions.set(opt.DET04, opt)
    }
  })
  
  return Array.from(uniqueOptions.values())
})

// Get installment options for selected group and option (DET06 choices)
const installmentOptions = computed(() => {
  if (selectedGroup.value !== 'A') return [] // Only credit cards have installments
  
  const options = allPaymentMethods.value.filter(
    m => m.DET03 === selectedGroup.value && m.DET04 === selectedOption.value
  )
  
  return options.map(opt => ({
    periods: opt.DET06,
    totalAmount: opt.DET07,
    perPeriodAmount: opt.DET08
  }))
})

// Get current installment info
const currentInstallment = computed(() => {
  return installmentOptions.value.find(opt => opt.periods === selectedInstallment.value)
})

// Get current option note (DET04D)
const currentOptionNote = computed(() => {
  const option = allPaymentMethods.value.find(
    m => m.DET03 === selectedGroup.value && m.DET04 === selectedOption.value
  )
  return option?.DET04D || ''
})

// Calculate total amount for payment
const calculatedAmount = computed(() => {
  // 優先使用傳入的 props (for order query page)
  if (props.totalAmount) {
    return props.totalAmount
  }
  
  const bookingData = bookingStore.bookingResult?.bookingData
  if (!bookingData) return 0
  
  // 優先使用 API 回傳的 totalAmount
  if (bookingData.totalAmount) {
    return bookingData.totalAmount
  }
  
  // 否則從 details 累加 amountWithTax
  if (!bookingData.details || bookingData.details.length === 0) return 0
  
  return bookingData.details.reduce((sum: number, detail: any) => {
    return sum + (detail.amountWithTax || 0)
  }, 0)
})

// Format price with thousand separators
const formatPrice = (price: number) => {
  return price.toLocaleString('zh-TW')
}

// Initialize first option when group changes
watch(selectedGroup, () => {
  const options = selectedGroupOptions.value
  if (options.length > 0) {
    selectedOption.value = options[0].DET04
    selectedInstallment.value = 1
  }
}, { immediate: true })

// Handle next step button click
const handleNextStep = async () => {
  // 開始處理，顯示 loading
  isProcessing.value = true
  
  try {
    // 1. 取得選中的付款方式完整資訊
    const selectedMethod = allPaymentMethods.value.find(
      m => m.DET03 === selectedGroup.value && 
           m.DET04 === selectedOption.value && 
           m.DET06 === selectedInstallment.value
    )
    
    if (!selectedMethod) {
      console.error('Selected payment method not found')
      alert('請選擇付款方式')
      isProcessing.value = false
      return
    }
    
    // 2. 檢查並取得訂票資料
    console.log('=== Payment Method Card - Data Check ===')
    console.log('Props received:', {
      orderNumber: props.orderNumber,
      orderUniqId: props.orderUniqId,
      totalAmount: props.totalAmount
    })
    console.log('Booking store data:', {
      hasBookingResult: !!bookingStore.bookingResult,
      hasBookingData: !!bookingStore.bookingResult?.bookingData,
      bookingResult: bookingStore.bookingResult,
      searchParams: bookingStore.searchParams
    })
    
    // 優先使用傳入的 props (for order query page)
    let orderNumber = props.orderNumber
    let orderUniqId = props.orderUniqId
    
    console.log('Initial values:', { orderNumber, orderUniqId })
    
    // 如果沒有傳入 props，則從 bookingStore 取得
    if (!orderNumber || !orderUniqId) {
      console.log('Props missing, trying to get from bookingStore...')
      const bookingResult = bookingStore.bookingResult
      if (!bookingResult || !bookingResult.bookingData) {
        console.error('Booking result not found in store')
        console.error('bookingResult:', bookingResult)
        alert('訂票資料不存在，請重新訂票')
        isProcessing.value = false
        return
      }
      
      // 從 bookingData 取得訂單資訊 (根據 API 文件：api_booking)
      // bookingData 包含: pnrCode, orderNumber, totalAmount, orderUniqId, details[]
      orderNumber = bookingResult.bookingData.orderNumber
      orderUniqId = bookingResult.bookingData.orderUniqId  // 用於 FP03 的 PAR02
      console.log('Retrieved from store:', { orderNumber, orderUniqId })
    } else {
      console.log('Using props values:', { orderNumber, orderUniqId })
    }
    
    if (!orderNumber || !orderUniqId) {
      console.error('Missing required booking data:', { orderNumber, orderUniqId })
      alert('訂單資料不完整，請重新訂票')
      isProcessing.value = false
      return
    }
    
    // 3. 取得 FP02 訂單詳細資料 (包含 cust_list)
    // 優先使用 props 傳入的訂單號碼 (for order query page)
    let custList
    
    if (props.orderNumber) {
      // 訂單查詢頁面：需要重新呼叫 FP02
      console.log('Calling FP02 to get order details...')
      const fp02Response = await viewOrder(orderNumber, orderUniqId)
      
      console.log('FP02 Response:', fp02Response.data)
      
      if (fp02Response.data?.status != 1) {
        console.error('FP02 failed:', fp02Response.data?.msg)
        alert(`無法取得訂單資料：${fp02Response.data?.msg || '未知錯誤'}`)
        isProcessing.value = false
        return
      }
      
      custList = fp02Response.data.cust_list
    } else {
      // 一般訂票流程：使用 Step 3 已載入的 FP02 資料
      console.log('Using FP02 data from booking store...')
      const bookingData = bookingStore.bookingResult?.bookingData
      
      if (!bookingData || !bookingData.cust_list) {
        console.error('FP02 data not found in booking store')
        alert('訂單資料異常，請重新整理頁面')
        isProcessing.value = false
        return
      }
      
      custList = bookingData.cust_list
    }
    
    if (!custList || custList.length === 0) {
      console.error('No cust_list found in order data')
      alert('訂單資料異常，請重新訂票')
      isProcessing.value = false
      return
    }
    
    // 建立 item_list - 使用 FP02 回傳的 FPC01 作為 PAT01
    const itemList = custList.map((cust: any) => ({
      PAT01: cust.FPC01,                     // 使用 FP02 的 FPC01 (例如: F2510210012A001)
      PAT05: parseInt(cust.FPC54) || parseInt(cust.FPC52) || 0  // 應付金額
    }))
    
    console.log('Item list from FP02 cust_list:', itemList)
    
    // 根據範例格式建立付款請求 - 只使用必要欄位
    const paymentRequest = {
      PAR01: orderNumber,                    // 訂單號碼
      PAR02: orderUniqId,                    // 訂單 UNIQ_ID
      PAR03: 'B',                            // 付款項目 (A=訂金/全額, B=尾款)
      PAR04: selectedMethod.DET01,           // 付款方式代碼
      item_list: itemList
    }
    
    console.log('Creating payment with request:', paymentRequest)
    
    // 4. 呼叫 FP03 API 建立付款單
    const { createPayment } = await import('@/api')
    const response = await createPayment(paymentRequest)
    
    console.log('Payment creation response:', response.data)
    
    if (response.data?.status != "1") {
      console.error('Payment creation failed:', response.data?.msg)
      alert(`付款單建立失敗：${response.data?.msg || '未知錯誤'}`)
      isProcessing.value = false
      return
    }
    
    // 5. 根據 PEP04 決定導向方式
    let { PEP04, KEY11, KEY12, KEY21 } = response.data
    
    // 處理 API 回傳資料有誤的情況：
    // A1 使用 KEY11/KEY12 (form POST)
    // A4/A5 都使用 KEY21，差別在於 A4 用 iframe，A5 用新視窗
    // 若 A4 但 KEY21 沒有值，視為資料錯誤
    if (PEP04 === 'A4' && !KEY21) {
      console.error('A4 data error: KEY21 is required for iframe payment')
      alert('付款資料錯誤：缺少付款網址')
      isProcessing.value = false
      return
    }
    
    // 儲存付款資訊到 sessionStorage 供回傳時使用
    sessionStorage.setItem('paymentInfo', JSON.stringify({
      paymentOrderId: response.data.PEP01,     // 付款單號
      paymentNumber: response.data.PEP02,      // 付款序號
      amount: response.data.PEP05,             // 付款金額
      method: selectedMethod.DET01,
      methodName: selectedMethod.DET04S,
      pep04: PEP04
    }))
    
    // 儲存基本訂單資訊供 Step 4 使用
    sessionStorage.setItem('orderBasicInfo', JSON.stringify({
      orderNumber,
      orderUniqId,
      paymentOrderId: response.data.PEP01,
      paymentNumber: response.data.PEP02,
      amount: response.data.PEP05,
      method: selectedMethod.DET01,
      methodName: selectedMethod.DET04S,
      pep04: PEP04
    }))
    
    // 根據付款介面類型處理
    switch (PEP04) {
      case 'A1': { // 聯合信用卡中心 - 使用 KEY11/KEY12，Form POST 到銀行刷卡頁（新視窗）
        console.log('A1 payment: Opening bank payment in new window with KEY11/KEY12')
        handleCreditCardPayment(KEY12, KEY11)
        // 如果在對話框中，發送完成事件
        if (props.orderNumber) {
          emit('payment-completed')
        }
        // 不重置 loading，因為會跳轉到 Step 4
        break
      }
        
      case 'A4': { // 內嵌式 IFRAME - 使用 KEY21，在當前頁面顯示 iframe
        console.log('A4 payment: Showing iframe payment with KEY21')
        showIframePayment.value = true
        iframeUrl.value = KEY21
        iframeKey.value = '' // A4 不需要 KEY，直接使用 KEY21 URL
        // 儲存資訊供 iframe 完成後使用
        sessionStorage.setItem('iframePaymentData', JSON.stringify({
          url: KEY21,
          key: '',
          orderNumber,
          orderUniqId
        }))
        // 完成處理，顯示 iframe
        isProcessing.value = false
        // 不跳轉到 Step 4，停留在當前頁面顯示 iframe
        return
      }
        
      case 'A5': { // 外部導向 (如 LINE Pay) - 使用 KEY21，在當前頁面顯示 iframe
        console.log('A5 payment: Showing iframe payment with KEY21')
        showIframePayment.value = true
        iframeUrl.value = KEY21
        iframeKey.value = '' // A5 不需要 KEY，直接使用 KEY21 URL
        // 儲存資訊供 iframe 完成後使用
        sessionStorage.setItem('iframePaymentData', JSON.stringify({
          url: KEY21,
          key: '',
          orderNumber,
          orderUniqId
        }))
        // 完成處理，顯示 iframe
        isProcessing.value = false
        // 不跳轉到 Step 4，停留在當前頁面顯示 iframe
        return
      }
        
      case 'B1': { // 虛擬匯款帳號 - 呼叫 FP02 取得完整資料後進入 Step 4
        console.log('B1 payment: Getting transfer account info')
        const fp02AfterPayment = await viewOrder(orderNumber, orderUniqId)
        
        if (fp02AfterPayment.data?.status != 1) {
          console.error('FP02 after payment failed:', fp02AfterPayment.data?.msg)
          alert(`無法取得訂單資料：${fp02AfterPayment.data?.msg || '未知錯誤'}`)
          isProcessing.value = false
          return
        }
        
        // 儲存完整的 FP02 回應（包含 pay_list）到 sessionStorage
        sessionStorage.setItem('orderDataWithPayment', JSON.stringify(fp02AfterPayment.data))
        
        // 如果在對話框中，發送完成事件
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          // 導向 Step 4（不重置 loading，因為會跳轉）
          router.push({ name: 'booking-step-4' })
        }
        break
      }
        
      default:
        console.warn('Unknown payment interface type:', PEP04)
        // 如果在對話框中，發送完成事件
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          // 預設行為：導向 Step 4（不重置 loading）
          router.push({ name: 'booking-step-4' })
        }
    }
    
  } catch (error) {
    console.error('Payment process error:', error)
    alert('付款處理失敗，請稍後再試')
    isProcessing.value = false
  }
}

// 處理信用卡付款 (A1) - Post 到新視窗，原視窗跳轉 Step 4
const handleCreditCardPayment = (bankUrl: string, key: string) => {
  // 建立隱藏表單並自動提交到銀行
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = bankUrl
  form.target = '_blank' // 在新視窗開啟
  
  const keyInput = document.createElement('input')
  keyInput.type = 'hidden'
  keyInput.name = 'KEY'
  keyInput.value = key
  
  form.appendChild(keyInput)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
  
  // 顯示提示訊息
  alert('即將跳轉至銀行付款頁面，完成付款後請關閉付款視窗，系統將自動更新訂單狀態')
  
  // 原視窗導向 Step 4，並開始定時查詢訂單狀態
  router.push({ name: 'booking-step-4' })
}

// 處理外部導向付款 (A5 - LINE Pay 等) - 開新視窗，原視窗跳轉 Step 4
const handleExternalPayment = (externalUrl: string) => {
  // 開啟新視窗到外部付款頁面
  window.open(externalUrl, '_blank', 'width=800,height=600')
  
  // 顯示提示訊息
  // alert('即將開啟外部付款頁面，完成付款後請關閉付款視窗，系統將自動更新訂單狀態')
  
  // 原視窗導向 Step 4，並開始定時查詢訂單狀態
  router.push({ name: 'booking-step-4' })
}

// Handle manual jump to step 4
const handleManualJumpToStep4 = () => {
  // 如果在對話框中，發送完成事件
  if (props.orderNumber) {
    emit('payment-completed')
  } else {
    // 導向 Step 4
    router.push({ name: 'booking-step-4' })
  }
}

// Get button label based on selected group
const buttonLabel = computed(() => {
  if (selectedGroup.value === 'A') return '使用信用卡付款'
  if (selectedGroup.value === 'L') return '使用 LINE Pay 付款'
  if (selectedGroup.value === 'B') return '確認匯款資訊'
  return '下一步'
})

// Load payment methods on mount
onMounted(async () => {
    try {
        const totalAmount = calculatedAmount.value || 10000 // Use calculated or default
        const response = await getSupportedPaymentTypes(totalAmount)
        
        // Response format: { RET01, method_list }
        if (response.data?.method_list) {
            allPaymentMethods.value = response.data.method_list
            console.log('Loaded payment methods:', allPaymentMethods.value)
            // Initialize first option
            if (paymentGroups.value.length > 0) {
                selectedGroup.value = paymentGroups.value[0].code
            }
        } else {
            console.error('No method_list in response:', response.data)
        }
    } catch (error) {
        console.error('Failed to get payment methods:', error)
    }
})
</script>