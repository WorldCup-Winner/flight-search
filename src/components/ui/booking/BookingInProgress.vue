<template>
  <div class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
    <div class="bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="px-4 md:px-8 py-6 md:py-8">
        <!-- Header: Mascot and Title -->
        <div class="flex flex-col md:flex-row-reverse md:justify-between items-center mb-6">
          <img :src="AwesomeIcon" alt="提醒" class="w-20 h-20 md:w-24 md:h-24 mb-4" />
          <div class="md:flex md:flex-col md:items-start">
            <h3 class="text-others-gray1 text-xl md:text-2xl font-bold text-center mb-3">
              訂購前，請務必仔細檢查以下資料
            </h3>
            <p class="text-others-original text-sm md:text-base text-left w-full">
              姓名為開票依據，必須與護照拼音完全相同，若有錯誤將無法搭機
            </p>
          </div>
        </div>

        <!-- Passenger Cards -->
        <div class="space-y-4 mb-6">
          <div
            v-for="(passenger, index) in passengers"
            :key="index"
            class="bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] flex overflow-hidden"
          >
            <!-- Passenger Type Tab (Left) -->
            <div
              :class="[
                'flex items-center justify-center px-3 py-4 text-white font-bold flex-shrink-0 min-w-[60px]',
                getPassengerTabColor(passenger.type)
              ]"
            >
              <span class="text-center whitespace-nowrap">
                {{ getPassengerTypeLabel(passenger.type) }}{{ getPassengerNumber(index) }}
              </span>
            </div>

            <!-- Passenger Details -->
            <div class="flex-1 px-4 py-4">
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row justify-between md:justify-start px-2">
                  <div class="text-others-gray1">
                    姓氏 <span class="font-bold text-black">{{ passenger.lastName }}</span>
                  </div>
                  <div class="text-others-gray1 md:ml-36">
                    性別 <span class="font-bold text-black">{{ passenger.gender === 'male' ? '男' : '女' }}</span>
                  </div>
                </div>
                <div class="text-others-gray1 px-2">
                  名字 <span class="font-bold text-black">{{ passenger.firstName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="bg-others-gray3 h-2 rounded-full overflow-hidden">
            <div class="bg-others-original h-full rounded-full animate-pulse" style="width: 60%"></div>
          </div>
        </div>

        <!-- Loading Text -->
        <div class="text-center text-others-gray1">
          正在為您預訂，請稍後~
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AwesomeIcon from "@/assets/imgs/awesome.png"

interface Passenger {
  lastName: string
  firstName: string
  gender: string
  type: 'adult' | 'child' | 'infant'
}

const props = defineProps<{
  passengers: Passenger[]
}>()

function getPassengerTypeLabel(type: string): string {
  switch (type) {
    case 'adult':
      return '成人'
    case 'child':
      return '兒童'
    case 'infant':
      return '嬰兒'
    default:
      return '成人'
  }
}

function getPassengerTabColor(type: string): string {
  switch (type) {
    case 'adult':
      return 'bg-primary-gold'
    case 'child':
      return 'bg-others-original'
    case 'infant':
      return 'bg-others-original'
    default:
      return 'bg-primary-gold'
  }
}

function getPassengerNumber(index: number): string {
  const passenger = props.passengers[index]
  const sameTypePassengers = props.passengers.filter(p => p.type === passenger.type)
  const typeIndex = sameTypePassengers.findIndex(p => 
    p.lastName === passenger.lastName && 
    p.firstName === passenger.firstName
  )
  return String(typeIndex + 1)
}
</script>

