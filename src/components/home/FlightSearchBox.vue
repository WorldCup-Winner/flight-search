<template>
  <!-- Main Flight Search Box-->
  <div class="relative top-52 z-10 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 px-14 w-full mx-auto max-w-6xl">
      <div class="flex justify-between w-full">
        <!-- Title -->
        <h1 class="text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

        <!-- Tab Navigation -->
        <div class="flex space-x-2 px-4 py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
          <button @click="activeTab = 'roundtrip'" :class="[
            'px-6 min-w-[148px] min-h-[38px] py-2 rounded-lg font-medium transition',
            activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">來回</button>
          <button @click="activeTab = 'oneway'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">單程</button>
          <button @click="activeTab = 'multi'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">多行程</button>
        </div>
      </div>
      <div v-if="activeTab == 'roundtrip'">
        <RoundSearchBox @search="handleRoundSearch" />
      </div>
      <div v-else-if="activeTab === 'oneway'">
        <SingleSearchBox @search="handleSingleSearch" />
      </div>
      <div v-else-if="activeTab === 'multi'">
        <MultiSearchBox @search="handleMultiSearch" />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import MultiSearchBox from '@/components/home/MultiSearchBox.vue'
import SingleSearchBox from '@/components/home/SingleSearchBox.vue'
import RoundSearchBox from "@/components/home/RoundSearchBox.vue"

const activeTab = ref('roundtrip')

function handleRoundSearch(payload) {
  console.log('handleRoundSearch:', payload)  
  const emit = defineEmits(['search'])
  emit('search', payload)
}
function handleSingleSearch(payload) {
  console.log('handleSingleSearch:', payload)
}

function handleMultiSearch(payload) {
  console.log('handleMultiSearch:', payload)
}
</script>

<style scoped>
/* subtle entrance for the small modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all .15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
