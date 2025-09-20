<template>
  <main>
    <HeroSection />
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import { ref } from "vue"
import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'
</script>