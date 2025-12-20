<template>
  <div class="fixed inset-0 z-50 top-0 bg-black/20 w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="flex flex-col items-center justify-center w-[400px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8">
        <img :src="WakeUp" />
        <h3 class="text-others-gray1 text-h3 md:text-h3-d">閒置時間過長</h3>
        <p class="text-others-gray1 text-center">為確保取得最新票價和機位資訊，網頁將重新整理</p>
        <button
          class="mt-6 px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
          @click="handleConfirm"
        >
          確認
        </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import WakeUp from "@/assets/imgs/icon-wake-up.svg"

const router = useRouter()

// Navigate to step 3 (payment) when user confirms
function handleConfirm() {
  router.push({ name: 'booking-step-3' })
}
</script>