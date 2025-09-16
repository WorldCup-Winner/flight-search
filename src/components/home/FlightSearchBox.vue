<script setup lang="ts">
import { ref } from 'vue'

// trip type state
const tripType = ref<'round' | 'oneway' | 'multi'>('round')

// mock values (will be replaced by API / user input)
const from = ref('TPE 台北(任何)')
const to = ref('')
const departDate = ref('2025/10/12 (五)')
const returnDate = ref('2025/10/24 (三)')
const passengers = ref('1成人 / 0孩童')

// options
const airlines = ['星宇航空', '長榮航空', '中華航空']
const classes = ['經濟艙', '商務艙', '頭等艙']
</script>

<template>
  <div class="bg-white rounded-2xl p-6 w-full max-w-5xl mx-auto shadow-xl">
    <div class="flex justify-between">
      <!-- Title -->
      <h2 class="text-[32px] text-text-muted mb-4">機票搜尋</h2>

      <!-- Trip Type Tabs -->
      <div class="flex space-x-2 p-3 w-max border-primary-gold border-[2px] rounded-tl-lg rounded-tr-lg border-b-0">
        <button v-for="type in [
          { key: 'round', label: '來回' },
          { key: 'oneway', label: '單程' },
          { key: 'multi', label: '多行程' }
        ]" :key="type.key" @click="tripType = type.key as any" class="w-[150px] px-4 py-2 rounded-lg" :class="tripType === type.key
          ? 'bg-primary-gold text-white'
          : 'bg-primary-gold1 text-text-muted'
          ">
          {{ type.label }}
        </button>
      </div>
    </div>
    <!-- Input Grid -->
    <div
      class="grid grid-cols-5 border-primary-gold border-[2px] rounded-tl-lg rounded-bl-lg rounded-br-lg overflow-hidden">
      <div class="p-6 col-span-2 border-primary-gold border-r-2 flex items-center justify-between">
        <div>
          <p class="text-sm text-primary-gold mb-1 font-bold">出發地</p>
          <p class="font-medium text-text-muted">{{ from }}</p>
        </div>
        <img class="w-[20px] h-[20px]" src=" @/assets/imgs/arrow-both.png" />
        <div>
          <p class="text-sm text-primary-gold mb-1 font-bold">目的地</p>
          <input type="text" placeholder="輸入國家/城市/機場關鍵字" v-model="to"
            class="w-full bg-transparent focus:outline-none font-medium text-text-muted" />
        </div>
      </div>

      <!-- Depart -->
      <div class="p-6 col-span-2 border-primary-gold border-r-2 flex items-center justify-between">
        <div>
          <p class="text-sm text-primary-gold mb-1 font-bold">去程</p>
          <p class="font-medium text-text-muted">{{ departDate }}</p>
        </div>
        <img class="w-[20px] h-[5px]" src=" @/assets/imgs/arrow-right.png" />
        <div>
          <p class="text-sm text-primary-gold mb-1 font-bold">回程</p>
          <p class="font-medium text-text-muted">{{ returnDate }}</p>
        </div>
      </div>

      <!-- Passengers -->
      <div class="p-6 col-span-1">
        <p class="text-sm text-primary-gold mb-1 font-bold">人數</p>
        <p class="font-medium text-text-muted">{{ passengers }}</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex items-center justify-between mt-4">
      <div class="flex space-x-3">
        <!-- Airline -->
        <select
          class="flex items-center justify-between w-[200px] px-3 py-1.5 bg-gray-100 text-primary-gold text-sm rounded-md shadow-sm">
          <option disabled selected>星宇航空</option>
          <option v-for="air in airlines" :key="air">{{ air }}</option>
        </select>

        <!-- Class -->
        <select
          class="flex items-center justify-between w-[150px] px-3 py-1.5 bg-gray-100 text-primary-gold text-sm rounded-md shadow-sm">
          <option disabled selected>艙等</option>
          <option v-for="cls in classes" :key="cls">{{ cls }}</option>
        </select>

        <!-- Direct Flight -->
        <label
          class="flex items-center justify-between w-[100px] space-x-1 px-3 py-1.5 bg-gray-100 text-primary-gold text-sm rounded-md shadow-sm">
          <span>直飛</span>
          <input type="checkbox" class="form-checkbox" />
        </label>
      </div>

      <!-- Search Button -->
      <button class="bg-btn-confirm hover:bg-orange-600 text-white font-medium text-text-muted rounded-xl px-6 py-2">
        搜尋
      </button>
    </div>
  </div>
</template>
