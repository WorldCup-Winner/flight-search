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
                      <PhoneField v-model="form.phoneNumber" v-model:countryCode="code" />
                    </div>
                    <!-- Submit -->
                    <button
                        type="submit"
                        class="w-[150px] mx-auto mt-4 bg-others-original text-white py-2 rounded-md hover:bg-others-hover transition"
                        @click="handleSearch"
                        >
                        查詢
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

import PhoneField from '@/components/ui/PhoneField.vue'

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

const handleSearch = () => {
  console.log('Search with:', form.value)
  // Your login logic here
  close()
  router.push('/booking-search-result')
}
</script>