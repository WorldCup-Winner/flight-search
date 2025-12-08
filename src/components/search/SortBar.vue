<template>
  <div class="bg-white px-4 py-3 drop-shadow-[0px_2px_10px_rgba(0,0,0,0.15)] rounded-[10px]">
    <!-- Mobile: Total count + Sort/Filter buttons -->
    <div class="flex items-center justify-between md:hidden">
      <!-- Total count on left -->
      <div class="text-sm text-others-gray1">
        共找到 <span class="font-bold text-others-gray7">{{ totalCount }}</span> 筆航班
      </div>
      
      <!-- Sort and Filter buttons on right -->
      <div class="flex items-center gap-3">
        <!-- Sort button -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-others-original"
          @click="$emit('sort-click')"
        >
          <font-awesome-icon icon="bars" class="text-base" />
          <span class="text-sm font-medium">排序</span>
        </button>
        
        <!-- Filter button with badge -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-others-original"
          @click="$emit('filter-click')"
        >
          <font-awesome-icon icon="sliders" class="text-base" />
          <span class="relative text-sm font-medium">
            篩選
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {{ activeFilterCount }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Desktop: Original sort buttons + Tax toggle -->
    <div class="hidden md:flex md:flex-wrap md:items-center md:gap-4">
      <button class="px-4 py-2 rounded-[10px]"
        :class="sort.key === 'direct' ? 'text-others-original' : 'text-others-gray7'"
        @click="$emit('sort-change', 'direct', 'asc')">
        直飛優先
      </button>

      <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
        :class="sort.key === 'price' ? 'text-others-original' : 'text-others-gray7'"
        @click="$emit('sort-toggle', 'price')">
        <span>價格</span>
        <div class="space-y-[-5px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'price' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M6 14l6-6 6 6" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'price' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M18 10l-6 6-6-6"/>
          </svg>
        </div>
      </button>
      <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
        :class="sort.key === 'depTime' ? 'text-others-original' : 'text-others-gray7'"
        @click="$emit('sort-toggle', 'depTime')">
        <span>出發時間</span>
        <div class="space-y-[-5px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'depTime' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M6 14l6-6 6 6" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'depTime' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M18 10l-6 6-6-6"/>
          </svg>
        </div>
      </button>
      <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
        :class="sort.key === 'arrTime' ? 'text-others-original' : 'text-others-gray7'"
        @click="$emit('sort-toggle', 'arrTime')">
        <span>抵達時間</span>
        <div class="space-y-[-5px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'arrTime' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M6 14l6-6 6 6" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'arrTime' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M18 10l-6 6-6-6"/>
          </svg>
        </div>
      </button>
      <button class="px-3 py-2 rounded-[10px] flex items-center gap-1"
        :class="sort.key === 'duration' ? 'text-others-original' : 'text-others-gray7'"
        @click="$emit('sort-toggle', 'duration')">
        <span>飛行總時間</span>
        <div class="space-y-[-5px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'duration' && sort.dir === 'asc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M6 14l6-6 6 6" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="sort.key === 'duration' && sort.dir === 'desc' ? 'text-others-original' : 'text-others-gray1'">
            <path d="M18 10l-6 6-6-6"/>
          </svg>
        </div>
      </button>

      <div class="ml-auto">
        <!-- Tax segmented control -->
        <div class="rounded-[10px] p-2 inline-flex gap-2 border-[1.5px] border-primary-gold">
          <button class="px-6 py-1 rounded-md text-sm"
            :class="taxMode === 'in' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
            @click="$emit('update:taxMode', 'in')">含稅</button>
          <button class="px-6 py-1 rounded-md text-sm"
            :class="taxMode === 'ex' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-white'"
            @click="$emit('update:taxMode', 'ex')">未稅</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalCount: number
  activeFilterCount: number
  sort: { key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'; dir: 'asc' | 'desc' }
  taxMode: 'in' | 'ex'
}>()

defineEmits<{
  (e: 'sort-click'): void
  (e: 'filter-click'): void
  (e: 'sort-change', key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration', dir: 'asc' | 'desc'): void
  (e: 'sort-toggle', key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'): void
  (e: 'update:taxMode', mode: 'in' | 'ex'): void
}>()
</script>

