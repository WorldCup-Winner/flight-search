<template>
  <main>
    <!-- Hero hides on mobile once search results arrive; remains on desktop -->
    <div :class="sharedValue.isSearch && flightSearchStore.loading === 'success' ? 'hidden md:block' : ''">
      <HeroSection />
    </div>
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import { ref, provide, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'
import { useFlightSearchStore } from '@/stores/flightSearch'
import { hasSearchParams } from '@/utils/urlParamsSync'

const flightSearchStore = useFlightSearchStore()
const route = useRoute()

interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean,
  isSearch: boolean,
  fareRuleData?: any, // Store the fare rule data to pass to the dialog
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false,
  isSearch: false,
  fareRuleData: undefined,
})

function updateValue(val: SharedData) {
  sharedValue.value = val
}

provide('sharedValue', sharedValue)
provide<(val: SharedData) => void>('updateValue', updateValue)

// Reset sharedValue when navigating to home with no search params
watch(
  () => route.path,
  (path) => {
    if (path === '/' && !hasSearchParams(route.query)) {
      sharedValue.value = {
        isOpenBaggageInfoAndFeeRule: false,
        isSearch: false,
        fareRuleData: undefined,
      }
    }
  },
  { immediate: true }
)

// Also watch query changes
watch(
  () => route.query,
  () => {
    if (route.path === '/' && !hasSearchParams(route.query)) {
      sharedValue.value = {
        isOpenBaggageInfoAndFeeRule: false,
        isSearch: false,
        fareRuleData: undefined,
      }
    }
  },
  { deep: true }
)

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});

// 檢測是否從訂單確認信連結進入
onMounted(() => {
  const orderNumber = route.params.orderNumber as string
  
  if (orderNumber) {
    // 獲取 Header 組件實例並調用方法打開訂單查詢 popup
    const instance = getCurrentInstance()
    const header = instance?.appContext.config.globalProperties.$refs?.header
    
    // 使用 nextTick 確保 DOM 已渲染
    setTimeout(() => {
      // 透過直接查找 Header 組件來調用方法
      // 由於 Header 在 App.vue 中，我們需要透過 window 事件來通知
      window.dispatchEvent(new CustomEvent('open-order-query', {
        detail: { orderNumber }
      }))
    }, 100)
  }
})
</script>