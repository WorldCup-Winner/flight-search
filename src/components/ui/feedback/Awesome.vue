<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { goPrivacy } from '@/utils';

const isVisible = ref(false);

onMounted(() => {
  // Check if the cookie exists
  if (!document.cookie.split('; ').find(row => row.startsWith('privacy_accepted='))) {
    isVisible.value = true;
  }
});

const acceptPrivacy = () => {
  // Set a cookie to expire in 1 year
  const d = new Date();
  d.setTime(d.getTime() + (365*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = "privacy_accepted=true; " + expires + "; path=/";
  
  // Hide the component
  isVisible.value = false;
}
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-[999] flex items-center md:items-end justify-center px-4 pb-4 md:pb-8 bg-black/40 md:bg-transparent"
  >
    <div
      class="w-full max-w-sm md:max-w-[1000px] bg-white rounded-[10px] shadow-[0px_2px_30px_rgba(0,0,0,0.1)]
             px-6 py-4 md:px-20 md:py-8
             flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-6 text-center md:text-left"
    >
      <img
        class="mx-auto md:mx-0 w-[50%] h-[50%] md:w-[80%] md:h-[80%] md:col-span-3 mb-4 md:mb-0"
        src="@/assets/imgs/icon-awesome.svg"
      />
      <div class="md:col-span-9 flex flex-col justify-between gap-3">
        <h3 class="text-others-gray1 text-h2-d md:text-h3-d">隱私權聲明</h3>
        <p class="text-others-gray1 text-left">
          為提供您最佳的網站使用體驗，本網站使用Cookie以改善我們的網頁，作為技術、分析、行銷之用，繼續使用本網站表示您同意我們使用Cookie。進一步的資訊可閱讀我們
          <span class="text-others-original cursor-pointer" @click="goPrivacy">隱私權政策</span>
          說明。
        </p>
        <div class="flex justify-center md:justify-start">
          <button
            class="w-full md:w-[98px] h-[40px] rounded-[10px] bg-others-original text-white font-bold hover:bg-others-hover"
            @click="acceptPrivacy"
          >
            接受
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
