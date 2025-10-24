<template>
  <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
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
          </div>
      </div>
      
      <div v-else>
      <h2 class="font-semibold text-primary-gold">付款方式</h2>
      <div class="grid grid-cols-12 py-6 gap-12">
        <div class="col-span-12 md:col-span-3 w-full space-y-4">
            <button 
                v-for="group in paymentGroups" 
                :key="group.code" 
                @click="selectedGroup = group.code"
                class="w-full py-4 rounded-md transition-colors"
                :class="selectedGroup === group.code ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1'">
                {{ group.name }}
            </button>
        </div>
        <div class="col-span-12 md:col-span-9 w-full space-y-6">
            <div v-if="selectedGroup === 'A'">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">信用卡選擇與付款設定</h2>

                    <div v-if="selectedGroupOptions.length > 0" class="mt-5">
                        <h3 class="text-sm font-medium text-others-gray1 mb-3">選擇信用卡類型</h3>
                        <div class="flex gap-3 flex-wrap">
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

                    <div v-if="installmentOptions.length > 0" class="mt-5">
                        <h3 class="text-sm font-medium text-others-gray1 mb-3">分期方式</h3>
                        <div class="flex gap-3 flex-wrap">
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
                </div>

                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">{{ selectedInstallment === 1 ? '付款注意事項' : '分期付款說明' }}</h2>
                    <div class="mt-4 text-others-gray1 text-sm" v-html="currentOptionNote"></div>
                </div>
            </div>

            <div v-if="selectedGroup === 'L'">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">LINE Pay 付款方式</h2>

                    <div v-if="selectedGroupOptions.length > 0" class="mt-5">
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

                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">LINE Pay 付款說明</h2>
                    <div class="mt-4 text-others-gray1 text-sm" v-html="currentOptionNote"></div>
                </div>
            </div>

            <div v-if="selectedGroup === 'B'">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">銀行匯款資訊</h2>

                    <div v-if="selectedGroupOptions.length > 0" class="mt-5">
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

                <div v-if="currentOptionNote" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">匯款注意事項</h2>
                    <div class="mt-4 text-others-gray1 text-sm" v-html="currentOptionNote"></div>
                </div>
            </div>

            <div class="flex justify-center mt-8">
                <button
                    @click="handleNextStep"
                    :disabled="!selectedOption || isProcessing"
                    class="px-8 py-3 w-[60%] h-[60px] rounded-md font-semibold transition-colors relative"
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
import { useBookingStore } from '@/stores/booking'
import { LiyiFP02, LiyiFP03, LiyiPAYTYPE } from '@/api';
import { useToast } from 'vue-toastification';

const toast = useToast()

const props = defineProps<{
  orderNumber?: string
  orderUniqId?: string
  totalAmount?: number
}>()

