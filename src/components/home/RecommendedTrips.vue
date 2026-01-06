<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TripCard from './TripCard.vue'
import { getPromotionSmalls, type PromotionSmall } from '@/api'
import trip1 from '@/assets/imgs/trips/1.jpg'
import trip2 from '@/assets/imgs/trips/2.jpg'
import trip3 from '@/assets/imgs/trips/3.jpg'
import trip4 from '@/assets/imgs/trips/4.jpg'
import trip5 from '@/assets/imgs/trips/5.jpg'
import trip6 from '@/assets/imgs/trips/6.jpg'

const promotionSmalls = ref<PromotionSmall[]>([])

// 預設行程（作為 fallback）
const defaultTrips = [
  { title: '新加坡・濱海灣遊記', desc: '新加坡鑽耀飯店隨選，在熱帶雨林與紅毛猩猩共進早餐，最特別的南洋假期', img: trip1, url: 'https://www.galilee.com.tw/singapore_malaysia' },
  { title: '英法雙國．歐洲之星', desc: '體驗歐洲之星跨海高速火車 ，一趟旅行，一次蒐集倫敦風雅．巴黎時尚', img: trip2, url: 'https://www.galilee.com.tw/europe' },
  { title: '馬爾地夫．全包式渡假村', desc: '兩人成行．傾聽舒柔的海浪聲，步出陽台即可跳入私人泳池', img: trip3, url: 'https://www.galilee.com.tw/maldives' },
  { title: '菲律賓．宿霧海漾跳島', desc: '與鯨鯊共游、沙丁魚風暴、七彩珊瑚礁，與大海共譜感動時刻', img: trip4, url: 'https://www.galilee.com.tw/Philippines' },
  { title: '兩人啟程．泰國五星假期', desc: '曼谷．華欣．清邁．蘇美島雙城自由隨選，訂做您的奢宿假期', img: trip5, url: 'https://www.galilee.com.tw/thailand' },
  { title: '日本行，我做主', desc: '家族旅遊、親子出行，讓加利利旅遊顧問為您安排自由又省力的日本行', img: trip6, url: 'https://www.galilee.com.tw/japan_package' }
]

// 轉換 API 資料為 TripCard 所需格式
const trips = computed(() => {
  if (promotionSmalls.value.length === 0) {
    return defaultTrips
  }
  
  return promotionSmalls.value.map(promo => {
    // 取得圖片 URL（優先使用 PC 圖片）
    const pcPicture = promo.pictures.find(p => p.pictureType === 0)
    const mobilePicture = promo.pictures.find(p => p.pictureType === 1)
    const imgUrl = (pcPicture || mobilePicture)?.pictureUrl || trip1
    
    return {
      title: promo.title,
      desc: promo.content,
      img: imgUrl,
      url: promo.link,
      targetWindow: promo.targetWindow
    }
  })
})

onMounted(async () => {
  try {
    const { data } = await getPromotionSmalls()
    if (data.head.code === 0 && data.data.length > 0) {
      // 按 displayOrder 排序
      promotionSmalls.value = data.data.sort((a, b) => a.displayOrder - b.displayOrder)
    }
  } catch (error) {
    console.error('Failed to load promotion smalls:', error)
    // 使用預設行程作為 fallback
  }
})
</script>

<template>
  <section class="relative py-24 flex items-center justify-center h-full">
    <div class="w-full max-w-6xl mx-auto">
      <h1 class="text-h1a mb-6 md:text-h1a-d font-light">推薦自由行</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <TripCard 
          v-for="trip in trips" 
          :key="trip.title" 
          v-bind="trip" 
        />
      </div>
    </div>
  </section>
</template>
