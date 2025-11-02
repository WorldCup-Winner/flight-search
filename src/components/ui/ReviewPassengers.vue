<template>
  <div class="fixed inset-0 z-50 top-0 bg-black/30 w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="flex flex-col bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h3 class="text-others-gray1 text-h3 md:text-h3-d mb-2">訂購前,請務必仔細檢查以下資料</h3>
          <p class="text-others-original text-sm">姓名為開票依據,必須與護照拼音完全相同,若有錯誤將無法搭機</p>
        </div>
        <img :src="AwesomeIcon" class="w-20 h-20 ml-4 flex-shrink-0" />
      </div>

      <!-- Passenger Cards -->
      <div class="space-y-4 mb-8">
        <div v-for="(passenger, index) in passengers" :key="index" class="bg-white border border-others-gray3 rounded-lg drop-shadow-sm p-4 flex">
          <!-- Passenger Type Label -->
          <div :class="[
            'px-4 py-2 rounded-l-lg text-white flex-shrink-0 flex items-center justify-center',
            passenger.type === 'adult' ? 'bg-primary-gold' : 'bg-others-original'
          ]">
            <span class="font-bold">
              {{ passenger.type === 'adult' ? '成人' : '兒童' }}{{ getPassengerNumber(index) }}
            </span>
          </div>
          
          <!-- Passenger Details -->
          <div class="grid grid-cols-2 w-full">
            <div class="col-span-1 pl-4 space-y-1">
              <div class="text-others-gray1">
                姓氏&nbsp;&nbsp;&nbsp;<span class="font-bold">{{ passenger.lastName }}</span>
              </div>
              <div class="text-others-gray1">
                名字&nbsp;&nbsp;&nbsp;<span class="font-bold">{{ passenger.firstName }}</span>
              </div>
            </div>
          
            <div class="col-span-1 text-others-gray1">
              性別&nbsp;&nbsp;&nbsp;<span class="font-bold">{{ passenger.gender === 'male' ? '男' : '女' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4">
        <button
          class="px-6 py-2 border border-others-original text-others-original bg-white rounded-md hover:bg-others-original hover:text-white transition"
          @click="handleCancel"
        >
          返回修改
        </button>
        <button
          class="px-6 py-2 bg-others-original text-white rounded-md hover:bg-others-hover transition"
          @click="handleConfirm"
        >
          確認無誤
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AwesomeIcon from "@/assets/imgs/awesome.png"
import { defineEmits, computed } from 'vue'

interface Passenger {
  lastName: string
  firstName: string
  gender: string
  type: 'adult' | 'child'
}

const props = defineProps<{
  passengers: Passenger[]
}>()

const emit = defineEmits<{ (e: 'confirm'): void, (e: 'cancel'): void }>()

function getPassengerNumber(index: number): string {
  const sameTypePassengers = props.passengers.filter(p => p.type === props.passengers[index].type)
  const typeIndex = sameTypePassengers.findIndex(p => 
    p.lastName === props.passengers[index].lastName && 
    p.firstName === props.passengers[index].firstName
  )
  return String(typeIndex + 1)
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

