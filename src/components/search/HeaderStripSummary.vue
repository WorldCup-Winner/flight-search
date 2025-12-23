<template>
  <div :class="[noMargin ? 'h-full bg-none' : 'mb-4 bg-none']">
    <div 
      :class="[
        'relative flex drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] h-full',
        attachRight ? 'rounded-l-[10px]' : attachLeft ? 'rounded-r-[10px]' : 'rounded-[10px]',
        // Outbound leg shows gold, return leg shows gray11
        currentLeg === 'outbound' ? 'bg-primary-gold' : 'bg-others-gray11',
        isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
        ]"
      @click="handleClick"
    >
      <!-- Summary card: compact version for other leg -->
      <div class="relative flex flex-col justify-between px-2 py-1.5 w-[100px] flex-shrink-0 h-full">
        <!-- Skeleton state -->
        <template v-if="isLoading">
          <!-- Title skeleton -->
          <div class="skel h-3 w-16 rounded mb-0.5"></div>
          
          <!-- Time range skeleton -->
          <div class="skel h-2 w-20 rounded mb-0.5"></div>
          
          <!-- Price skeleton -->
          <div class="space-y-1">
            <div class="skel h-3 w-12 rounded"></div>
            <div class="skel h-5 w-20 rounded"></div>
          </div>
        </template>
        
        <!-- Actual content -->
        <template v-else>
          <!-- Title -->
          <div class="text-white text-[11px] font-semibold mb-0.5">
            {{ segmentTitle }}
          </div>

          <!-- Time range -->
          <div v-if="timeRange" class="text-white text-[12px]">
            {{ timeRange }}
          </div>
          <div v-else class="text-white/60 text-xs">
            未選擇
          </div>

          <!-- Price -->
          <div v-if="price" class="text-white">
            <span class="text-xs">{{ currency }}&nbsp;</span>
            <span class="text-[14px] font-bold">{{ formatPrice(price) }}</span>
          </div>
          <div v-else class="text-white/60 text-[14px]">
            --
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '@/utils'

const props = defineProps<{
  currentLeg: 'outbound' | 'return'
  segmentTitle: string
  timeRange?: string | null
  price?: number | null
  currency?: string
  noMargin?: boolean
  isLoading?: boolean
  isClickable?: boolean
  attachRight?: boolean
  attachLeft?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  // Only emit if clickable and not loading
  if (props.isClickable && !props.isLoading) {
    emit('click')
  }
}
</script>

<style scoped>
/* Skeleton loading animation with shimmer effect */
.skel {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  100% { 
    transform: translateX(100%); 
  }
}
</style>

