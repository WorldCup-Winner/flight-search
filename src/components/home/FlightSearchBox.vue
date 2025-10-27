<template>
  <div :class="[ sharedValue?.isSearch ? 'mt-32' : 'mt-80' ]">
    <div class="relative z-10 flex items-center justify-center">
      <div class="bg-white rounded-2xl rounded-br-none shadow-2xl p-8 px-14 w-full mx-auto max-w-6xl">
        <div class="flex justify-between w-full">
          <!-- Title -->
          <h1 class="text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

          <!-- Tab Navigation -->
          <div class="flex space-x-2 px-4 py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
            <button @click="activeTab = 'roundtrip'" :class="[
              'px-6 min-w-[148px] min-h-[38px] py-2 rounded-lg font-medium transition',
              activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">來回</button>
            <button @click="activeTab = 'oneway'" :class="[
              'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
              activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">單程</button>
            <button @click="activeTab = 'multi'" :class="[
              'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
              activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
            ]">多行程</button>
          </div>
        </div>
        <div v-if="activeTab == 'roundtrip'">
          <RoundSearchBox @search="handleSearchFlight" />
        </div>
        <div v-else-if="activeTab === 'oneway'">
          <SingleSearchBox @search="handleSearchFlight" />
        </div>
        <div v-else-if="activeTab === 'multi'">
          <MultiSearchBox @search="handleSearchFlight" />
        </div>
      </div>
    </div>
    <div class="mt-24">
      <div v-if="flightSearchStore.loading === 'default'">
        <BannerImg />
        <RecommendedTrips />
      </div>
      <SearchResultLoading v-else-if="flightSearchStore.loading === 'loading'" v-model="state" :rows="11" :speed="1300" />
      <ResultsMain 
        v-else-if="flightSearchStore.loading === 'success'" 
        :data="flightSearchStore.data" 
        :tripType="activeTab"
        :searchRequest="currentSearchRequest"
        :currentSegmentIndex="currentSegmentIndex"
        :selectedSegments="selectedSegments"
        @searchNextSegment="handleSearchNextSegment"
      />
    </div>
    
    <Transition name="fade">
        <BaggageInfoAndFeeRule :open="sharedValue?.isOpenBaggageInfoAndFeeRule" :fareRuleData="sharedValue?.fareRuleData" @close="updateValue?.({ isOpenBaggageInfoAndFeeRule: false, fareRuleData: undefined })" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'

import { useFlightSearchStore } from '@/stores/flightSearch'

import MultiSearchBox from '@/components/home/MultiSearchBox.vue'
import SingleSearchBox from '@/components/home/SingleSearchBox.vue'
import RoundSearchBox from "@/components/home/RoundSearchBox.vue"
import RecommendedTrips from '@/components/home/RecommendedTrips.vue'
import BannerImg from '@/components/home/BannerImg.vue'
import SearchResultLoading from '@/components/ui/SearchResultLoading.vue'
import ResultsMain from '@/components/search/ResultsMain.vue';
import BaggageInfoAndFeeRule from '@/components/ui/BaggageInfoAndFeeRule.vue'
import { useAirlineStore } from '@/stores/airline'

// Store
const flightSearchStore = useFlightSearchStore()
const airlineStore = useAirlineStore()
const activeTab = ref('roundtrip')
const state = ref('default') // "default" | "loading" | "result"
const currentSearchRequest = ref<any>(null)
const currentSegmentIndex = ref(0)
const selectedSegments = ref<any[]>([])

interface SharedData {
  isOpenBaggageInfoAndFeeRule?: boolean,
  isSearch?: boolean,
  fareRuleData?: any,
}

const sharedValue = inject<{ isOpenBaggageInfoAndFeeRule: boolean; isSearch: boolean; fareRuleData?: any }>('sharedValue')
const updateValue = inject<(val: SharedData) => void>('updateValue')

function handleSearchFlight(payload: any) {
  console.log('handleSearchFlight:', payload)
  currentSearchRequest.value = payload
  currentSegmentIndex.value = 0 // Reset to first segment
  selectedSegments.value = [] // Clear selected segments for new search
  flightSearchStore.fetchFlightSearch(payload)
  airlineStore.fetchAirlineAlliance()
  
  updateValue?.({ isSearch: true })
}

function handleSearchNextSegment(payload: { selectedRefNumbers: number[]; selectedSegments?: any[] }) {
  console.log('handleSearchNextSegment:', payload)
  
  // Store selected segments if provided
  if (payload.selectedSegments && payload.selectedSegments.length > 0) {
    selectedSegments.value = payload.selectedSegments
  }

  if (currentSearchRequest.value) {
    // Update the search request with selectedRefNumbers
    const updatedRequest = {
      ...currentSearchRequest.value,
      selectedRefNumbers: payload.selectedRefNumbers
    }
    
    // Increment segment index
    currentSegmentIndex.value += 1
    
    flightSearchStore.fetchFlightSearch(updatedRequest)
  }
}
</script>
<style scoped>
/* subtle entrance for the small modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all .15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
