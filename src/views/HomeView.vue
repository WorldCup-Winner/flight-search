<template>
  <main>
    <HeroSection />
    <FlightSearchBox />
    <BannerImg />
    <RecommendedTrips />
    <!-- <SearchResultLoading v-model="loading" :rows="11" :speed="1300" /> -->
    <!-- <ResultsMain /> -->
  </main>
</template>
<script setup lang="ts">
import { ref } from "vue"
import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'
import RecommendedTrips from '@/components/home/RecommendedTrips.vue'
import BannerImg from '@/components/home/BannerImg.vue'
import SearchResultLoading from '@/components/ui/SearchResultLoading.vue'
import ResultsMain from '@/components/search/ResultsMain.vue';

const loading = ref(true)

</script>