const emit = defineEmits<{
  (e: 'update:step', v: number): void
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

const allPaymentMethods = ref<PaymentMethod[]>([])
const selectedGroup = ref<string>('A') // Default to 信用卡
const selectedOption = ref<string>('')  // DET04 code
const selectedInstallment = ref<number>(1) // DET06 periods

const isProcessing = ref<boolean>(false)

const showIframePayment = ref<boolean>(false)
const iframeUrl = ref<string>('')
const iframeKey = ref<string>('')

const handleIframeLoad = () => {
  try {
    const iframe = document.querySelector('iframe')
    if (iframe && iframe.contentWindow) {
      const iframeLocation = iframe.contentWindow.location.href
      
      if (iframeLocation.includes("galilee")) {
        toast.success('Payment completed, redirecting to Step 4')
        
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          const orderBasicInfo = sessionStorage.getItem('orderBasicInfo')
          if (orderBasicInfo) {
            emit('update:step', 4)
          }
        }
      }
    }
  } catch (error) {
    console.log('Iframe cross-origin check (expected)')
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.data && event.data.paymentCompleted) {
      if (props.orderNumber) {
        emit('payment-completed')
      } else {
        emit('update:step', 4)
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
  
  return Array.from(groupMap.values())
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

// Initialize first option when group changes
watch(selectedGroup, () => {
  const options = selectedGroupOptions.value
  if (options.length > 0) {
    selectedOption.value = options[0].DET04
    selectedInstallment.value = 1
  }
}, { immediate: true })

const handleNextStep = async () => {
  isProcessing.value = true
  
  try {
    const selectedMethod = allPaymentMethods.value.find(
      m => m.DET03 === selectedGroup.value && 
           m.DET04 === selectedOption.value && 
           m.DET06 === selectedInstallment.value
    )
    
    if (!selectedMethod) {
      console.error('Selected payment method not found')
      toast.error('請選擇付款方式')
      isProcessing.value = false
      return
    }
    
    console.log('Booking store data:', {
      bookingResult: bookingStore.bookingResult,
      searchParams: bookingStore.searchParams,
      props: { orderNumber: props.orderNumber, orderUniqId: props.orderUniqId }
    })
    
    let orderNumber = props.orderNumber
    let orderUniqId = props.orderUniqId
    
    if (!orderNumber || !orderUniqId) {
      const bookingResult = bookingStore.bookingResult
      if (!bookingResult || !bookingResult.bookingData) {
        console.error('Booking result not found')
        toast.error('訂票資料不存在，請重新訂票')
        isProcessing.value = false
        return
      }
      
      orderNumber = bookingResult.bookingData.orderNumber
      orderUniqId = bookingResult.bookingData.orderUniqId  // 用於 FP03 的 PAR02
    }
    
    if (!orderNumber || !orderUniqId) {
      console.error('Missing required booking data:', { orderNumber, orderUniqId })
      toast.error('訂單資料不完整，請重新訂票')
      isProcessing.value = false
      return
    }
    
    console.log('Calling FP02 to get order details...')
    const fp02Response = await LiyiFP02({
        PAR01: orderNumber,
        PAR02: orderUniqId,
        PAR03: '',
        from_ip: '',
        from_url: window.location.href
    })
    
    console.log('FP02 Response:', fp02Response.data)
    
    if (fp02Response.data?.status != 1) {
      console.error('FP02 failed:', fp02Response.data?.msg)
      toast.error(`無法取得訂單資料：${fp02Response.data?.msg || '未知錯誤'}`)
      isProcessing.value = false
      return
    }
    
    const custList = fp02Response.data.cust_list
    if (!custList || custList.length === 0) {
      console.error('No cust_list found in FP02 response')
      alert('訂單資料異常，請重新訂票')
      isProcessing.value = false
      return
    }
    
    const itemList = custList.map((cust: any) => ({
      PAT01: cust.FPC01,                     // 使用 FP02 的 FPC01 (例如: F2510210012A001)
      PAT05: parseInt(cust.FPC54) || parseInt(cust.FPC52) || 0  // 應付金額
    }))
    
    console.log('Item list from FP02 cust_list:', itemList)
    
    const paymentRequest = {
      PAR01: orderNumber,                    // 訂單號碼
      PAR02: orderUniqId,                    // 訂單 UNIQ_ID
      PAR03: 'B',                            // 付款項目 (A=訂金/全額, B=尾款)
      PAR04: selectedMethod.DET01,           // 付款方式代碼
      item_list: itemList
    }
    
    console.log('Creating payment with request:', paymentRequest)
    
    // 4. 呼叫 FP03 API 建立付款單
    const response = await LiyiFP03(paymentRequest)
    
    console.log('Payment creation response:', response.data)
    
    if (response.data?.status != "1") {
      console.error('Payment creation failed:', response.data?.msg)
      toast.error(`付款單建立失敗：${response.data?.msg || '未知錯誤'}`)
      isProcessing.value = false
      return
    }
    
    let { PEP04, KEY11, KEY12, KEY21 } = response.data
    
    if (PEP04 === 'A4' && !KEY21) {
      console.error('A4 data error: KEY21 is required for iframe payment')
      toast.error('付款資料錯誤：缺少付款網址')
      isProcessing.value = false
      return
    }
    
    sessionStorage.setItem('paymentInfo', JSON.stringify({
      paymentOrderId: response.data.PEP01,     // 付款單號
      paymentNumber: response.data.PEP02,      // 付款序號
      amount: response.data.PEP05,             // 付款金額
      method: selectedMethod.DET01,
      methodName: selectedMethod.DET04S,
      pep04: PEP04
    }))
    
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
    
    switch (PEP04) {
      case 'A1': {
        console.log('A1 payment: Opening bank payment in new window with KEY11/KEY12')
        handleCreditCardPayment(KEY12, KEY11)

        if (props.orderNumber) {
          emit('payment-completed')
        }

        break
      }
        
      case 'A4': {
        console.log('A4 payment: Showing iframe payment with KEY21')
        showIframePayment.value = true
        iframeUrl.value = KEY21
        iframeKey.value = ''

        sessionStorage.setItem('iframePaymentData', JSON.stringify({
          url: KEY21,
          key: '',
          orderNumber,
          orderUniqId
        }))

        isProcessing.value = false
        return
      }
        
      case 'A5': {
        console.log('A5 payment: Opening external payment with KEY21')

        handleExternalPayment(KEY21)
        
        if (props.orderNumber) {
          emit('payment-completed')
        }
        
        break
      }
        
      case 'B1': {
        console.log('B1 payment: Getting transfer account info')

        const fp02AfterPayment = await LiyiFP02({
          PAR01: orderNumber,
          PAR02: orderUniqId,
          PAR03: '',
          from_ip: '',
          from_url: window.location.href
        })
        
        if (fp02AfterPayment.data?.status != 1) {
          console.error('FP02 after payment failed:', fp02AfterPayment.data?.msg)
          toast.error(`無法取得訂單資料：${fp02AfterPayment.data?.msg || '未知錯誤'}`)
          isProcessing.value = false
          return
        }
        
        sessionStorage.setItem('orderDataWithPayment', JSON.stringify(fp02AfterPayment.data))
        
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          emit('update:step', 4)
        }
        break
      }
        
      default:
        console.warn('Unknown payment interface type:', PEP04)
        
        if (props.orderNumber) {
          emit('payment-completed')
        } else {
          emit('update:step', 4)
        }
    }
    
  } catch (error) {
    console.error('Payment process error:', error)

    toast.error('付款處理失敗，請稍後再試')
    isProcessing.value = false
  }
}

const handleCreditCardPayment = (bankUrl: string, key: string) => {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = bankUrl
  form.target = '_blank'
  
  const keyInput = document.createElement('input')
  keyInput.type = 'hidden'
  keyInput.name = 'KEY'
  keyInput.value = key
  
  form.appendChild(keyInput)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
  
  toast.info('即將跳轉至銀行付款頁面，完成付款後請關閉付款視窗，系統將自動更新訂單狀態')
  
  emit('update:step', 4)
}

const handleExternalPayment = (externalUrl: string) => {
  window.open(externalUrl, '_blank', 'width=800,height=600')
  
  toast.info('即將開啟外部付款頁面，完成付款後請關閉付款視窗，系統將自動更新訂單狀態')
  
  emit('update:step', 4)
}

const buttonLabel = computed(() => {
  if (selectedGroup.value === 'A') return '使用信用卡付款'
  if (selectedGroup.value === 'L') return '使用 LINE Pay 付款'
  if (selectedGroup.value === 'B') return '確認匯款資訊'
  return '下一步'
})

onMounted(async () => {
    try {
        const totalAmount = calculatedAmount.value
        const response = await LiyiPAYTYPE({totalAmount: totalAmount})
        
        if (response.data?.method_list) {
            allPaymentMethods.value = response.data.method_list
            console.log('Loaded payment methods:', allPaymentMethods.value)
            
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