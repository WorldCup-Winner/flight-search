<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getPromotionBigs, type PromotionBig } from '@/api'

const promotionBigs = ref<PromotionBig[]>([])
const currentIndex = ref(0)

// 取得當前顯示的促銷大圖
const currentPromotion = computed(() => {
  if (promotionBigs.value.length === 0) return null
  return promotionBigs.value[currentIndex.value]
})

// 取得圖片 URL（優先使用 PC 圖片，若無則使用 Mobile 圖片）
const getImageUrl = (promotion: PromotionBig | null) => {
  if (!promotion || promotion.pictures.length === 0) return undefined
  const pcPicture = promotion.pictures.find(p => p.pictureType === 0)
  const mobilePicture = promotion.pictures.find(p => p.pictureType === 1)
  return (pcPicture || mobilePicture)?.pictureUrl || undefined
}

onMounted(async () => {
  try {
    const { data } = await getPromotionBigs()
    if (data.head.code === 0 && data.data.length > 0) {
      // 按 displayOrder 排序
      promotionBigs.value = data.data.sort((a, b) => a.displayOrder - b.displayOrder)
      
      // 如果有多張圖片，啟動自動輪播
      if (promotionBigs.value.length > 1) {
        setInterval(() => {
          currentIndex.value = (currentIndex.value + 1) % promotionBigs.value.length
        }, 6000) // 每 6 秒切換一次
      }
    }
  } catch (error) {
    console.error('Failed to load promotion bigs:', error)
  }
})
</script>

<template>
  <section v-if="currentPromotion && getImageUrl(currentPromotion)">
    <a 
      :href="currentPromotion.link" 
      :target="currentPromotion.targetWindow === 0 ? '_blank' : '_self'"
    >
      <img
        :src="getImageUrl(currentPromotion)"
        :alt="currentPromotion.name"
        class="w-full aspect-square md:aspect-auto md:h-auto rounded-lg shadow-lg mx-auto max-w-6xl object-cover"
      />
    </a>
  </section>
</template>
