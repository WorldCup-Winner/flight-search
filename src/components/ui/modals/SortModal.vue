<template>
  <transition name="fade-scale">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] bg-black/40 flex items-end md:hidden"
      @click.self="$emit('close')"
    >
      <div class="flex flex-col w-full bg-white rounded-t-3xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0 z-20 rounded-t-3xl">
          <span>排序設定</span>
          <button
            class="text-white hover:opacity-80 transition"
            @click="$emit('close')"
            aria-label="關閉"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Sort Options Content -->
        <div class="flex-1 overflow-y-auto min-h-0">
          <div class="py-2">
            <!-- 直飛優先 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'direct' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('direct', 'asc')"
            >
              直飛優先
            </button>
            <hr class="border-others-gray3" />

            <!-- 價格低 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'price' && sort.dir === 'asc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('price', 'asc')"
            >
              價格低
            </button>
            <!-- 價格高 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'price' && sort.dir === 'desc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('price', 'desc')"
            >
              價格高
            </button>
            <hr class="border-others-gray3" />

            <!-- 出發時間早 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'depTime' && sort.dir === 'asc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('depTime', 'asc')"
            >
              出發時間早
            </button>
            <!-- 出發時間晚 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'depTime' && sort.dir === 'desc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('depTime', 'desc')"
            >
              出發時間晚
            </button>
            <hr class="border-others-gray3" />

            <!-- 抵達時間早 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'arrTime' && sort.dir === 'asc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('arrTime', 'asc')"
            >
              抵達時間早
            </button>
            <!-- 抵達時間晚 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'arrTime' && sort.dir === 'desc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('arrTime', 'desc')"
            >
              抵達時間晚
            </button>
            <hr class="border-others-gray3" />

            <!-- 最快抵達 -->
            <button
              type="button"
              class="w-full text-left px-6 py-4 text-base transition-colors hover:bg-others-gray9"
              :class="sort.key === 'duration' && sort.dir === 'asc' ? 'text-others-original font-semibold' : 'text-others-gray1'"
              @click="handleClick('duration', 'asc')"
            >
              最快抵達
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  sort: { key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'; dir: 'asc' | 'desc' }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration', dir: 'asc' | 'desc'): void
}>()

function handleClick(key: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration', dir: 'asc' | 'desc') {
  emit('select', key, dir)
  emit('close')
}
</script>

