<template>
  <div class="max-w-6xl w-full">
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
    </div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600 font-semibold">{{ error }}</p>
      <button
        @click="loadOrderData"
        class="mt-4 px-6 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90"
      >
        重試
      </button>
    </div>
    <template v-else>
      <TicketBookingCard />
      <PaymentMethodCard />
    </template>

    <!-- Inactivity timeout modal -->
    <Transition name="fade">
      <WakeUp v-if="showWakeUp" :close-modal="closeWakeUpModal" />
    </Transition>

    <!-- Leave confirmation modal (prevent accidental back to Step 2) -->
    <Transition name="fade">
      <div
        v-if="showLeaveConfirm"
        class="fixed inset-0 bg-black/30 flex items-center justify-center z-[120] px-4"
        @click.self="showLeaveConfirm = false"
      >
        <div
          class="flex flex-col items-center justify-center w-full max-w-[360px] md:max-w-[420px] bg-white rounded-[10px]
                 drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-6 py-6 md:px-10 md:py-8"
        >
          <h3 class="text-others-gray1 text-lg md:text-[22px] font-bold mb-3 text-center">
            要返回首頁嗎？
          </h3>
          <p class="text-others-gray1 text-sm md:text-base text-center mb-6">
            若返回上一頁重新操作，可能會造成重複訂購。
            您可以選擇直接回到首頁，或繼續留在此付款頁面完成流程。
          </p>
          <div class="flex flex-col md:flex-row gap-3 w-full">
            <button
              type="button"
              class="w-full md:flex-1 px-4 py-3 rounded-[10px] border border-others-original text-others-original font-semibold hover:bg-others-original hover:text-white transition"
              @click="showLeaveConfirm = false"
            >
              留在本頁
            </button>
            <button
              type="button"
              class="w-full md:flex-1 px-4 py-3 rounded-[10px] border-none bg-others-original text-white font-semibold hover:bg-others-hover transition"
              @click="confirmLeaveToHome"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { viewOrder } from '@/api'
import TicketBookingCard from './TicketBookingCard.vue'
import PaymentMethodCard from './PaymentMethodCard.vue'
import WakeUp from '@/components/ui/feedback/WakeUp.vue'
import { useInactivityTimeout } from '@/composables/useInactivityTimeout'

// Step navigation now handled by router (no longer using v-model:step)
const bookingStore = useBookingStore()
const router = useRouter()

const isLoading = ref(true)
const error = ref('')

// ---------- Inactivity Timeout (15 minutes) ----------
const { showWakeUp, closeModal: closeWakeUpModal } = useInactivityTimeout()

// ---------- Leave confirmation (Step 3 -> Step 2 back) ----------
const showLeaveConfirm = ref(false)

// Intercept navigation from Step 3 back to Step 2 (e.g. browser back)
onBeforeRouteLeave((to, from, next) => {
  if (from.name === 'booking-step-3' && to.name === 'booking-step-2') {
    // Show confirmation dialog instead of going back to Step 2 directly
    showLeaveConfirm.value = true
    next(false)
  } else {
    next()
  }
})

const confirmLeaveToHome = () => {
  showLeaveConfirm.value = false
  router.push({ name: 'home' })
}

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
        ...fp02Response.data // 包含 fly_list, cust_list, FPA55 等所有 FP02 欄位
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