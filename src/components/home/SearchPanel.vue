<template>
  <div class="bg-white rounded-t-3xl md:rounded-2xl md:rounded-br-none shadow-2xl p-4 md:p-8 md:px-14 w-full mx-auto max-w-6xl">
    <div class="flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-0">
      <!-- Title -->
      <h1 v-if="!hideTitle" class="text-h3 md:text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

      <!-- Tab Navigation -->
      <div class="flex space-x-2 justify-center px-2 md:px-4 py-2 md:py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
        <button
          @click="setTab('roundtrip')"
          :class="[
            'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
            activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]"
        >
          來回
        </button>
        <button
          @click="setTab('oneway')"
          :class="[
            'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
            activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]"
        >
          單程
        </button>
        <button
          @click="setTab('multi')"
          :class="[
            'px-3 md:px-6 min-w-[80px] md:min-w-[148px] min-h-[32px] md:min-h-[38px] py-1.5 md:py-2 rounded-lg font-medium transition text-sm md:text-base',
            activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]"
        >
          多行程
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'roundtrip'">
      <RoundSearchBox
        @search="payload => emit('roundtrip-search', payload)"
        :initialParams="restoredParams"
      />
    </div>
    <div v-else-if="activeTab === 'oneway'">
      <SingleSearchBox
        @search="payload => emit('oneway-search', payload)"
        :initialParams="restoredParams"
      />
    </div>
    <div v-else-if="activeTab === 'multi'">
      <MultiSearchBox
        @search="payload => emit('multi-search', payload)"
        :initialParams="restoredParams"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RoundSearchBox from '@/components/home/RoundSearchBox.vue'
import SingleSearchBox from '@/components/home/SingleSearchBox.vue'
import MultiSearchBox from '@/components/home/MultiSearchBox.vue'

type TripTab = 'oneway' | 'roundtrip' | 'multi'

const props = defineProps<{
  activeTab: TripTab
  restoredParams?: any | null
  hideTitle?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', value: TripTab): void
  (e: 'roundtrip-search', payload: any): void
  (e: 'oneway-search', payload: any): void
  (e: 'multi-search', payload: any): void
}>()

function setTab(tab: TripTab) {
  if (tab !== props.activeTab) {
    emit('update:activeTab', tab)
  }
}
</script>


