<template>
    <div class="max-w-6xl w-full">
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
        </div>
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p class="text-red-600 font-semibold">{{ error }}</p>
            <button 
                @click="loadOrderData"
                class="mt-4 px-6 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90">
                重試
            </button>
        </div>
        <template v-else>
            <TicketBookingCard />
            <PaymentMethodCard />
        </template>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { viewOrder } from '@/api'
import TicketBookingCard from './TicketBookingCard.vue'
import PaymentMethodCard from './PaymentMethodCard.vue'

// Step navigation now handled by router (no longer using v-model:step)
const bookingStore = useBookingStore()
const isLoading = ref(true)
const error = ref('')

const loadOrderData = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // 取得訂單資訊
    const bookingResult = bookingStore.bookingResult
    if (!bookingResult || !bookingResult.bookingData) {
      error.value = '訂單資料不存在，請重新訂票'
      return
    }
    
    const orderNumber = bookingResult.bookingData.orderNumber
    const orderUniqId = bookingResult.bookingData.orderUniqId
    
    if (!orderNumber || !orderUniqId) {
      error.value = '訂單資料不完整，請重新訂票'
      return
    }
    
    // 呼叫 FP02 取得訂單詳細資料
    console.log('Step 3: Calling FP02 to get order details...', { orderNumber, orderUniqId })
    const fp02Response = await viewOrder(orderNumber, orderUniqId)
    
    console.log('Step 3: FP02 Response:', fp02Response.data)
    
    if (fp02Response.data?.status != 1) {
      error.value = `無法取得訂單資料：${fp02Response.data?.msg || '未知錯誤'}`
      return
    }
    
    // 更新 booking store 的 bookingData，將 FP02 回傳的完整資料存入
    bookingStore.setBookingResult({
      ...bookingResult,
      bookingData: {
        ...bookingResult.bookingData,
        ...fp02Response.data  // 包含 fly_list, cust_list, FPA55 等所有 FP02 欄位
      }
    })
    
    console.log('Step 3: FP02 data stored in booking store')
    
  } catch (err) {
    console.error('Step 3: Failed to load FP02 data:', err)
    error.value = '載入訂單資料失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Restore booking data from localStorage (safety net, though BookingView should already do this)
  bookingStore.getBookingData()
  
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
  
  // 載入 FP02 訂單資料
  loadOrderData()
})
</script>