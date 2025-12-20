<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
    <div class="px-4 py-4">
      <!-- Top row: 價格詳情 on left, Total price on right -->
      <div class="flex items-center justify-between mb-4">
        <div 
          class="flex items-center gap-2 text-others-gray7 text-sm cursor-pointer"
          @click="isExpanded = !isExpanded"
        >
          <span>價格詳情</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': !isExpanded }"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <div v-if="!isExpanded" class="flex items-baseline justify-center gap-1">
          <span class="text-others-gray5 text-sm">{{ totalLabel }}&nbsp;</span>
          <span class="text-others-original text-sm font-semibold">{{ currency }}</span>
          <span class="text-others-original font-bold text-[24px]">{{ formatPrice(effectiveTotal) }}</span>
        </div>
      </div>

      <!-- Expanded price breakdown -->
      <div v-if="isExpanded" class="space-y-3 mb-4">
        <!-- Adult section -->
        <div v-if="adultTotal && adultTotal > 0" class="space-y-2">
          <div class="flex items-baseline justify-between text-primary-gold font-semibold text-sm">
            <span>成人機票總額</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(adultTotal) }}
            </div>
          </div>
          <div
            v-for="(line, idx) in effectiveLines.filter((l: any) => l.label.includes('成人'))"
            :key="'adult-' + idx"
            class="flex justify-between text-others-gray1 text-sm pl-3"
          >
            <span>{{ line.label }}</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
            </div>
          </div>
        </div>
        
        <!-- Child section -->
        <div v-if="childTotal && childTotal > 0" class="space-y-2">
          <div class="flex items-baseline justify-between text-primary-gold font-semibold text-sm">
            <span>兒童機票總額</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(childTotal) }}
            </div>
          </div>
          <div
            v-for="(line, idx) in effectiveLines.filter((l: any) => l.label.includes('兒童'))"
            :key="'child-' + idx"
            class="flex justify-between text-others-gray1 text-sm pl-3"
          >
            <span>{{ line.label }}</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
            </div>
          </div>
        </div>
        
        <!-- Infant section -->
        <div v-if="infantTotal && infantTotal > 0" class="space-y-2">
          <div class="flex items-baseline justify-between text-primary-gold font-semibold text-sm">
            <span>嬰兒機票總額</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(infantTotal) }}
            </div>
          </div>
          <div
            v-for="(line, idx) in effectiveLines.filter((l: any) => l.label.includes('嬰兒'))"
            :key="'infant-' + idx"
            class="flex justify-between text-others-gray1 text-sm pl-3"
          >
            <span>{{ line.label }}</span>
            <div class="flex items-end">
              {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
            </div>
          </div>
        </div>

        <div class="my-2 border-t border-others-gray3"></div>
        
        <!-- Payable total -->
        <div class="flex items-baseline justify-between">
          <span class="text-primary-gold font-semibold text-sm">{{ totalLabel }}</span>
          <div class="flex items-end font-bold text-others-original">
            <div class="text-xs pr-1">{{ currency }}</div>
            <div class="text-xl leading-none">
              {{ formatPrice(effectiveTotal) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Agreement checkbox -->
      <div class="mb-4 flex gap-2 items-start text-xs text-slate-600 select-none">
        <label class="flex mt-[3px] items-center cursor-pointer relative">
          <input 
            type="checkbox"
            class="peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
            v-model="localAgreed"
          />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <span>
          我已閱讀「
          <span 
            class="text-others-original cursor-pointer hover:text-others-hover" 
            @click="handleOpenBookingInstruction"
          >
            訂購須知
          </span>
          」(含個資聲明）並同意其內容
        </span>
      </div>

      <!-- Submit button -->
      <button
        class="w-full rounded-[10px] bg-others-original py-3 font-semibold text-white hover:bg-others-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        <svg 
          v-if="isSubmitting" 
          class="animate-spin h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isSubmitting ? '處理中...' : '送出訂單' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatPrice } from '@/utils'

type Line = {
  label: String
  amount: number
  qty?: number
}

const props = defineProps<{
  titleLabel?: string
  totalLabel?: string
  currency?: string
  effectiveLines: Array<{ label: string | String; amount: number; qty?: number }>
  effectiveTotal: number
  adultTotal?: number
  childTotal?: number
  infantTotal?: number
  agreed: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  'update:agreed': [value: boolean]
  'submit': []
  'open-booking-instruction': []
}>()

const isExpanded = ref(false)
const localAgreed = computed({
  get: () => props.agreed,
  set: (value) => emit('update:agreed', value)
})

function handleSubmit() {
  emit('submit')
}

function handleOpenBookingInstruction() {
  emit('open-booking-instruction')
}
</script>

