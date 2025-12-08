<template>
  <div class="fixed inset-0 z-50 top-0 bg-black/20 w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="flex flex-col items-center justify-center w-[400px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8">
        <img :src="ThankYouIcon" />
        <h3 class="text-others-gray1 text-h3 md:text-h3-d mb-2">條款同意</h3>
        <p class="text-others-gray1 text-center mb-6">請先閱讀本服務訂購須知(含個資聲明),並同意所有內容</p>
        <button
          class="mt-6 px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
          @click="notifyParent"
        >
          確認
        </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import ThankYouIcon from "@/assets/imgs/thank-you.png"
import { defineEmits } from 'vue';
const emit = defineEmits<{ (e: 'close', payload: void): void }>();

function notifyParent() {
  emit('close');
}
</script>

