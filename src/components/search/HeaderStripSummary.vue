<template>
  <div :class="noMargin ? 'bg-none' : 'mb-4 bg-none'">
    <div class="relative flex rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] bg-others-gray4 h-full">
      <!-- Summary card: compact version for other leg -->
      <div class="relative flex flex-col justify-between px-3 py-2.5 w-[100px] flex-shrink-0 h-full">
        <!-- Title -->
        <div class="text-white text-sm font-semibold mb-1">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '@/utils'

defineProps<{
  segmentTitle: string
  timeRange?: string | null
  price?: number | null
  currency?: string
  noMargin?: boolean
}>()
</script>

