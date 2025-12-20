<template>
  <div :class="noMargin ? 'bg-none' : 'mb-4 bg-none'">
    <div 
      :class="[
        'relative flex rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] h-full',
        currentLeg === 'outbound' ? 'bg-others-gray11' : 'bg-primary-gold',
        isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
        ]"
      @click="handleClick"
    >
      <!-- Summary card: compact version for other leg -->
      <div class="relative flex flex-col justify-between px-3 py-2.5 w-[100px] flex-shrink-0 h-full">
        <!-- Skeleton state -->
        <template v-if="isLoading">
          <!-- Title skeleton -->
          <div class="skel h-4 w-16 rounded mb-1.5"></div>
          
          <!-- Time range skeleton -->
          <div class="skel h-3 w-20 rounded mb-0.5"></div>
          
          <!-- Price skeleton -->
          <div class="space-y-1">
            <div class="skel h-3 w-12 rounded"></div>
            <div class="skel h-5 w-20 rounded"></div>
          </div>
        </template>
        
        <!-- Actual content -->
        <template v-else>
          <!-- Title -->
          <div class="text-white text-sm font-semibold mb-1.5">
            {{ segmentTitle }}
          </div>

          <!-- Time range -->
          <div v-if="timeRange" class="text-white text-xs mb-0.5">
            {{ timeRange }}
          </div>
          <div v-else class="text-white/60 text-xs mb-0.5">
            未選擇
          </div>

          <!-- Price -->
          <div v-if="price" class="text-white">
            <span class="text-xs">{{ currency }}&nbsp;</span>
            <span class="text-md font-bold">{{ formatPrice(price) }}</span>
          </div>
          <div v-else class="text-white/60 text-md">
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

