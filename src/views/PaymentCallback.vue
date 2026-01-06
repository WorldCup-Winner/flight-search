<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div v-if="!errorMessage" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-700">正在處理付款結果...</h2>
      <p class="text-gray-500 mt-2">請稍候，系統正在確認您的訂單狀態</p>
    </div>
    
    <div v-else class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">處理失敗</h2>
      <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
      <div class="space-y-3">
        <button 
          @click="retryProcessing"
          class="w-full bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
        >
          重試
        </button>
        <button 
          @click="router.push('/')"
          class="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          返回首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryPaymentResult, getPaymentInfo } from '@/api'

const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
let retryInterval: ReturnType<typeof setInterval> | null = null
let retryStartTime: number | null = null
const MAX_RETRY_DURATION = 30 * 60 * 1000 // 30分鐘

const processPaymentCallback = async () => {
  const path = route.path
  let orderNumber = ''
  let orderUniqId = ''
  
  try {
    if (path.includes('nccc_pay')) {
      // NCCC Payment Callback
      const key = route.query.KEY as string
      if (!key) throw new Error('Missing KEY parameter')
      
      const response = await queryPaymentResult({
        PAR01: 'NCCC',
        PAR02: key,
        from_ip: '',
        from_url: window.location.href
      })
      
      if (response.data?.status == 1) {
        orderNumber = response.data.RET01
        orderUniqId = response.data.RET02
        const paymentType = response.data.RET04 || ''
        
        // Store in sessionStorage for consistency with existing flow
        sessionStorage.setItem('orderBasicInfo', JSON.stringify({
          orderNumber,
          orderUniqId,
          pep04: paymentType
        }))
      } else {
        throw new Error(response.data?.msg || 'Payment query failed')
      }
      
    } else if (path.includes('line_pay')) {
      // LINE Pay Callback
      const transactionId = route.query.transactionId as string
      const orderId = route.query.orderId as string
      
      if (!transactionId || !orderId) throw new Error('Missing LINE Pay parameters')
      
      const response = await queryPaymentResult({
        PAR01: 'LINE',
        PAR02: transactionId,
        PAR03: orderId,
        from_ip: '',
        from_url: window.location.href
      })
      
      if (response.data?.status == 1) {
        orderNumber = response.data.RET01
        orderUniqId = response.data.RET02
        const paymentType = response.data.RET04 || ''
        
        // Store in sessionStorage for consistency with existing flow
        sessionStorage.setItem('orderBasicInfo', JSON.stringify({
          orderNumber,
          orderUniqId,
          pep04: paymentType
        }))
      } else {
        throw new Error(response.data?.msg || 'Payment query failed')
      }
      
    } else if (path.includes('card_pay')) {
      // Card Payment Callback (台新 & 聯邦)
      const pyid = route.query.pyid as string  // 付款單號
      const chk = route.query.chk as string    // 驗證碼
      
      if (!pyid || !chk) throw new Error('Missing card payment parameters')
      
      const response = await queryPaymentResult({
        PAR01: 'CARD',
        PAR02: chk,
        PAR03: pyid,
        from_ip: '',
        from_url: window.location.href
      })
      
      if (response.data?.status == 1) {
        orderNumber = response.data.RET01
        orderUniqId = response.data.RET02
        const paymentType = response.data.RET04 || ''
        
        // 清除可能的重試 interval
        if (retryInterval) {
          clearInterval(retryInterval)
          retryInterval = null
        }
        
        // Store in sessionStorage for consistency with existing flow
        sessionStorage.setItem('orderBasicInfo', JSON.stringify({
          orderNumber,
          orderUniqId,
          pep04: paymentType
        }))
      } else {
        throw new Error(response.data?.msg || 'Card payment query failed')
      }
      
    } else if (path.includes('PayInfo')) {
      // Payment Info Link
      const paymentId = route.params.paymentId as string
      const uniqId = route.params.uniqId as string
      
      if (!paymentId || !uniqId) throw new Error('Missing Payment Info parameters')
      
      // FP03B requires PAR01 (Order Number), PAR02 (UniqID), PAR03 (PaymentID)
      // Try multiple sources to get order number
      let storedOrderNumber = ''
      
      // 1. Try orderBasicInfo (set by BookingSearchResult or PaymentMethodCard)
      try {
        const storedInfo = sessionStorage.getItem('orderBasicInfo')
        if (storedInfo) {
          const parsed = JSON.parse(storedInfo)
          storedOrderNumber = parsed.orderNumber || ''
          console.log('Found orderNumber in orderBasicInfo:', storedOrderNumber)
        }
      } catch (e) {
        console.warn('Failed to parse orderBasicInfo', e)
      }
      
      // 2. If not found, try orderQueryBasicInfo (set by BookingSearch)
      if (!storedOrderNumber) {
        try {
          const queryInfo = sessionStorage.getItem('orderQueryBasicInfo')
          if (queryInfo) {
            const parsed = JSON.parse(queryInfo)
            storedOrderNumber = parsed.orderNumber || ''
            console.log('Found orderNumber in orderQueryBasicInfo:', storedOrderNumber)
          }
        } catch (e) {
          console.warn('Failed to parse orderQueryBasicInfo', e)
        }
      }
      
      console.log('Using orderNumber for FP03B:', storedOrderNumber || '(empty)')
      
      const response = await getPaymentInfo({
        PAR01: storedOrderNumber,
        PAR02: uniqId,
        PAR03: paymentId,
        from_ip: '',
        from_url: window.location.href
      })
      
      if (response.data?.status == 1) {
        orderNumber = response.data.PEP01A
        orderUniqId = response.data.PEP01B
        const paymentType = response.data.PEP04 || ''
        console.log('Got order info from FP03B:', { orderNumber, orderUniqId, paymentType })
        
        // Store in sessionStorage for consistency with existing flow
        sessionStorage.setItem('orderBasicInfo', JSON.stringify({
          orderNumber,
          orderUniqId,
          pep04: paymentType
        }))
      } else {
        throw new Error(response.data?.msg || 'Payment info query failed')
      }
    }
    
    if (orderNumber && orderUniqId) {
      // 清除可能的重試 interval
      if (retryInterval) {
        clearInterval(retryInterval)
        retryInterval = null
      }
      
      // Redirect to Step 4
      router.push({
        name: 'booking-step-4',
        query: {
          orderNumber,
          orderUniqId
        }
      })
    } else {
      throw new Error('Could not retrieve order information')
    }
    
  } catch (error) {
    console.error('Payment callback error:', error)
    
    // 如果是 card_pay 且尚未開始重試，則開始每 500ms 重試
    if (route.path.includes('card_pay') && !retryInterval) {
      console.log('Card payment failed, starting retry interval...')
      retryStartTime = Date.now()
      
      retryInterval = setInterval(() => {
        // 檢查是否超過30分鐘
        if (retryStartTime && Date.now() - retryStartTime > MAX_RETRY_DURATION) {
          console.error('Card payment retry timeout after 30 minutes')
          if (retryInterval) {
            clearInterval(retryInterval)
            retryInterval = null
          }
          errorMessage.value = '付款確認逾時，請稍後至訂單查詢頁面確認訂單狀態，或聯繫客服人員'
          return
        }
        
        console.log('Retrying card payment callback...')
        processPaymentCallback()
      }, 500)
    } else if (!route.path.includes('card_pay')) {
      // 非 card_pay 路徑才顯示錯誤訊息
      errorMessage.value = error instanceof Error ? error.message : '處理付款結果時發生錯誤，請聯繫客服人員'
    }
  }
}

const retryProcessing = () => {
  errorMessage.value = ''
  processPaymentCallback()
}

onMounted(async () => {
  await processPaymentCallback()
})

onUnmounted(() => {
  // 清除重試 interval
  if (retryInterval) {
    clearInterval(retryInterval)
    retryInterval = null
  }
})
</script>
