<script setup lang="ts">
import { inject, computed, ref, onMounted, type Ref } from 'vue'
import { getKeyVisuals, type KeyVisual } from '@/api'
import topBg from '@/assets/imgs/top-bg.png'
import topBgMobile from '@/assets/imgs/top-bg-mobile.png'

const sharedValue = inject<Ref<{ isOpenBaggageInfoAndFeeRule: boolean; isSearch: boolean }>>('sharedValue')

const keyVisuals = ref<KeyVisual[]>([])
const currentIndex = ref(0)

const heroHeightClass = computed(() => {
  const isSearch = sharedValue?.value?.isSearch
  return isSearch ? 'h-[320px] md:h-[300px]' : 'h-[420px] md:h-[500px]'
})

// 取得當前顯示的主視覺圖片（依裝置類型）
const getCurrentVisual = computed(() => {
  if (keyVisuals.value.length === 0) return null
  return keyVisuals.value[currentIndex.value]
})

// 取得 PC 圖片 URL
const getPcImageUrl = (visual: KeyVisual | null) => {
  if (!visual) return topBg
  const pcPicture = visual.pictures.find(p => p.pictureType === 0)
  return pcPicture?.pictureUrl || topBg
}

// 取得 Mobile 圖片 URL
const getMobileImageUrl = (visual: KeyVisual | null) => {
  if (!visual) return topBgMobile
  const mobilePicture = visual.pictures.find(p => p.pictureType === 1)
  return mobilePicture?.pictureUrl || topBgMobile
}

onMounted(async () => {
  try {
    const { data } = await getKeyVisuals()
    if (data.head.code === 0 && data.data.length > 0) {
      // 按 displayOrder 排序
      keyVisuals.value = data.data.sort((a, b) => a.displayOrder - b.displayOrder)
      
      // 如果有多張圖片，啟動自動輪播
      if (keyVisuals.value.length > 1) {
        setInterval(() => {
          currentIndex.value = (currentIndex.value + 1) % keyVisuals.value.length
        }, 5000) // 每 5 秒切換一次
      }
    }
  } catch (error) {
    console.error('Failed to load key visuals:', error)
    // 使用預設圖片作為 fallback
  }
})
</script>

<template>
  <div class="absolute inset-x-0 top-0 w-full pointer-events-none">
    <div class="relative w-full overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" :srcset="getPcImageUrl(getCurrentVisual)" />
        <img
          :src="getMobileImageUrl(getCurrentVisual)"
          :alt="getCurrentVisual?.name || 'Galilee Tours hero'"
          class="w-full object-cover"
          :class="heroHeightClass"
        />
      </picture>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
    </div>
  </div>
</template>
