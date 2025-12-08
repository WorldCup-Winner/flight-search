<template>
    <div
        v-if="open"
        class="fixed inset-0 z-50 top-0 w-[100vw] h-[100vh] flex items-center justify-center">
        <div
            class="fixed inset-0 top-0 bg-black/20 w-[100vw] h-[100vh]"
            @click="close"></div>
            
        <div class="max-w-[800px] rounded-[60px] p-[60px] rounded-br-none bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)]">
            <div class="bg-white rounded-t-2xl border-b-0 px-[30px] py-[20px] w-[500px] border-2 border-primary-gold">
              <p class="text-others-gray1 text-h3">訂單查詢</p>
            </div>
            <div class="bg-white rounded-b-2xl px-[40px] py-[30px] w-[500px] border-2 border-primary-gold">
                <form @submit.prevent="handleSearch" class="flex flex-col items-center">
                    <!-- 身分證號 -->
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">訂單號碼</label>
                        <div class="relative">
                            <input v-model="form.bookingId" type="text" placeholder="H12156689"
                                class="w-full px-5 py-2 border rounded-[10px] border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <span class="absolute right-3 top-2.5 text-others-gray1">
                                <i class="fas fa-eye"></i>
                            </span>
                        </div>
                    </div>

                    <div class="mb-4 w-full">
                      <label class="block mb-1 text-others-gray1 text-sm">手機號碼</label>
                      <PhoneField v-model="form.phoneNumber" v-model:countryCode="code" :show-eye="true" />
                    </div>
                    <!-- Submit -->
                    <button
                        type="submit"
                        :disabled="isSearching || !form.bookingId || !form.phoneNumber"
                        class="w-[150px] mx-auto mt-4 py-2 rounded-md transition"
                        :class="isSearching || !form.bookingId || !form.phoneNumber 
                          ? 'bg-others-gray4 text-others-gray1 cursor-not-allowed' 
                          : 'bg-others-original text-white hover:bg-others-hover'"
                        >
                        {{ isSearching ? '查詢中...' : '查詢' }}
                    </button>
                    <!-- Footer text -->
                    <p class="mt-8 text-xs text-others-gray1 leading-relaxed">
                        以訂單編號及主要聯絡人手機號碼登入，可維護訂單所有資料。
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router"
import { queryOrder, viewOrder } from '@/api'

import PhoneField from '@/components/ui/forms/PhoneField.vue'

const router = useRouter()

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}

const code  = ref('+886')

const form = ref({
    bookingId: '',
    phoneNumber: ''
})

const isSearching = ref(false)
const searchError = ref('')

const handleSearch = async () => {
  try {
    isSearching.value = true
    searchError.value = ''
    
    console.log('Searching order with:', form.value)
    
    // 移除國碼前綴（如果有）
    const mobileNumber = form.value.phoneNumber.replace(/^\+886/, '0').replace(/\s/g, '')
    
    // 第一步：呼叫 FP04 查詢訂單，取得 UNIQ_ID (RET02)
    const fp04Response = await queryOrder(form.value.bookingId, mobileNumber)
    
    console.log('FP04 Response:', fp04Response.data)
    
    // 檢查 status（可能是字串 "1" 或數字 1）
    if (fp04Response.data.status != 1) {
      searchError.value = fp04Response.data.msg || '查無此訂單或手機號碼不符'
      alert(searchError.value)
      return
    }
    
    // 取得 UNIQ_ID
    const { RET01: orderNumber, RET02: uniqId, RET03: passengerSeq } = fp04Response.data
    
    console.log('Order found:', { orderNumber, uniqId, passengerSeq })
    
    // 第二步：呼叫 FP02 取得訂單詳細內容
    const fp02Response = await viewOrder(orderNumber, uniqId, passengerSeq)
    
    console.log('FP02 Response:', fp02Response.data)
    
    // 檢查 status（可能是字串 "1" 或數字 1）
    if (fp02Response.data.status != 1) {
      searchError.value = fp02Response.data.msg || '無法取得訂單詳細資料'
      alert(searchError.value)
      return
    }
    
    // 關閉彈窗
    close()
    
    // 導向訂單查詢結果頁面，並傳遞訂單資料
    router.push({
      name: 'booking-search-result',
      state: {
        orderData: fp02Response.data
      }
    })
    
  } catch (error: any) {
    console.error('Search order error:', error)
    searchError.value = error.response?.data?.msg || '查詢失敗，請稍後再試'
    alert(searchError.value)
  } finally {
    isSearching.value = false
  }
}
</script>