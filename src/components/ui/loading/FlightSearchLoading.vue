<template>
  <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] max-w-md w-full p-8 relative overflow-hidden">
      <!-- SVG Illustration -->
      <div class="flex justify-center mb-6">
        <img 
          src="@/assets/imgs/loading-flight-search.svg" 
          alt="Loading"
          class="w-auto h-32 object-contain"
        />
      </div>
      
      <!-- Text -->
      <div class="text-center mb-8">
        <h3 class="text-xl text-others-gray1 mb-2">高速搜尋中</h3>
        <p class="text-sm text-others-gray1">請稍候...</p>
      </div>
      
      <!-- Loading Progress Bar -->
      <div class="w-full h-2 bg-others-gray3 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-[#FFD700] via-primary-gold to-others-original rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - this is a simple loading indicator
</script>

<style scoped>
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-progress {
  animation: progress 2s ease-in-out infinite;
  width: 80%;
}
</style>
